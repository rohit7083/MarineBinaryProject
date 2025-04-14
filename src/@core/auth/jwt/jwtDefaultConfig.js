// ** Auth Endpoints
export default {
  loginEndpoint: "/jwt/login",  // temp
  // loginEndpoint: '/login',

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
  resend_OtpCall: "/auth/user/resend_OtpCall/",
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

getMemberDetails: "/sPayment/decrypt-token?token=",


  slipAssignmentGet: "/slipAssignmentGet",
  GenerateOtp: "/sPayment/generate",
  verifyOTP: "/sPayment/verify/",
  slipDocument: "/sDocuments/",
  getSingleDocuments: "/sDocuments/slip/",
  updateDoc: "/sDocuments/",
  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: "accessToken",
  storageRefreshTokenKeyName: "refreshToken",


  //POS : Vender Management

  addVender: "/vendor/",
  editvender: "/vendor/",
  deleteVender: "/vendor/",
  getAllVendor:"/vendor",

  //pos: Tax 
  productTax:"/productTax/",
  updateTax:"/productTax/",
  deleteTax:"/productTax/",
  getAlltax:"/productTax",
};
