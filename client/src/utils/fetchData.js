import axios from "axios";

export const getDataAPI = async (url, token) => {
    const res = await axios.get(`/api/${url}`, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res;
}

export const postDataAPI = async (url, data, token) => {
    const res = await axios.post(`/api/${url}`, data, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res;
}

export const putDataAPI = async (url, data, token) => {
    const res = await axios.post(`/api/${url}`, data, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res;
}

export const patchDataAPI = async (url, data, token) => {
    const res = await axios.post(`/api/${url}`, data, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res;
}

export const deleteDataAPI = async (url, token) => {
    const res = await axios.delete(`/api/${url}`, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res;
}