import axios from "axios";
export const baseURL = import.meta.env.VITE_API_URL
export const api = axios.create({
    baseURL: baseURL,
});

if (localStorage.getItem("auth")) {
    const authData = JSON.parse(String(localStorage.getItem("auth")));
    const token = authData ? authData.token : null;

    // Set the Authorization header if token is available
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}

api.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        // if (error.response.status === 401) {
        //   useAuthStore().logOut();
        // }
        // if (error.response.status === 429) {
        //   toast.error("erro !! ");
        //   return;
        // }
        return Promise.reject(error);
    }
);
