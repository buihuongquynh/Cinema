
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL, RESET_ERROR_LOGIN_REGISTER } from './constants/Auth';
const currentUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null

const initialState = {
  currentUser: currentUser,
  loadingLogin: false,
  errorLogin: null,

  responseRegister: null,
  loadingRegister: false,
  errorRegister: null,
}

const authReducer = (state = initialState, action) => {

  switch (action.type) {

    case LOGIN_REQUEST: {
      return { ...state, loadingLogin: true, errorLogin: null };
    }

    case LOGIN_SUCCESS: {
      return {
        ...state,
        currentUser: action.payload.data,
        loadingLogin: false,
      };
    }

    case LOGIN_FAIL: {
      return {
        ...state,
        errorLogin: action.payload.error,
        loadingLogin: false,
      };
    }

    case LOGOUT: {
      localStorage.removeItem("user");
      return {
        ...state,
        currentUser: null,
        error: null,
        loading: false,
        responseRegister: null,
      };
    }

    case REGISTER_REQUEST: {
      return { ...state, loadingRegister: true, errorRegister: null };
    }

    case REGISTER_SUCCESS: {
      return {
        ...state,
        responseRegister: action.payload.data,
        loadingRegister: false
      };
    }

    case REGISTER_FAIL: {
      return {
        ...state,
        errorRegister: action.payload.error,
        loadingRegister: false,
      };
    }

    case RESET_ERROR_LOGIN_REGISTER: {
      return {
        ...state,
        errorRegister: null,
        errorLogin: null,
      };
    }

    default:
      return state;
  }
}
export default authReducer;