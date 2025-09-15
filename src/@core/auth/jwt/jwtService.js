import axios from "axios";
import jwtDefaultConfig from "./jwtDefaultConfig";

axios.defaults.baseURL = "https://locktrustdev.com:8443";
// axios.defaults.baseURL = "http://192.168.29.190:8000"; // locktrust jio 5g
// axios.defaults.baseURL = "http://192.168.1.3:8000"; //airtel saga

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
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const userIp = ipData.ip;

        if (location && userIp) {
          config.headers["X-IP"] = userIp;
          config.headers["X-Location"] = Object.values(location).join(",");
        }

        // ** If token is present add it to request's Authorization Header

        if (accessToken) {
          // console.log("Access Token:", accessToken);

          // ** eslint-disable-next-line no-param-reassign
          // config.headers.Authorization = `${
          //   this.jwtConfig.tokenType
          // } ${accessToken.slice(1, -1)}`;

          config.headers.Authorization = `${
            this.jwtConfig.tokenType
          } ${accessToken.slice(1, -1)}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // ** const { config, response: { status } } = error
        const { config, response } = error;
        const originalRequest = config;

        // ** if (status === 401) {
        if (response && response.status === 403) {
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
      }
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
      console.log({ jwtServiceError: error });
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
      callback(accessToken)
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
    return axios.get(this.jwtConfig.getVendor);
  }

  // ==================== Slip Category

  postslipCatogory(...args) {
    return axios.post(this.jwtConfig.slipCategory, ...args);
  }
  getslipCatogory() {
    return axios.get(this.jwtConfig.slipCategoryGet);
  }
  updateslipCatogory(uid, ...args) {
    return axios.put(`${this.jwtConfig.slipCategory}${uid}`, ...args);
  }
  deleteslipCatogory(uid) {
    return axios.delete(`${this.jwtConfig.slipCategory}${uid}`);
  }

  // ===================== Slip Details

  postslip(...args) {
    return axios.post(this.jwtConfig.slip, ...args);
  }
  getslip(id = "") {
    return axios.get(`${this.jwtConfig.slipGet}${id ? "/" + id : ""}`);
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
    return axios.post(this.jwtConfig.createPayment, ...args);
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
  resend_OtpCall(token = "") {
    return axios.get(this.jwtConfig.resend_OtpCall + token);
  }

  generate() {
    return axios.post(this.jwtConfig.generate);
  }

  verifyQr(...args) {
    return axios.post(this.jwtConfig.verifyQr, ...args);
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
    return axios.get(this.jwtConfig.userpermission + params);
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
    return axios.get(`${this.jwtConfig.getallSubuser}${paramas}`);
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
    return axios.get(`${this.jwtConfig.getAllVendor}`);
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
    return axios.get(`${this.jwtConfig.getAlltax}`);
  }

  async verifyOTP(token, ...data) {
    try {
      const response = await axios.post(
        `${this.jwtConfig.verifyOTP}${token}`,
        ...data
      );
      return response.data;
    } catch (error) {
      console.error(
        "OTP Verification Failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  slipDocument(...args) {
    return axios.post(this.jwtConfig.slipDocument, ...args);
  }

  getSingleDocuments(slipId) {
    return axios.get(`${this.jwtConfig.getSingleDocuments}${slipId}`);
  }

  updateDoc(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateDoc}${uid}`, ...args);
  }

  addProductCategory(...args) {
    return axios.post(this.jwtConfig.addProductCategory, ...args);
  }

  getProductCategory() {
    return axios.get(this.jwtConfig.getProductCategory);
  }

  editProductCategory(uid, ...args) {
    return axios.put(`${this.jwtConfig.editProductCategory}${uid}`, ...args);
  }

  deleteProductCategory(uid) {
    return axios.delete(`${this.jwtConfig.editProductCategory}${uid}`);
  }

  addProduct(...args) {
    return axios.post(this.jwtConfig.addProduct, ...args);
  }

  // create parking pass

  addPass(...args) {
    return axios.post(this.jwtConfig.addPass, ...args);
  }
  editpass(uid, ...args) {
    return axios.put(`${this.jwtConfig.editpass}${uid}`, ...args);
  }
  getAll() {
    return axios.get(this.jwtConfig.getAll);
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
    return axios.get(this.jwtConfig.GetMember);
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
    return axios.get(this.jwtConfig.getAllEventType);
  }

  getAllVenue() {
    return axios.get(this.jwtConfig.getAllVenue);
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
    return axios.get(this.jwtConfig.getAllVendor);
  }

  getAllEvents() {
    return axios.get(this.jwtConfig.getAllEvents);
  }

  createEvent(...args) {
    return axios.post(this.jwtConfig.createEvent, ...args);
  }

  DeleteVendorType(uid) {
    return axios.delete(`${this.jwtConfig.DeleteVendorType}${uid}`);
  }

  getAllVendorType() {
    return axios.get(this.jwtConfig.getAllVendorType);
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
    return axios.post(this.jwtConfig.payment, ...args);
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
    return axios.get(this.jwtConfig.getAllRoomTypes);
  }

  SearchRoom(...args) {
    return axios.post(this.jwtConfig.SearchRoom, ...args);
  }

  submitBookedRooms(...args) {
    return axios.post(this.jwtConfig.submitBookedRooms, ...args);
  }

  PreviewSubmit(...args) {
    return axios.post(this.jwtConfig.PreviewSubmit, ...args);
  }

  bookingPayment(...args) {
    return axios.post(this.jwtConfig.bookingPayment, ...args);
  }

  bookingList() {
    return axios.get(this.jwtConfig.bookingList);
  }

  Parentvendor() {
    return axios.get(this.jwtConfig.Parentvendor);
  }

  UpdateRoomType(uid, ...args) {
    return axios.put(`${this.jwtConfig.UpdateRoomType}${uid}`, ...args);
  }

  DeleteRoomType(uid) {
    return axios.delete(`${this.jwtConfig.DeleteRoomType}${uid}`);
  }

  GetAllRooms() {
    return axios.get(this.jwtConfig.GetAllRooms);
  }

  UpdateRooms(uid, ...args) {
    return axios.put(`${this.jwtConfig.UpdateRooms}${uid}`, ...args);
  }

  DeleteRooms(uid) {
    return axios.delete(`${this.jwtConfig.DeleteRooms}${uid}`);
  }

  ExtendDate(uid, ...args) {
    return axios.post(`${this.jwtConfig.ExtendDate}${uid}`, ...args);
  }
  ExtendDataUpdate(...args) {
    return axios.post(`${this.jwtConfig.ExtendDataUpdate}`, ...args);
  }

  UpdateEventAndPayment(...args) {
    return axios.post(`${this.jwtConfig.UpdateEventAndPayment}`, ...args);
  }

  cancleEvent(uid) {
    return axios.post(`${this.jwtConfig.cancleEvent}${uid}`);
  }
  addExtraRoom(uid, ...args) {
    return axios.post(`${this.jwtConfig.addExtraRoom}${uid}`, ...args);
  }

  cancleRooms(uid, ...args) {
    return axios.post(`${this.jwtConfig.cancleRooms}${uid}`, ...args);
  }

  getAllProduct() {
    return axios.get(`${this.jwtConfig.getAllProduct}`);
  }

  deleteProduct(uid) {
    return axios.delete(`${this.jwtConfig.deleteProduct}${uid}`);
  }

  updateProduct(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateProduct}${uid}`, ...args);
  }
  updateProductVariation(uid, ...args) {
    return axios.put(`${this.jwtConfig.updateProductVariation}${uid}`, ...args);
  }
  updateProductSpecification(uid, ...args) {
    return axios.put(
      `${this.jwtConfig.updateProductSpecification}${uid}`,
      ...args
    );
  }

  addStocks(uid, ...args) {
    return axios.post(`${this.jwtConfig.addStocks}${uid}`, ...args);
  }


    getAllProduct() {
    return axios.get(`${this.jwtConfig.getAllProduct}`);
  }

  getImage(uid){
        return axios.get(`${this.jwtConfig.getImage}${uid}`);

  }
  
  // refreshToken() {
  //   return axios.post(this.jwtConfig.refreshEndpoint, {
  //     refreshToken: this.getRefreshToken(),
  //   });
  // }

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
}
