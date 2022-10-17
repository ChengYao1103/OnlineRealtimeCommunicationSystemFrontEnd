import axios from "axios";
import config from "../config";
import { WSConnection } from "./webSocket";

let ws: WSConnection;
const WS_URL = config.WS_URL ?? "";
const LOGOUT_URL = "/logout";

// default
axios.defaults.baseURL = config.API_URL;

// content type
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

// intercepting to capture errors
axios.interceptors.response.use(
  function (response: any) {
    return response.data ? response.data : response;
  },
  function (error: any) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    /*let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
    */
    if (error.response) return Promise.reject(error.response);
    else if (error.request) return Promise.reject(error.request);
    else return Promise.reject(error);
  }
);

let authInit = (token: string) => {
  axios.defaults.headers.common["Authorization"] = token;
  ws = new WSConnection(WS_URL, token);
};

if (window.location.pathname === LOGOUT_URL) {
  localStorage.removeItem("authUser");
  localStorage.removeItem("token");
} else if (localStorage.getItem("token")) {
  authInit(localStorage.getItem("token") ?? "");
}

/**
 * Sets the default authorization
 * @param { string } token
 */
const setAuthorization = (token: string) => {
  token = "Bearer " + token;
  localStorage.setItem("token", token);
  authInit(token);
};

class APIClient {
  /**
   * Fetches data from given url
   */
  get = (url: string, params?: {}) => {
    return axios.get(url, params);
  };

  /**
   * Download file from given url
   */
  getFile = (apiUrl: string, filename: string, data?: {}) => {
    const token = localStorage.getItem("token")
    return fetch(axios.defaults.baseURL + apiUrl, {
      method: 'POST',
            headers: {
            Authorization: token ? token : "",
            "Content-Type": "application/json; charset=utf-8",
          },
      body: JSON.stringify(data),
    }).then(response => {
      return response.blob()
    })
    .then(blob => {
      var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();    
                a.remove();  
    })
  }

  /**
   * post given data to url
   */
  create = (url: string, data?: {}) => {
    return axios.post(url, data);
  };

  /**
   * Updates data
   */
  update = (url: string, data?: {}) => {
    return axios.put(url, data);
  };

  /**
   * Delete
   */
  delete = (url: string, config?: {}) => {
    return axios.delete(url, { ...config });
  };

  /**
   * Patch data
   */
  patch = (url: string, data?: {}) => {
    return axios.patch(url, data);
  };

  /*
   file upload update method
   */
  updateWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }
    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.put(url, formData, config);
  };

  /*
   file upload post method
   */
  createWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }
    const config = {
      headers: {
        ...axios.defaults.headers,
        "content-type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config);
  };

  WSSend = (data: string) => {
    ws.send(data);
  };
}

const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser, LOGOUT_URL };
