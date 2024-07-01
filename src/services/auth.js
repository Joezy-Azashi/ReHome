import Api from "../api/api";
import axios from "axios";
import jwt_decode from "jwt-decode";
import OneSignal from 'react-onesignal';

const AUTH_TOKEN_KEY = "authToken";
const CURRENT_USER = "currentUser";
const SIGN_UP_USER = "signupUser";

export const loginUser = (userData) => {
  return new Promise(async (resolve, reject,) => {
    try {
      const res = await Api().post("/login", userData);
      if (res.data) {
        const user = res.data.profile;
        setAuthToken(res.data.accessToken);
        setCurrentUser(user);
        resolve(res);
        OneSignal.setExternalUserId(res.data.profile.id)
      } else {
        reject(res);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function signUpUser(userData) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await Api().post("/signup", userData);
      if (res.data) {
        setSignUpUser(res.data);
        resolve(res);
      } else {
        reject(res);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function logoutUser() {
  clearAuthToken();
  clearCurrentUser();
  clearSignUpUser();
}

export function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearAuthToken() {
  axios.defaults.headers.common.Authorization = "";
  return localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isLoggedIn() {
  const authToken = getAuthToken();
  return !!(authToken && isTokenActive(authToken));
}

export function setCurrentUser(data) {
  localStorage.setItem(CURRENT_USER, JSON.stringify(data));
  localStorage.setItem("userId", data?.id)
}

export function setSignUpUser(data) {
  localStorage.setItem(SIGN_UP_USER, JSON.stringify(data));
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER));
}

export function getCurrentUserId() {
  return localStorage.getItem("userId");
}

export function getSignUpUser() {
  const user = localStorage.getItem(SIGN_UP_USER);
  if (!user) return null;
  return JSON.parse(localStorage.getItem(SIGN_UP_USER));
}

export function clearSignUpUser() {
  return localStorage.removeItem(SIGN_UP_USER);
}

export function clearCurrentUser() {
  localStorage.removeItem("userId")
  return localStorage.removeItem(CURRENT_USER);
}

export function isSuperUser() {
  return isLoggedIn();
}

export function getUserType() {
  if (isLoggedIn()) {
    if(getCurrentUser()?.subscription?.plan_code === 'FREE-TIER'){
      return "agent";
    }
    return getCurrentUser()?.userType;
  } else {
    return [];
  }
}

function getTokenExpirationDate(encodedToken) {
  const token = jwt_decode(encodedToken);
  if (!token.exp) {
    return null;
  }
  return token.exp;
}

export function isTokenActive(token) {
  const expirationDate = getTokenExpirationDate(token);
  const now = Math.floor(Date.now() / 1000);
  return expirationDate > now;
}
