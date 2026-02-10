import axios from "axios";
import jwtDefaultConfig from "./jwtDefaultConfig";

// axios.defaults.baseURL = "http://192.168.1.9:8000"; // locktrust
axios.defaults.baseURL = "https://marinaone.locktrust.com/api"; 
// axios.defaults.baseURL = "https://locktrustdev.com:8443";
// axios.defaults.baseURL = "http://192.168.29.190:8000/"; // locktrust jio 5g
// axios.defaults.baseURL = "http://192.168.1.9:8000"; //airtel saga

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default class JwtService {
  jwtConfig = { ...jwtDefaultConfig };

  isAlreadyFetchingAccessToken = false;

  // ** For Refreshing Token
  subscribers = [];

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };

    // ** Request Interceptor
    axios.interceptors.request.use(
      async (config) => {
        // ** Get token from localStorage
        const accessToken = this.getToken();

        // ** Get Location
        const location = await this.getLocation();

        // ** Get IP
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const userIp = ipData.ip;

        if (location && userIp) {
          config.headers["X-IP"] = userIp;
          config.headers["X-Location"] = Object.values(location).join(",");
        }

        if (accessToken) {
          config.headers.Authorization = `${
            this.jwtConfig.tokenType
          } ${accessToken.slice(1, -1)}`;
        }

        //branch code write here
        const selectedUserStr = localStorage.getItem("selectedBranch");

        let branchUid = null;

        if (selectedUserStr) {
          try {
            const selectedBranch = JSON.parse(selectedUserStr);
            branchUid = selectedBranch.uid;
          } catch (err) {
            console.error("Invalid selectedBranch JSON in localStorage", err);
          }
        }

        // if (branchUid && ["post", "put", "patch"].includes(config.method)) {
        //   config.data = {
        //     ...(config.data || {}),
        //     branch: {
        //       uid: branchUid,
        //     },
        //   };
        // }

        if (
          branchUid &&
          ["post", "put", "patch"].includes(config.method) &&
          !config.skipBranch
        ) {
          config.data = {
            ...(config.data || {}),
            branch: { uid: branchUid },
          };
        }
        if (branchUid && config.method === "delete") {
          config.data = {
            branch: {
              uid: branchUid,
            },
          };
        }

        if (
          branchUid &&
          config.method === "get" &&
          config.appendBranchUid === true
        ) {
          config.url = `${config.url.replace(/\/$/, "")}/${branchUid}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // ** const { config, response: { status } } = error
        const { config, response } = error;
        const originalRequest = config;

        // ** if (status === 401) {

        if (response && response.status === 419) {
          window.location = "/Login";
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;
            this.refreshToken().then((r) => {
              this.isAlreadyFetchingAccessToken = false;

              // ** Update accessToken in localStorage
              this.setToken(r.data.token);
              this.setRefreshToken(r.data.refreshToken);

              this.onAccessTokenFetched(r.data.accessToken);
            });
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken) => {
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
              resolve(this.axios(originalRequest));
            });
          });
          return retryOriginalRequest;
        }

        return Promise.reject(error);
      },
    );
  }

  async getLocation() {
    try {
      if (!navigator.geolocation) {
        localStorage.setItem("locationEnabled", "false");
        throw new Error("Geolocation is not supported by your browser.");
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const location = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      };

      localStorage.setItem("locationEnabled", "true");
      return location;
    } catch (error) {
      localStorage.setItem("locationEnabled", "false");

      // Handle permission denied
      if (error.code === 1) {
        Swal.fire({
          icon: "warning",
          title: "Location Access Denied",
          text: "Please allow location access to continue.",
        }).then(() => {
          localStorage.removeItem("userData");
          // window.location.replace("/login");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Location Error",
          text: error.message || "Unable to fetch location.",
        });
      }

      throw error; // Rethrow to prevent request from proceeding
    }
  }
  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken),
    );
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName);
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value);
  }

  // temp

  // login(...args) {
  //   return axios.post(this.jwtConfig.loginEndpoint, ...args)
  // }

  getVendor() {
    return axios.get(this.jwtConfig.getVendor, {
      appendBranchUid: true,
    });
  }

  // ==================== Slip Category

  postslipCatogory(...args) {
    return axios.post(this.jwtConfig.slipCategory, ...args);
  }
  getslipCatogory() {
    return axios.get(this.jwtConfig.slipCategoryGet, {
      appendBranchUid: true,
    });
  }
  updateslipCatogory(uid, ...args) {
    return axios.put(`${this.jwtConfig.slipCategory}${uid}`, ...args);
  }
  deleteslipCatogory(uid) {
    return axios.delete(`${this.jwtConfig.slipCategory}${uid}`);
  }

  // ===================== Slip Details

  retriveSlip(uid) {
    return axios.get(`${this.jwtConfig.retriveSingleSlip}/${uid}/`, {
      appendBranchUid: true,
    });
  }
  postslip(...args) {
    return axios.post(this.jwtConfig.slip, ...args);
  }
  getslip() {
    return axios.get(`${this.jwtConfig.slipGet}`, {
      appendBranchUid: true,
    });
  }

  updateslip(uid, ...args) {
    return axios.put(`${this.jwtConfig.slip}${uid}`, ...args);
  }
  deleteslip(uid) {
    return axios.delete(`${this.jwtConfig.slip}${uid}`);
  }
  // ==================== Slip Vessel

  postsVessel(...args) {
    return axios.post(this.jwtConfig.sVessel, ...args);
  }
  updateVessel(uid, ...args) {
    return axios.put(`${this.jwtConfig.sVessel}${uid}`, ...args);
  }
  getVessel(uid = "") {
    return axios.get(`${this.jwtConfig.sVesselGet}/${uid}`);
  }
  retriveVessel(uid = "") {
    return axios.get(this.jwtConfig.retriveVessel + uid);
  }
  // ==================== Slip Member

  postsMember(...args) {
    return axios.post(this.jwtConfig.sMember, ...args);
  }

  retriveMember(uid = "") {
    return axios.get(this.jwtConfig.retriveMember + uid);
  }

  UpdateMember(uid, ...args) {
    return axios.put(`${this.jwtConfig.UpdateMember}${uid}`, ...args);
  }

  // =================== Payment

  createPayment(...args) {
    return axios.post(this.jwtConfig.createPayment, ...args, {
      skipBranch: true,
    });
  }

  totalPayment(token, ...args) {
    return axios.post(`${this.jwtConfig.totalPayment}${token}`, ...args);
  }

  getPayment(...args) {
    return axios.get(this.jwtConfig.getPayment, ...args);
  }

  otpForCash(...args) {
    return axios.post(this.jwtConfig.otpForCash, ...args);
  }

  verifyCash(token, ...args) {
    return axios.post(`${this.jwtConfig.verifyCash}${token}`, ...args);
  }

  getMemberDetails(token, ...args) {
    return axios.get(`${this.jwtConfig.getMemberDetails}${token}`, ...args);
  }

  // =================== Register

  // registerUser(...args) {
  //   return axios.post(this.jwtConfig.registerUser, ...args);
  // }

  // =================== Login
  checktoken(token, ...args) {
    return axios.get(this.jwtConfig.checktoken + token, ...args);
  }

  verifyEmail(...args) {
    return axios.post(this.jwtConfig.verifyEmail, ...args);
    // return axios.post(this.jwtConfig.loginEndpoint, ...args);
  }

  loginPassword(token, ...args) {
    return axios.post(this.jwtConfig.loginPassword + token, ...args);
  }

  chnagePassword(token, ...args) {
    return axios.post(this.jwtConfig.chnagePassword + token, ...args);
  }

  sendOtp(token = "") {
    return axios.get(this.jwtConfig.sendOtp + token);
    // return axios.post(this.jwtConfig.loginEndpoint, ...args);
  }

  sendEmail(...args) {
    return axios.post(this.jwtConfig.sendEmail, ...args);
  }

  createPass(resettoken = "", ...args) {
    return axios.post(this.jwtConfig.createPass + resettoken, ...args);
  }

  verifyAccount(token = "", ...args) {
    return axios.post(this.jwtConfig.verifyAccount + token, ...args);
  }

  resend_Otp(token = "") {
    return axios.get(this.jwtConfig.resend_Otp + token);
  }
  resend_OtpCall(...args) {
    return axios.post(this.jwtConfig.resend_OtpCall, ...args);
  }

  generate() {
    return axios.post(this.jwtConfig.generate);
  }

  verifyQr(...args) {
    return axios.post(this.jwtConfig.verifyQr, ...args, {
      skipBranch: true,
    });
  }

  disable() {
    return axios.post(this.jwtConfig.disable);
  }
  mobileOtp(token = "", ...args) {
    return axios.post(this.jwtConfig.mobileOtp + token, ...args);
  }

  status() {
    return axios.get(this.jwtConfig.status);
  }
  // =================== roles and permissions

  createUser(payload) {
    return axios.post(this.jwtConfig.createUser, payload);
  }

  userpermissionPost(...data) {
    return axios.post(this.jwtConfig.userpermissionPost, ...data);
  }

  userpermission(params = "") {
    return axios.get(this.jwtConfig.userpermission + params, {
      appendBranchUid: true,
    });
  }
  permission() {
    return axios.get(this.jwtConfig.permission);
  }

  deleteRole(uid) {
    return axios.delete(`${this.jwtConfig.deleteRole}${uid}`);
  }

  // updateRole(uid, ...args) {
  //   return axios.put(`${this.jwtConfig.updateRole}${uid}`, ...args);
  // }

  updateRole(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateRole}${uid}`, ...args);
  }
  getallSubuser(paramas = "") {
    return axios.get(`${this.jwtConfig.getallSubuser}${paramas}`, {
      appendBranchUid: true,
    });
  }

  updateSubuser(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateSubuser}${uid}`, ...args);
  }

  deleteSubUser(uid) {
    return axios.delete(`${this.jwtConfig.deleteSubUser}${uid}`);
  }

  getslipAssignment() {
    return axios.get(this.jwtConfig.slipAssignmentGet);
  }

  GenerateOtp(payload) {
    return axios.post(this.jwtConfig.GenerateOtp, payload);
  }

  // verifyOTP(token, ...data) {
  //   return axios.post(this.jwtConfig.verifyOTP + token, ...data);
  // }

  // Pos- Vender management

  addVender(...args) {
    return axios.post(this.jwtConfig.addVender, ...args);
  }
  editvender(uid, ...args) {
    return axios.put(`${this.jwtConfig.editvender}${uid}`, ...args);
  }

  deleteVender(uid) {
    return axios.delete(`${this.jwtConfig.deleteVender}${uid}`);
  }

  getAllVendor() {
    return axios.get(`${this.jwtConfig.getAllVendor}`, {
      appendBranchUid: true,
    });
  }
  // ===== tax product ====
  productTax(...args) {
    return axios.post(this.jwtConfig.productTax, ...args);
  }

  updateTax(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateTax}${uid}`, ...args);
  }

  deleteTax(uid) {
    return axios.delete(`${this.jwtConfig.deleteTax}${uid}`);
  }

  getAlltax() {
    return axios.get(`${this.jwtConfig.getAlltax}`, {
      appendBranchUid: true,
    });
  }

  async verifyOTP(token, ...data) {
    try {
      const response = await axios.post(
        `${this.jwtConfig.verifyOTP}${token}`,
        ...data,
      );
      return response.data;
    } catch (error) {
      console.error(
        "OTP Verification Failed:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  slipDocument(...args) {
    return axios.post(this.jwtConfig.slipDocument, ...args, {
      skipBranch: true,
    });
  }

  getSingleDocuments(slipId) {
    return axios.get(`${this.jwtConfig.getSingleDocuments}${slipId}`);
  }

  updateDoc(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateDoc}${uid}`, ...args, {
      skipBranch: true,
    });
  }

  addProductCategory(...args) {
    return axios.post(this.jwtConfig.addProductCategory, ...args, {
      skipBranch: true,
    });
  }

  getProductCategory() {
    return axios.get(this.jwtConfig.getProductCategory, {
      appendBranchUid: true,
    });
  }

  editProductCategory(uid, ...args) {
    return axios.put(`${this.jwtConfig.editProductCategory}${uid}`, ...args, {
      skipBranch: true,
    });
  }

  deleteProductCategory(uid) {
    return axios.delete(`${this.jwtConfig.editProductCategory}${uid}`);
  }

  addProduct(...args) {
    return axios.post(this.jwtConfig.addProduct, ...args, {
      skipBranch: true,
    });
  }

  // create parking pass

  addPass(...args) {
    return axios.post(this.jwtConfig.addPass, ...args);
  }
  editpass(uid, ...args) {
    return axios.put(`${this.jwtConfig.editpass}${uid}`, ...args);
  }
  getAll() {
    return axios.get(this.jwtConfig.getAll, {
      appendBranchUid: true,
    });
  }

  Delete(uid) {
    return axios.delete(`${this.jwtConfig.Delete}${uid}`);
  }

  guest() {
    return axios.get(this.jwtConfig.guest);
  }

  memberpark(...args) {
    return axios.post(this.jwtConfig.memberpark, ...args);
  }

  GetMember() {
    return axios.get(this.jwtConfig.GetMember, {
      appendBranchUid: true,
    });
  }

  ParkingPayment(...args) {
    return axios.post(this.jwtConfig.ParkingPayment, ...args);
  }

  EventType(...args) {
    return axios.post(this.jwtConfig.EventType, ...args);
  }

  VendorType(...args) {
    return axios.post(this.jwtConfig.VendorType, ...args);
  }

  getAllEventType() {
    return axios.get(this.jwtConfig.getAllEventType, {
      appendBranchUid: true,
    });
  }

  getAllVenue() {
    return axios.get(this.jwtConfig.getAllVenue, {
      appendBranchUid: true,
    });
  }

  Venue(...args) {
    return axios.post(this.jwtConfig.Venue, ...args);
  }

  DeleteEtype(uid) {
    return axios.delete(`${this.jwtConfig.DeleteEtype}${uid}`);
  }

  UpdateEventType(uid, ...args) {
    return axios.put(`${this.jwtConfig.UpdateEventType}${uid}`, ...args);
  }

  updateVenue(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateVenue}${uid}`, ...args);
  }

  DeleteVenue(uid) {
    return axios.delete(`${this.jwtConfig.DeleteVenue}${uid}`);
  }

  getAllVendor() {
    return axios.get(this.jwtConfig.getAllVendor, {
      appendBranchUid: true,
    });
  }

  getAllEvents() {
    return axios.get(this.jwtConfig.getAllEvents, {
      appendBranchUid: true,
    });
  }

  createEvent(...args) {
    return axios.post(this.jwtConfig.createEvent, ...args);
  }

  DeleteVendorType(uid) {
    return axios.delete(`${this.jwtConfig.DeleteVendorType}${uid}`);
  }

  getAllVendorType() {
    return axios.get(this.jwtConfig.getAllVendorType, {
      appendBranchUid: true,
    });
  }

  updateVendor(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateVendor}${uid}`, ...args);
  }

  GenerateOtp(...args) {
    return axios.post(this.jwtConfig.GenerateOtp, ...args);
  }

  verifyOtp(token, ...args) {
    return axios.post(`${this.jwtConfig.verifyOtp}${token}`, ...args);
  }

  payment(...args) {
    return axios.post(this.jwtConfig.payment, ...args, {
      skipBranch: true,
    });
  }
  DeleteEvent(uid) {
    return axios.delete(`${this.jwtConfig.DeleteEvent}${uid}`);
  }

  CreateRoomType(...args) {
    return axios.post(this.jwtConfig.CreateRoomType, ...args);
  }

  CreateRoom(...args) {
    return axios.post(this.jwtConfig.CreateRoom, ...args);
  }

  getAllRoomTypes() {
    return axios.get(this.jwtConfig.getAllRoomTypes, {
      appendBranchUid: true,
    });
  }

  SearchRoom(branchUid, ...data) {
    return axios.post(`${this.jwtConfig.SearchRoom}/${branchUid}`, ...data, {
      skipBranch: true,
    });
  }

  submitBookedRooms(...args) {
    return axios.post(this.jwtConfig.submitBookedRooms, ...args);
  }

  PreviewSubmit(...args) {
    return axios.post(this.jwtConfig.PreviewSubmit, ...args);
  }

  bookingPayment(...args) {
    return axios.post(this.jwtConfig.bookingPayment, ...args, {
      skipBranch: true,
    });
  }

  bookingList() {
    return axios.get(this.jwtConfig.bookingList, {
      appendBranchUid: true,
    });
  }

  Parentvendor() {
    return axios.get(this.jwtConfig.Parentvendor, {
      appendBranchUid: true,
    });
  }

  UpdateRoomType(uid, ...args) {
    return axios.put(`${this.jwtConfig.UpdateRoomType}${uid}`, ...args);
  }

  DeleteRoomType(uid) {
    return axios.delete(`${this.jwtConfig.DeleteRoomType}${uid}`);
  }

  GetAllRooms() {
    return axios.get(this.jwtConfig.GetAllRooms, {
      appendBranchUid: true,
    });
  }

  UpdateRooms(uid, ...args) {
    return axios.put(`${this.jwtConfig.UpdateRooms}${uid}`, ...args);
  }

  DeleteRooms(uid) {
    return axios.delete(`${this.jwtConfig.DeleteRooms}${uid}`);
  }

  ExtendDate(uid, branchUid, ...args) {
    return axios.post(
      `${this.jwtConfig.ExtendDate}${uid}/${branchUid}`,
      ...args,
    );
  }
  ExtendDataUpdate(...args) {
    return axios.post(`${this.jwtConfig.ExtendDataUpdate}`, ...args);
  }

  UpdateEventAndPayment(...args) {
    return axios.post(`${this.jwtConfig.UpdateEventAndPayment}`, ...args, {
      skipBranch: true,
    });
  }

  cancleEvent(uid) {
    return axios.post(`${this.jwtConfig.cancleEvent}${uid}`);
  }
  addExtraRoom(uid, ...args) {
    return axios.post(`${this.jwtConfig.addExtraRoom}${uid}`, ...args, {
      skipBranch: true,
    });
  }

  cancleRooms(uid, ...args) {
    return axios.post(`${this.jwtConfig.cancleRooms}${uid}`, ...args);
  }

  getAllProduct() {
    return axios.get(`${this.jwtConfig.getAllProduct}`, {
      appendBranchUid: true,
    });
  }

  deleteProduct(uid) {
    return axios.delete(`${this.jwtConfig.deleteProduct}${uid}`);
  }

  updateProduct(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateProduct}${uid}`, ...args);
  }
  updateProductVariation(uid, ...args) {
    return axios.put(
      `${this.jwtConfig.updateProductVariation}${uid}`,
      ...args,
      {
        skipBranch: true,
      },
    );
  }
  updateProductSpecification(uid, ...args) {
    return axios.put(
      `${this.jwtConfig.updateProductSpecification}${uid}`,
      ...args,
      {
        skipBranch: true,
      },
    );
  }

  addStocks(uid, ...args) {
    return axios.post(`${this.jwtConfig.addStocks}${uid}`, ...args);
  }

  getAllProduct() {
    return axios.get(`${this.jwtConfig.getAllProduct}`, {
      appendBranchUid: true,
    });
  }

  getImage(uid) {
    return axios.get(`${this.jwtConfig.getImage}${uid}`);
  }

  // create customer
  CreateNewCustomer(...args) {
    return axios.post(this.jwtConfig.addNewCustomerEndPoint, ...args);
  }

  getAllCustomers() {
    return axios.get(this.jwtConfig.getAllCustomer, {
      appendBranchUid: true,
    });
  }

  getWalkinCustomer() {
    return axios.get(this.jwtConfig.getWalkinCustomer);
  }

  qtypos(...args) {
    return axios.post(this.jwtConfig.qtypos, ...args);
  }
  posProductdis(...args) {
    return axios.post(this.jwtConfig.posProductdis, ...args);
  }

  posPayment(...args) {
    return axios.post(this.jwtConfig.posPayment, ...args, {
      skipBranch: true,
    });
  }

  addCustomer(...args) {
    return axios.post(this.jwtConfig.addCustomer, ...args);
  }

  updateCustomer(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateCustomer}${uid}`, ...args);
  }

  getAllCustomer() {
    return axios.get(`${this.jwtConfig.getAllCustomer}`, {
      appendBranchUid: true,
    });
  }

  deleteCustomer(uid) {
    return axios.delete(`${this.jwtConfig.deleteCustomer}${uid}`);
  }
  getImages(uid) {
    return axios.get(`${this.jwtConfig.getImages}${uid}`, {
      responseType: "blob", // 👈 this tells Axios to treat response as binary
    });
  }

  getVariationUid(vuid) {
    return axios.get(`${this.jwtConfig.getVariationUid}${vuid}/branch/`, {
      appendBranchUid: true,
    });
  }

  deleteCartProduct(uid, vuid) {
    return axios.delete(
      `${this.jwtConfig.deleteCartProduct}${uid}/items/${vuid}`,
    );
  }
  updatedQty(params) {
    return axios.put(`${this.jwtConfig.updatedQty}${params}`);
  }

  // refreshToken() {
  //   return axios.post(this.jwtConfig.refreshEndpoint, {
  //     refreshToken: this.getRefreshToken(),
  //   });
  // }

  existingImages(uid) {
    return axios.get(`${this.jwtConfig.existingImages}${uid}`, {
      responseType: "blob",
    });
  }

  updateDocuments(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateDocuments}${uid}`, ...args);
  }

  async refreshToken() {
    try {
      const response = await axios.post(this.jwtConfig.refreshEndpoint, {
        refreshToken: this.getRefreshToken(),
      });
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  // Rent Roll Services
  getViewRentRoll() {
    return axios.get(this.jwtConfig.viewRentRollEndpoint, {
      appendBranchUid: true,
    });
  }
  getInversionRentRoll() {
    return axios.get(this.jwtConfig.InversionRentRollEndpoint, {
      appendBranchUid: true,
    });
  }

  //Virtual Terminal
  NewCustomerInTerminal(...args) {
    return axios.post(this.jwtConfig.virtualTerminalEndPoint, ...args);
  }
  getWalkinCustomers() {
    return axios.get(this.jwtConfig.getWalkinCustomerEndPoint);
  }

  // Generate QR Codee
  getAllEventQRCode() {
    return axios.get(this.jwtConfig.getAllEventQrEndPoint, {
      appendBranchUid: true,
    });
  }

  addQrCode(...args) {
    return axios.post(this.jwtConfig.addQrEndPoint, ...args);
  }

  deleteQrCode(uid) {
    return axios.delete(`${this.jwtConfig.addQrEndPoint}/${uid}`);
  }

  updateQrCode(uid, ...args) {
    return axios.put(`${this.jwtConfig.addQrEndPoint}/${uid}`, ...args);
  }

  decodeQrToken(token, ...args) {
    return axios.get(
      `${this.jwtConfig.decriptQrCodeToeknEndPoint}${token}`,
      ...args,
    );
  }

  payQrCodePayment(token, ...args) {
    return axios.post(`${this.jwtConfig.qrPaymentEndPoint}${token}`, ...args);
  }

  getEventQRPaymentList() {
    return axios.get(this.jwtConfig.addQrEndPoint, {
      appendBranchUid: true,
    });
  }

  downloadReceipt(txnId) {
    return axios.get(`${this.jwtConfig.downloadReceipt}${txnId}`, {
      responseType: "blob", // important for binary data
    });
  }

  successPaymentCharts(buid, startDate, endDate) {
    return axios.get(
      `${
        this.jwtConfig.sucessPaymentCharts
      }success-payments/${buid}?startDate=${encodeURIComponent(
        startDate,
      )}&endDate=${encodeURIComponent(endDate)}`,
    );
  }

  daysOfWeek() {
    return axios.get(this.jwtConfig.daysOfWeek, {
      appendBranchUid: true,
    });
  }
  salesByhour() {
    return axios.get(this.jwtConfig.salesByhour, {
      appendBranchUid: true,
    });
  }

  yearlySales() {
    return axios.get(this.jwtConfig.yearlySales, {
      appendBranchUid: true,
    });
  }

  weeklySales(buid, type) {
    return axios.get(`${this.jwtConfig.weeklySales}/${buid}?type=${type}`);
  }

  dailySales(buid, type) {
    return axios.get(`${this.jwtConfig.dailySales}/${buid}?type=${type}`);
  }

  report(buid, startDate, endDate) {
    return axios.get(
      `${this.jwtConfig.report}/${buid}?fromDate=${startDate}&toDate=${endDate}`,
    );
  }

  //get Switch Slip
  getSwitchSlip() {
    return axios.get(this.jwtConfig.slipGet, {
      appendBranchUid: true,
    });
  }

  postSwitchSlip(...args) {
    return axios.post(this.jwtConfig.getSwitchSlipEndPoint, ...args);
  }

  postSwitchSlipById(buid, ...args) {
    return axios.post(
      `${this.jwtConfig.getSwitchSlipEndPointById}${buid}`,
      ...args,
      {
        skipBranch: true,
      },
    );
  }

  //get other Payment in slipmanagement
  getOtherPayment(mid) {
    return axios.get(`${this.jwtConfig.otherPaymentEndPoint}${mid}`);
  }

  getUserData(LezerId) {
    return axios.get(`${this.jwtConfig.getUserData}${LezerId}`, {
      appendBranchUid: true,
    });
  }

  eventDocument(...args) {
    return axios.post(this.jwtConfig.eventDocument, ...args, {
      skipBranch: true,
    });
  }

  eventDocUpdate(uid, ...args) {
    return axios.put(`${this.jwtConfig.eventDocUpdate}${uid}`, ...args, {
      skipBranch: true,
    });
  }

  getEventDocument(uid) {
    return axios.get(`${this.jwtConfig.getEventDocument}${uid}`, {
      responseType: "blob", // important for binary data
    });
  }
  renewContract(...args) {
    return axios.post(this.jwtConfig.renewContractEndPoint, ...args, {
      skipBranch: true,
    });
  }
  createWaitingSlip(...args) {
    return axios.post(this.jwtConfig.createWaitingSlip, ...args);
  }

  updateWaitingSlip(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateWaitingSlip}${uid}`, ...args);
  }

  deleteWaiting(uid) {
    return axios.delete(`${this.jwtConfig.deleteWaiting}${uid}`);
  }

  offlineSlip(uid) {
    return axios.delete(`${this.jwtConfig.offlineSlip}${uid}`);
  }

  getAllWaiting() {
    return axios.get(this.jwtConfig.getAllWaiting, {
      appendBranchUid: true,
    });
  }

  emailSmsSetting(...args) {
    return axios.post(this.jwtConfig.emailSmsSetting, ...args, {
      skipBranch: true,
    });
  }

  getSettings() {
    return axios.get(this.jwtConfig.getSettings);
  }

  updateSetting(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateSetting}${uid}`, ...args, {
      skipBranch: true,
    });
  }
  getShortcode() {
    return axios.get(this.jwtConfig.getShortcode);
  }

  getCalender() {
    return axios.get(this.jwtConfig.getCalender, {
      appendBranchUid: true,
    });
  }

  createTemaplte(...args) {
    return axios.post(this.jwtConfig.createTemaplte, ...args);
  }

  getAllTemplate() {
    return axios.get(this.jwtConfig.getAllTemplate);
  }

  getTemplateValues() {
    return axios.get(this.jwtConfig.getTemplateValues);
  }

  retriveRoom(uid, ...args) {

    return axios.get(`${this.jwtConfig.retriveRoom}${uid}`, {
      appendBranchUid: true,
    });
  }

  retriveEvent(uid) {
    return axios.get(`${this.jwtConfig.retriveEvent}${uid}`, {
      appendBranchUid: true,
    });
  }

  deleteWaiting(uid) {
    return axios.delete(`${this.jwtConfig.deleteWaiting}${uid}`);
  }

  updateTemplate(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateTemplate}${uid}`, ...args, {
      skipBranch: true,
    });
  }

  getAllBranch() {
    return axios.get(`${this.jwtConfig.getAllBranch}`);
  }
  updateBranch(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateBranch}${uid}`, ...args);
  }
  createBranch(...args) {
    return axios.post(this.jwtConfig.createBranch, ...args);
  }

  // getBranch(uid) {
  //   return axios.get(`${this.jwtConfig.getBranch}${uid},`,{
  //     appendBranchUid:true,
  //   });
  // }

  getBranch(uid) {
    return axios.get(`${this.jwtConfig.getBranch}${uid}`);
  }

  getBranchForuser(uid) {
    return axios.get(`${this.jwtConfig.getBranch}${uid}`, {
      skipBranch: true,
    });
  }

  declinePayment() {
    return axios.get(`${this.jwtConfig.declinePayment}`);
  }
  sucessPayment() {
    return axios.get(`${this.jwtConfig.sucessPayment}`);
  }

  autoPayment(id) {
    return axios.get(`${this.jwtConfig.autoPayment}${id}`, {
      appendBranchUid: true,
    });
  }

  upgradePlans(...args) {
    return axios.post(`${this.jwtConfig.upgradePlans}`, ...args);
  }

  apiForpaymentPage(...args) {
    return axios.post(`${this.jwtConfig.apiForpaymentPage}`, ...args);
  }

  subscriptionPayment(...args) {
    return axios.post(`${this.jwtConfig.subscriptionPayment}`, ...args);
  }

  forAUthMobileOtp(token = "", ...args) {
    return axios.post(this.jwtConfig.forAUthMobileOtp + token, ...args);
  }
  withoutAuthEmailOtp(token = "", ...args) {
    return axios.post(this.jwtConfig.withoutAuthEmailOtp + token, ...args);
  }

  invoiceSettings(...args) {
    return axios.post(this.jwtConfig.invoiceSettings, ...args, {
      skipBranch: true,
    });
  }

  updateInvoice(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateInvoice}${uid}`, ...args, {
      skipBranch: true,
    });
  }

  getInvoice() {
    return axios.get(`${this.jwtConfig.getInvoice}`);
  }

  invoivegetLogo(uid) {
    return axios.get(`${this.jwtConfig.invoivegetLogo}${uid}`, {
      responseType: "blob", // important for binary data
    });
  }

  getSignature(uid) {
    return axios.get(`${this.jwtConfig.getSignature}${uid}`, {
      responseType: "blob", // important for binary data
    });
  }

  subScriptionCal(...args) {
    return axios.post(`${this.jwtConfig.subScriptionCal}`, ...args);
  }
  sendInvoiceToMail(...args) {
    return axios.post(`${this.jwtConfig.sendInvoiceToMail}`, ...args);
  }

  createSetting(...args) {
    return axios.post(`${this.jwtConfig.createSetting}`, ...args, {
      skipBranch: true,
    });
  }
  getGeneralSettings() {
    return axios.get(`${this.jwtConfig.getGeneralSettings}`);
  }

  updateGeneralsetting(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateGeneralsetting}${uid}`, ...args, {
      skipBranch: true,
    });
  }

  createMannualEmail(...args) {
    return axios.post(`${this.jwtConfig.createMannualEmail}`, ...args);
  }

  getLogoAndName(userUid) {
    return axios.get(`${this.jwtConfig.getLogoAndName}${userUid}/`);
  }
  getMails() {
    return axios.get(`${this.jwtConfig.getMails}`);
  }

  getLogo(logoUId) {
    return axios.get(`${this.jwtConfig.getLogo}${logoUId}`, {
      responseType: "blob", // important for binary data
    });
  }

  getSlipCount(...args) {
    return axios.post(`${this.jwtConfig.getSlipCount}`, ...args);
  }
  roomCancle(uid, buid, ...args) {
    return axios.post(`${this.jwtConfig.roomCancle}${uid}/${buid}`, ...args, {
      skipBranch: true,
    });
  }

  updateProfile(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateProfile}${uid}`, ...args, {
      skipBranch: true,
    });
  }
  getDyanimicInfoOFSubscription(moduleName) {
    return axios.get(
      `${this.jwtConfig.getDyanimicInfoOFSubscription}${moduleName}`,
    );
  }
}
