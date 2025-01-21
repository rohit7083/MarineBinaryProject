// ** Auth Endpoints
export default {
  loginEndpoint: '/jwt/login',
  // loginEndpoint: '/login',

  registerEndpoint: "/jwt/register",
  refreshEndpoint: "/auth/refresh_token",
  logoutEndpoint: "/jwt/logout",

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: "Bearer",

  // ** Admin Endpoint
  slipCategory: "/slipCategory/",
  slipCategoryGet: "/slipCategory",

  slip: "/slip/",
  slipGet: "/slip",

  sVessel: "/sVessel/",
  sVesselGet: "/sVessel",
  sMember: "/sMember/",

  // user Registraion and login
  registerUser: "/auth/user/create",
  // login: "/auth/login",
  verifyAccount: "/auth/verify_account/",
  sendEmail: "/auth/user/reset_password",
  createPass: "/auth/user/create_password/",
  resend_Otp: "/auth/user/resend_Otp/",
  resend_OtpCall: "/auth/user/resend_OtpCall/",
  generate: "/googleAuthenticatorQR/generate",
  verifyQr: "/googleAuthenticatorQR/verify-qr",
  disable: "/googleAuthenticatorQR/disable",
  mobileOtp:"/auth/verify_accountForAuth/",
  status:"/googleAuthenticatorQR/status",
  sendOtp:"/auth/user/send_otp/",

  //roles and permissions
  userpermission:"/userpermission/",  
  userpermission:"/userpermission",  

  permission:"/permission",

  createUser:"/auth/user/create",

  slipAssignmentGet: "/slipAssignmentGet",
  postOTP: "/slipAssignment/generate",
  verifyOTP: "/slipAssignment/verify/",
  slipDocument: "/slipDocument/",

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: "accessToken",
  storageRefreshTokenKeyName: "refreshToken",
};
