import axios from '../../custom-axios/axios';

const API_URL = "/auth/";

let subscribers = [];

const notifySubscribers = () => {
    const user = getCurrentUser();
    subscribers.forEach(callback => callback(user));
};

const subscribe = (callback) => {
    subscribers.push(callback);
    callback(getCurrentUser());
    return () => {
        subscribers = subscribers.filter(cb => cb !== callback);
    };
};

const register = (name, surname, username, password, role) => {
    return axios.post(API_URL + "register", {
        name, surname, username, password, role,
    }).then((response) => {
        if (response.data.access_token) {
            const userData = {
                access_token: response.data.access_token,
                username: response.data.user?.username || username,
                role: response.data.user?.role || role || null,
            };
            localStorage.setItem("user", JSON.stringify(userData));
            notifySubscribers();
        }
        return response.data;
    });
};

const login = (username, password) => {
    return axios.post(API_URL + "login", {
        username,
        password,
    }).then((response) => {
        if (response.data.access_token) {
            const userData = {
                access_token: response.data.access_token,
                username: response.data.user?.username || username,

                role: response.data.role || null,

            };
            localStorage.setItem("user", JSON.stringify(userData));
            notifySubscribers();
        }
        return response.data;
    });
};

const logout = () => {
    localStorage.removeItem("user");
    notifySubscribers();
};

const getCurrentUser = () => {
    return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    subscribe,
};

export default authService;
