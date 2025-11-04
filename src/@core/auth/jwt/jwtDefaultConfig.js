// ** Auth Endpoints
export default {
  //  loginEndpoint: '/jwt/login', //temp
  loginEndpoint: "/login",

  registerEndpoint: "/jwt/register",
  refreshEndpoint: "/auth/refresh_token",
  logoutEndpoint: "/jwt/logout",

  tokenType: "Bearer",
  // ** Admin Endpoint
  slipCategory: "/slipCategory/",
  slipCategoryGet: "/slipCategory",

  slip: "/slip/",
  slipGet: "/slip",
  sVessel: "/sVessel/",
  sVesselGet: "/sVessel",
  retriveVessel: "/sVessel/",
  sMember: "/sMember/",

  retriveMember: "/sMember/",
  UpdateMember: "/sMember/",

  createPayment: "/sPayment/",
  // user  login
  checktoken: "/auth/user/check_token/",
  chnagePassword: "/auth/user/change_password/",
  registerUser: "/auth/user/create",
  login: "/auth/login",
  verifyAccount: "/auth/verify_account/",
  sendEmail: "/auth/user/reset_password",
  createPass: "/auth/user/create_password/",
  resend_Otp: "/auth/user/resend_Otp/",
  resend_OtpCall: "sPayment/generate/call/discount",
  generate: "/googleAuthenticatorQR/generate",
  verifyQr: "/googleAuthenticatorQR/verify-qr",
  disable: "/googleAuthenticatorQR/disable",
  mobileOtp: "/auth/verify_accountForAuth/",
  status: "/googleAuthenticatorQR/status",
  sendOtp: "/auth/user/send_otp/",

  // verify otp for cash payment
  otpForCash: "/sPayment/otpForCash",
  verifyCash: "/sPayment/verifyCash/",
  // verify Email and Login api
  verifyEmail: "/auth/verifyEmail",
  loginPassword: "/auth/login/",

  //roles and permissions
  userpermissionPost: "/userpermission/",
  userpermission: "/userpermission",

  permission: "/permission",

  deleteRole: "/userpermission/",
  updateRole: "/userpermission/",

  createUser: "/sub_user/",
  getallSubuser: "/sub_user",
  deleteSubUser: "/sub_user/",
  updateSubuser: "/sub_user/",

  getMemberDetails: "/auth/sPayment/decrypt-token?token=",

  slipAssignmentGet: "/slipAssignmentGet",
  GenerateOtp: "/sPayment/generate",
  // verifyOTP: "/sPayment/verify/",

  verifyOTP: "/sPayment/discount/",

  slipDocument: "/sDocuments/",
  getSingleDocuments: "/sDocuments/slip/",
  updateDoc: "/sDocuments/",
  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: "accessToken",
  storageRefreshTokenKeyName: "refreshToken",

  totalPayment: "/auth/sPayment/",
  //POS : Vender Management

  addVender: "/vendor/",
  editvender: "/vendor/",
  deleteVender: "/vendor/",
  getAllVendor: "/vendor",

  //pos: Tax
  productTax: "/productTax/",
  updateTax: "/productTax/",
  deleteTax: "/productTax/",
  getAlltax: "/productTax",

  //add Category
  addProductCategory: "/productCategory/",
  getProductCategory: "/productCategory",
  editProductCategory: "/productCategory/",
  deleteProductCategory: `/productCategory/`,

  //pos add producct
  addProduct: "/product/",

  //get all vendor
  getVendor: "/vendor",

  //parking pass add
  addPass: "/parkingPass/",
  editpass: "/parkingPass/",
  getAll: "/parkingPass",
  Delete: "/parkingPass/",
  GetMember: "/sMember",
  ParkingPayment: "/parkingPaymnet/payment",

  guest: "/sMember/guest",
  memberpark: "/parkingPaymnet/allocation",

  //Event and vendor management
  DeleteEtype: "/eventType/",
  EventType: "/eventType/",
  VendorType: "/vendorType/",
  getAllEventType: "/eventType",
  Venue: "/venue/",
  getAllVenue: "venue",
  UpdateEventType: "/eventType/",
  updateVenue: "/venue/",
  DeleteVenue: "/venue/",
  DeleteVendorType: "/vendorType/",
  getAllVendor: "/vendor",
  getAllVendorType: "/vendorType",
  updateVendor: "/vendorType/",
  getAllEvents: "/events",
  createEvent: "/events/",
  DeleteEvent: "/events/",
  UpdateEventAndPayment: "/event/complete-payment",

  Parentvendor: "/vendorType/",

  //payment
  GenerateOtp: "/sPayment/generate/discount",
  verifyOtp: "/sPayment/discount/",
  payment: "/event/payment",

  //Room management

  CreateRoomType: "/roomType/",
  CreateRoom: "/room/",
  getAllRoomTypes: "/roomType",
  SearchRoom: "/room/search",
  PreviewSubmit: "/booking/",
  submitBookedRooms: "/roomSearch/",
  bookingList: "/booking",
  bookingPayment: "/booking/payment",
  GetAllRooms: "/room",
  UpdateRooms: "/room/",
  DeleteRooms: "/room/",
  //room Type Update and delete
  DeleteRoomType: "roomType/",
  UpdateRoomType: "roomType/",

  ExtendDate: "/booking/extend-guest/",

  ExtendDataUpdate: "/booking/extend",

  //cancle event
  cancleEvent: "/events/cancel/",
  // cancle rooms
  cancleRooms: "/events/cancelrooms/",
  //add eextra room
  addExtraRoom: "/events/addrooms/",
  getAllProduct: "/product",
  deleteProduct: "/product/",
  updateProduct: "/product/products/",
  updateProductVariation: "/product/variations/",
  updateProductSpecification: "/product/specifications/",
  addStocks: "/productVariation/addStock/",
  // getImage: "/productVariationImage/sImages/file/",

  //Customer
  addNewCustomerEndPoint: "/customer/",
  getAllCustomer: "/customer",
  getWalkinCustomer: "/customer/walkInCus",
  qtypos: "/pos/order",
  posProductdis: "/pos/assCustDis",
  posPayment: "/pos/payment",

  //customer management
  addCustomer: "/customer/",
  updateCustomer: "/customer/",
  deleteCustomer: "/customer/",
  getAllCustomer: "/customer",

  //get images of products
  getImages: "/productVariationImage/sImages/file/",
  //rent Roll
  viewRentRollEndpoint: "/slipRentRoll/rent-roll",
  InversionRentRollEndpoint: "slipRentRoll/inverse-rent-roll",

  //virtual Terminal
  virtualTerminalEndPoint: "/virtualTerminal",
  getWalkinCustomerEndPoint: "/customer/walkInCus",

  //Generate Qr
  getAllEventQrEndPoint: "/eventQrCode",
  getVariationUid: "/pos/",
  updatedQty: "/pos/updateQuantity/",

  getAllEventQrEndPoint: "/eventQrCode",
  getVariationUid: "/pos/",
  updatedQty: "/pos/updateQuantity/",
  addQrEndPoint: "/eventQrCode",
  decriptQrCodeToeknEndPoint: "/auth/qrCode/decrypt-token?token=",
  qrPaymentEndPoint: "/auth/eventQrCode/",

  deleteCartProduct: "/pos/",
  //view documents
  existingImages: "/sDocuments/uploaded_files/",
  updateDocuments: "/sDocuments/",

  // donwload Receipt
  downloadReceipt: "/sPayment/receipt/",

  //sales charts
  sucessPaymentCharts: "/sPayment/",
  daysOfWeek: "/sPayment/weekly-success",
  salesByhour: "/sPayment/today-payment-graph",

  yearlySales: "/sPayment/yearly-comparison",
  weeklySales: "/sPayment/weekly-comparison",
  dailySales: "/sPayment/time-of-day-comparison",

  report: "/sPayment/report",

  // Switch Slip
  getSwitchSlipEndPoint: "/slipSwitch/",
  getSwitchSlipEndPointById: "/slipSwitch",
  renewContractEndPoint: "/sPayment/renewContract",
  otherPaymentEndPoint: "/sPayment/otherSlip",
  renewContractEndPoint: "/sPayment/renewContract",

  //sales in Accounting

  //ledger
  getUserData: "/ledger/",

  //Event Document
  eventDocument: "/eventDocuments/",
  eventDocUpdate: "/eventDocuments/",
  getEventDocument: "/eventDocuments/uploaded_files/",

  //waiting sllip
  createWaitingSlip: "/waitingMember/",
  updateWaitingSlip: "/waitingMember/",
  deleteWaiting: "/waitingMember/",
  getAllWaiting: "/waitingMember",

  //offline slip 
  offlineSlip:"/slip/offline/",
};
