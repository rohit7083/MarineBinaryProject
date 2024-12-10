import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'

axios.defaults.baseURL="http://192.168.29.190:8001"



export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // ** Request Interceptor
    axios.interceptors.request.use(
      config => {
        // ** Get token from localStorage
        const accessToken = this.getToken()

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken.slice(1,-1)}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      response => response,
      error => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config

        // ** if (status === 401) {
        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true
            this.refreshToken().then(r => {
              this.isAlreadyFetchingAccessToken = false

              // ** Update accessToken in localStorage
              this.setToken(r.data.accessToken)
              this.setRefreshToken(r.data.refreshToken)

              this.onAccessTokenFetched(r.data.accessToken)
            })
          }
          const retryOriginalRequest = new Promise(resolve => {
            this.addSubscriber(accessToken => {
              // ** Make sure to assign accessToken according to your response.
              // ** Check: https://pixinvent.ticksy.com/ticket/2413870
              // ** Change Authorization header
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
              resolve(this.axios(originalRequest))
            })
          })
          return retryOriginalRequest
        }
        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args)
  }

  postslipCatogory(...args) {
    return axios.post(this.jwtConfig.slipCategory, ...args)
  }
  getslipCatogory() {
    return axios.get(this.jwtConfig.slipCategoryGet)
  }
  updateslipCatogory(uid,...args) {
    return axios.put(`${this.jwtConfig.slipCategory}${uid}`, ...args)
  }
  deleteslipCatogory(uid) {
    return axios.delete(`${this.jwtConfig.slipCategory}${uid}`)
  }

  // ===================== Slip Details 

  postslipDetail(...args) {
    return axios.post(this.jwtConfig.slipDetail, ...args)
  }
  getslipDetail() {
    return axios.get(this.jwtConfig.slipDetailGet)
  }
  updateslipDetail(uid,...args) {
    return axios.put(`${this.jwtConfig.slipDetail}${uid}`, ...args)
  }
  deleteslipDetail(uid) {
    return axios.delete(`${this.jwtConfig.slipDetail}${uid}`)
  }
  // ==================== Slip assigne

  postslipAssignment(...args) {
    return axios.post(this.jwtConfig.slipAssignment, ...args)
  }
  getslipAssignment() {
    return axios.get(this.jwtConfig.slipAssignmentGet)
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken()
    })
  }
}
