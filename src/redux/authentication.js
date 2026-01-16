// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

// ** UseJWT import to get config
import useJwt from "@src/auth/jwt/useJwt";

const config = useJwt.jwtConfig;

// const initialUser = () => {
//   const item = window.localStorage.getItem('userData')
//   //** Parse stored json or if none return initialValue
//   return item ? JSON.parse(item) : {}
// }

const initialUser = () => {
  const item = window.localStorage.getItem("userData");
  try {
    // Parse the JSON string or return an empty object if invalid
    return item ? JSON.parse(item) : {};
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", error);
    // Clear the invalid data and return an empty object
    localStorage.removeItem("userData");
    return {};
  }
};

const initialLogo=()=>{
  const item=window.localStorage.getItem('comapnyLogo')
  try{
    return item ? JSON.parse(item) : {};
  }catch(error){
    console.error("Error parsing JSON from localStorage:", error);
    // Clear the invalid data and return an empty object
    localStorage.removeItem("comapnyLogo");
    return {};
  }
}


const initialCompanyDetails=()=>{
  const item=window.localStorage.getItem('companyDetails')
  try{
    return item ? JSON.parse(item) : {};
  }catch(error){
    console.error("Error parsing JSON from localStorage:", error);
    // Clear the invalid data and return an empty object
    localStorage.removeItem("companyDetails");
    return {};
  }
}

const initialunLockedPages = () =>{
  const item=window.localStorage.getItem('pagesUnlockedNames')
   try {
    // Parse the JSON string or return an empty object if invalid
    return item ? JSON.parse(item) : {};
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", error);
    // Clear the invalid data and return an empty object
    localStorage.removeItem("pagesUnlockedNames");
    return {};
  }
}

export const authSlice = createSlice({
  name: "authentication",
  initialState: {
    userData: initialUser(),
    companyLogo:initialLogo(),
        companyDetails:initialCompanyDetails(),
    unlockedPages: initialunLockedPages(),
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload;
      state[config.storageTokenKeyName] =
        action.payload[config.storageTokenKeyName];
      state[config.storageRefreshTokenKeyName] =
        action.payload[config.storageRefreshTokenKeyName];
      localStorage.setItem("userData", JSON.stringify(action.payload));
      localStorage.setItem(
        config.storageTokenKeyName,
        JSON.stringify(action.payload.accessToken)
      );
      localStorage.setItem(
        config.storageRefreshTokenKeyName,
        JSON.stringify(action.payload.refreshToken)
      );
    },
    handleStoreCompany:(state,action)=>{
      state.companyDetails=action.payload
      localStorage.setItem("companyDetails", JSON.stringify(action.payload));
    },

    handleStoreLogo:(state, action)=>{
      state.companyLogo=action.payload
      localStorage.setItem("comapnyLogo", JSON.stringify(action.payload));

    },

     handleClearCompany:(state,action)=>{
      state.companyDetails={}
      localStorage.removeItem("companyDetails", JSON.stringify(action.payload));
    },

      handleClearLogo:(state,action)=>{
      state.companyLogo={}
      localStorage.removeItem("comapnyLogo", JSON.stringify(action.payload));
    },

    handleLogout: (state) => {
      state.userData = {};
      state[config.storageTokenKeyName] = null;
      state[config.storageRefreshTokenKeyName] = null;
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem("userData");
      localStorage.removeItem("selectedBranch");
      localStorage.removeItem("companyDetails");
      localStorage.removeItem("comapnyLogo");

      localStorage.removeItem(config.storageTokenKeyName);
      localStorage.removeItem(config.storageRefreshTokenKeyName);
    },
    saveUnlockedPages: (state, action) => {
      state.unlockedPages = action.payload;
    },
  },
});

export const { handleLogin, handleLogout,saveUnlockedPages ,handleStoreCompany , handleStoreLogo} = authSlice.actions;

export default authSlice.reducer;
