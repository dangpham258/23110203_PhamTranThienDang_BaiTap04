import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name,
        email,
        password,
    };
    return axios.post(URL_API, data);
};

const loginApi = (email, password, role) => {
    const URL_API = "/v1/api/login";
    const data = {
        email,
        password,
        role,
    };
    return axios.post(URL_API, data);
};

const forgotPasswordApi = (email) => {
    const URL_API = "/v1/api/forgot-password";
    return axios.post(URL_API, { email });
};

const getHomeApi = () => {
    const URL_API = "/v1/api/home";
    return axios.get(URL_API);
};

const getProductDetailApi = (id) => {
    const URL_API = `/v1/api/products/${id}`;
    return axios.get(URL_API);
};

const getAdminProductsApi = () => {
    const URL_API = "/v1/api/products";
    return axios.get(URL_API);
};

const updateStockApi = (id, delta) => {
    const URL_API = `/v1/api/products/${id}/stock`;
    return axios.patch(URL_API, { delta });
};

const getAccountApi = () => {
    const URL_API = "/v1/api/account";
    return axios.get(URL_API);
};

const resetPasswordApi = (email, otp, newPassword) => {
    const URL_API = "/v1/api/reset-password";
    return axios.post(URL_API, { email, otp, newPassword });
};

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
};

export {
    createUserApi,
    loginApi,
    forgotPasswordApi,
    resetPasswordApi,
    getUserApi,
    getHomeApi,
    getProductDetailApi,
    getAdminProductsApi,
    updateStockApi,
    getAccountApi,
};
