import axios from "axios";
import { apiUrl } from './constants';

export const getDataAPI = async (url, token) => {
    const res = await axios.get(`${apiUrl}/api/${url}`, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res;
}

export const postDataAPI = async (url, data, token) => {
    const res = await axios.post(`${apiUrl}/api/${url}`, data, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res;
}

export const putDataAPI = async (url, data, token) => {
    const res = await axios.put(`${apiUrl}/api/${url}`, data, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res;
}

export const patchDataAPI = async (url, data, token) => {
    const res = await axios.patch(`${apiUrl}/api/${url}`, data, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res;
}

export const deleteDataAPI = async (url, token) => {
    const res = await axios.delete(`${apiUrl}/api/${url}`, {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res;
}