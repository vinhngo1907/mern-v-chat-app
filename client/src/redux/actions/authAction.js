import { postDataAPI } from "../../utils/fetchData";
import { valid } from "../../utils/valid";
import { GLOBALTYPES } from "./globalTypes";

export const login = (data) => async (dispatch) => {
    console.log(data);
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
        const res = await postDataAPI('auth/login', data);
        localStorage.setItem("firstLogin", true);

        dispatch({ type: GLOBALTYPES.AUTH, payload: { token: res.data.access_token, user: res.data.user } });
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg || err } });
    }
}

export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem("firstLogin")
    if (firstLogin) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

        try {
            const res = await postDataAPI('auth/refresh-token');
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                }
            })

            dispatch({ type: GLOBALTYPES.ALERT, payload: {} })

        } catch (err) {
            console.log(err);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: err.response.data.msg || err
                }
            })
        }
    }
}

export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem("firstLogin");
        const res = await postDataAPI('auth/logout');
        window.location.href = "/";
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg || err } });
    }
}

export const register = (data) => async (dispatch) => {
    let error = valid(data);
    if (error.errLength > 0) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: error.errMsg });
        return
    }

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        const res = await postDataAPI('auth/register', data);
        
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
        
        localStorage.setItem("firstLogin", true);

        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                user: res.data.user,
                token: res.data.access_token
            }
        });

    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: error.response.data.msg || err } })
    }
}