import axios from "axios";
import { getLSItem, removeLSItem } from "./LocalStorage";
import swal from "sweetalert";

export const BASE_URL = "https://qyresearch.in/preview/";

const instance = axios.create({
  baseURL: BASE_URL + "api/",
});

const onRequestSuccess = (config) => {
  const auth_token = getLSItem("auth_token");
  if (auth_token) config.headers["Authorization"] = "bearer " + auth_token;

  return config;
};
const onRequestFailure = (error) => Promise.reject(error);

const onResponseSuccess = (response) => {
  return response;
};
const onResponseFailure = (error) => {
  if (error.response) {
    // console.log(error.response);
    if (
      error.response.status === 401 &&
      error.response.data.message == "Token Signature could not be verified."
    ) {
      swal(error.response.data.message, {
        icon: "warning",
        timer: 5000,
      }).then(() => {
        removeLSItem("user");
        removeLSItem("auth_token");
        removeLSItem("profileImagePath");
        removeLSItem("cart");
        removeLSItem("wishlist");
        removeLSItem("user_type");
        window.location.reload(false);
      });
    } else if (
      error.response.status === 401 &&
      error.response.data.message == "Token has expired"
    ) {
      swal("Please login again", {
        icon: "warning",
        timer: 5000,
      }).then(() => {
        removeLSItem("user");
        removeLSItem("auth_token");
        removeLSItem("profileImagePath");
        removeLSItem("cart");
        removeLSItem("wishlist");
        removeLSItem("user_type");
        window.location.reload(false);
      });
    } else if (error.response.status === 401) {
      swal("Something went wrong. Please login again", {
        icon: "warning",
        timer: 5000,
      }).then(() => {
        removeLSItem("user");
        removeLSItem("auth_token");
        removeLSItem("profileImagePath");
        removeLSItem("cart");
        removeLSItem("wishlist");
        removeLSItem("user_type");
        window.location.reload(false);
      });
    } else if (
      error.response.status === 400 &&
      error.response.data.token_exp_invalid
    ) {
      swal(error.response.data.token_exp_invalid, {
        icon: "warning",
        timer: 5000,
      }).then(() => {
        removeLSItem("user");
        removeLSItem("auth_token");
        removeLSItem("profileImagePath");
        removeLSItem("cart");
        removeLSItem("wishlist");
        removeLSItem("user_type");
        window.location.reload(false);
      });
    }
    return Promise.reject(error.response);
  } else {
    const customMsg =
      "Server is taking longer time to respond, please try again later.";
    swal(customMsg, {
      icon: "warning",
      timer: 5000,
    }).then(() => {
      removeLSItem("user");
      removeLSItem("auth_token");
      removeLSItem("profileImagePath");
      removeLSItem("cart");
      removeLSItem("wishlist");
      removeLSItem("user_type");
      window.location.reload(false);
    });
  }
};

instance.interceptors.request.use(onRequestSuccess, onRequestFailure);
instance.interceptors.response.use(onResponseSuccess, onResponseFailure);

export default instance;
