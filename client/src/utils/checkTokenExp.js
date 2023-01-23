import jwt_decode from "jwt-decode";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { postDataAPI } from './fetchData';


export const checkTokenExp = async (token, dispatch) => {
    const decoded = jwt_decode(token);

    if (decoded.exp >= Date.now() / 1000) return;

    const res = await postDataAPI('auth/refresh-token');

    dispatch({
        type: GLOBALTYPES.AUTH, 
        payload: {
            user: res.data.user,
            token: res.data.access_token
        }
    });

    return res.data.access_token;
}