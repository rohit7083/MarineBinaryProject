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
  slipCategoryGet: "/slipCategory/branch",

  slip: "/slip/",
  retriveSingleSlip:'/slip',
  slipGet: "/slip/branch",
  sVessel: "/sVessel/",
  sVesselGet: "/sVessel/branch",
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
  userpermission: "/userpermission/branch/",

  permission: "/permission",

  deleteRole: "/userpermission/",
  updateRole: "/userpermission/",

  createUser: "/sub_user/",
  getallSubuser: "/sub_user/branch/getAll",
  deleteSubUser: "/sub_user/",
  updateSubuser: "/sub_user/",

  getMemberDetails: "/auth/sPayment/decrypt-token?token=",

  slipAssignmentGet: "/slipAssignmentGet/branch",
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
  getAllVendor: "/vendor/branch",

  //pos: Tax
  productTax: "/productTax/",
  updateTax: "/productTax/",
  deleteTax: "/productTax/",
  getAlltax: "/productTax/branch",

  //add Category
  addProductCategory: "/productCategory/",
  getProductCategory: "/productCategory/branch",
  editProductCategory: "/productCategory/",
  deleteProductCategory: `/productCategory/`,

  //pos add producct
  addProduct: "/product/",

  //get all vendor
  getVendor: "/vendor/branch",

  //parking pass add
  addPass: "/parkingPass/",
  editpass: "/parkingPass/",
  getAll: "/parkingPass/branch",
  Delete: "/parkingPass/",
  GetMember: "/sMember/branch",
  ParkingPayment: "/parkingPaymnet/payment",

  guest: "/sMember/guest",
  memberpark: "/parkingPaymnet/allocation",

  //Event and vendor management
  DeleteEtype: "/eventType/",
  EventType: "/eventType/",
  VendorType: "/vendorType/",
  getAllEventType: "/eventType/branch",
  Venue: "/venue/",
  getAllVenue: "venue/branch",
  UpdateEventType: "/eventType/",
  updateVenue: "/venue/",
  DeleteVenue: "/venue/",
  DeleteVendorType: "/vendorType/",
  getAllVendor: "/vendor/branch",
  getAllVendorType: "/vendorType/branch",
  updateVendor: "/vendorType/",
  getAllEvents: "/events/branch",
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
  getAllRoomTypes: "/roomType/branch",
  SearchRoom: "/room/search",
  PreviewSubmit: "/booking/",
  submitBookedRooms: "/roomSearch/",
  bookingList: "/booking/branch",
  bookingPayment: "/booking/payment",
  GetAllRooms: "/room/branch",
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
  getAllProduct: "/product/branch",
  deleteProduct: "/product/",
  updateProduct: "/product/products/",
  updateProductVariation: "/product/variations/",
  updateProductSpecification: "/product/specifications/",
  addStocks: "/productVariation/addStock/",
  // getImage: "/productVariationImage/sImages/file/",

  //Customer
  addNewCustomerEndPoint: "/customer/",
  getAllCustomer: "/customer/branch",
  getWalkinCustomer: "/customer/walkInCus",
  qtypos: "/pos/order",
  posProductdis: "/pos/assCustDis",
  posPayment: "/pos/payment",

  //customer management
  addCustomer: "/customer/",
  updateCustomer: "/customer/",
  deleteCustomer: "/customer/",
  getAllCustomer: "/customer/branch",

  //get images of products
  getImages: "/productVariationImage/sImages/file/",
  //rent Roll
  viewRentRollEndpoint: "/slipRentRoll/rent-roll/",
  InversionRentRollEndpoint: "slipRentRoll/inverse-rent-roll",

  //virtual Terminal
  virtualTerminalEndPoint: "/virtualTerminal",
  getWalkinCustomerEndPoint: "/customer/walkInCus/branch",

  //Generate Qr
  getAllEventQrEndPoint: "/eventQrCode/branch",
  getVariationUid: "/pos/",
  updatedQty: "/pos/updateQuantity/",

  getAllEventQrEndPoint: "/eventQrCode/branch",
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
  getSwitchSlipEndPointById: "/slipSwitch/preview/",
  renewContractEndPoint: "/sPayment/renewContract",
  otherPaymentEndPoint: "/sPayment/otherSlip/",
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
  getAllWaiting: "/waitingMember/branch",

  //offline slip
  offlineSlip: "/slip/offline/",

  //emailSMSsetting
  emailSmsSetting: "/emailSmsSetting/",
  getSettings: "/emailSmsSetting",

  updateSetting: "/emailSmsSetting/",
  getShortcode: "/auth/emailSmsShortCode",
  createTemaplte: "/templates/",
  getAllTemplate: "/templates",
  // getAllCalender
  getCalender: "/calender/getAll",
  getTemplateValues: "/emailSmsSetting",

  //retrive Room and Event Booking Details

  retriveRoom: "/booking/",
  retriveEvent: "/events/",

  updateTemplate: "/templates/",
  deleteWaiting: "/waitingMember/",

  getAllBranch: "/branch",
  createBranch: "/branch/",
  updateBranch: "/branch/",

  getBranch: "/sub_user/branch/",

  declinePayment: "/sPayment/auto-payment/declined",
  sucessPayment: "/sPayment/auto-payment/success",
  autoPayment:'/sPayment/auto-payment/',

  upgradePlans:'/subscription/get/user-subscription',
  apiForpaymentPage:'/subscription/get/user-account',

  subscriptionPayment:'/subscription/purchase',

  forAUthMobileOtp:'/auth/phpUser/verify_accountForAuth/',
  withoutAuthEmailOtp:'/auth/phpUser/verify_account/',

  invoiceSettings:'/invoiceSetting/',

  getInvoice: "/invoiceSetting",
  updateInvoice:"/invoiceSetting/",
  invoivegetLogo:'/invoiceSetting/logo/',
  getSignature:"/invoiceSetting/signature/",
  subScriptionCal:"/subscription/calculate",
  sendInvoiceToMail:"/sendInvoice/send",

  getDyanimicInfoOFSubscription:"/auth/subscription/",
  createSetting:"/generalSetting/",
  getGeneralSettings:"/generalSetting",

  updateGeneralsetting:"/generalSetting/",
  createMannualEmail:"/manualEmail/",
  getLogoAndName:"/generalSetting/",
  getLogo:"/generalSetting/file/",
  getMails:"/manualEmail",

  getSlipCount:"/subscription/getSlipCount",

  roomCancle:"/booking/cancel/",
  
  
};
  