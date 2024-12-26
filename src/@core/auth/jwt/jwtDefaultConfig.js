// ** Auth Endpoints
export default {
  loginEndpoint: '/auth/login',
  registerEndpoint: '/jwt/register',
  refreshEndpoint: '/jwt/refresh-token',
  logoutEndpoint: '/jwt/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Admin Endpoint
  slipCategory:"/slipCategory/",
  slipCategoryGet:"/slipCategory",

  slip:"/slip/",
  slipGet:"/slip",

  sVessel:"/sVessel/",
  slipAssignmentGet:"/slipAssignmentGet",
  postOTP:"/slipAssignment/generate",
  verifyOTP:"/slipAssignment/verify/",
  slipDocument:"/slipDocument/",
  

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
