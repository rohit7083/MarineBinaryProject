import axios from "axios";
import jwtDefaultConfig from "./jwtDefaultConfig";

axios.defaults.baseURL = "http://192.168.29.190:8000";

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig };

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false;

  // ** For Refreshing Token
  subscribers = [];

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };

    // ** Request Interceptor
    axios.interceptors.request.use(
      (config) => {
        // ** Get token from localStorage
        const accessToken = this.getToken();

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
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
        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;
            this.refreshToken().then((r) => {
              this.isAlreadyFetchingAccessToken = false;

              // ** Update accessToken in localStorage
              this.setToken(r.data.accessToken);
              this.setRefreshToken(r.data.refreshToken);

              this.onAccessTokenFetched(r.data.accessToken);
            });
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken) => {
              // ** Make sure to assign accessToken according to your response.
              // ** Check: https://pixinvent.ticksy.com/ticket/2413870
              // ** Change Authorization header
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

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args);
  }

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
  getslip() {
    return axios.get(this.jwtConfig.slipGet);
  }
  updateslip(uid, ...args) {
    return axios.put(`${this.jwtConfig.slip}${uid}`, ...args);
  }
  deleteslip(uid) {
    return axios.delete(`${this.jwtConfig.slip}${uid}`);
  }
  // ==================== 4 Steps Slip Member Form

  postsVessel(...args) {
    return axios.post(this.jwtConfig.sVessel, ...args);
  }
  updateVessel(uid, ...args) {
    return axios.put(`${this.jwtConfig.sVessel}${uid}`, ...args);
  }
  getVessel(uid = "") {
    return axios.get(this.jwtConfig.sVesselGet + "/" + uid);
  }

  postsMember(...args) {
    return axios.post(this.jwtConfig.sMember, ...args);
  }

  // =================== Register User

  registerUser(...args) {
    return axios.post(this.jwtConfig.registerUser, ...args);
  }
  login(...args) {
    // return axios.post(this.jwtConfig.login, ...args);
  return axios.post(this.jwtConfig.loginEndpoint, ...args);
  }

  // ==========================

  getslipAssignment() {
    return axios.get(this.jwtConfig.slipAssignmentGet);
  }

  postOTP(payload) {
    return axios.post(this.jwtConfig.postOTP, payload);
  }

  verifyOTP(token, ...data) {
    return axios.post(this.jwtConfig.verifyOTP + token, ...data);
  }
  slipDocument(uid, ...args) {
    return axios.post(this.jwtConfig.slipDocument + uid, ...args);
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
  }
}
