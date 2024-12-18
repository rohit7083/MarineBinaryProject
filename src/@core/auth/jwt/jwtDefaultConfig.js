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

  slipDetail:"/slipDetail/",
  slipDetailGet:"/slipDetail",

  slipAssignment:"/slipAssignment/",
  slipAssignmentGet:"/slipAssignmentGet",
  generateOTP:"/slipAssignment/generate",
  verifyOTP:"/slipAssignment/verify/8JlwIOAIgEg8H5M8buETFayNUQPMMKEh8n7Kb-RE2BVUkREUJr-1E-HtikQHII4k0R-H06hxQPHS9dr_38txUwta7JSuaK1terk0wDle8Mss9awwgCMDQbmv4y1Ld1nttuyqZ_YHmfKA8jw2AWgSl5x54x-CCpoFjIm8JdE3B4k=",
  

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
