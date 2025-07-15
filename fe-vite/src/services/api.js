import axios from "../utils/axios-customize";

const callRegister = (fullName, email, password, phone) => {
  return axios.post("api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

const callLogin = (username, password) => {
  return axios.post("api/v1/auth/login", { username, password, delay: 5000 });
};

const callFetchAccount = () => {
  return axios.get("api/v1/auth/account");
};

const callLogout = () => {
  return axios.post("api/v1/auth/logout");
};

const callFetchUser = (query) => {
  return axios.get(`/api/v1/user?${query}`);
};

const callCreateUser = (fullName, password, email, phone) => {
  return axios.post("api/v1/user", { fullName, password, email, phone });
};

const callUpdateUser = (id, fullName, phone) => {
  const data = new URLSearchParams();
  data.append("_id", id);
  data.append("fullName", fullName);
  data.append("phone", phone);

  return axios.put("api/v1/user", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

const callDeleteUser = (id) => {
  return axios.delete(`api/v1/user/${id}`);
};

const callGetCategories = () => {
  return axios.get("api/v1/database/category");
};

const callGetListBook = (query) => {
  return axios.get(`/api/v1/book?${query}`);
};

const callGetDetailBook = (id) => {
  return axios.get(`api/v1/book/${id}`);
};

const callPlaceOrder = (data) => {
  return axios.post("api/v1/order", {
    ...data,
  });
};

const callGetListOrderHistory = () => {
  return axios.get("api/v1/history");
};

const callFetchBook = (query) => {
  return axios.get(`api/v1/book?${query}`);
};

const callCreateBook = (
  thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category
) => {
  return axios.post("/api/v1/book", {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
  });
};

const callUploadBookImg = (fileImg) => {
  const formData = new FormData();
  formData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};

const callFetchCategory = () => {
  return axios.get("/api/v1/database/category");
};

const callDeleteBook = (id) => {
  return axios.delete(`/api/v1/book/${id}`);
};

const callUpdateBook = (
  id,
  thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category
) => {
  return axios.put(`/api/v1/book/${id}`, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
  });
};

export {
  callRegister,
  callLogin,
  callFetchAccount,
  callLogout,
  callFetchUser,
  callCreateUser,
  callUpdateUser,
  callDeleteUser,
  callGetCategories,
  callGetListBook,
  callGetDetailBook,
  callPlaceOrder,
  callGetListOrderHistory,
  callFetchBook,
  callUploadBookImg,
  callCreateBook,
  callFetchCategory,
  callDeleteBook,
  callUpdateBook,
};
