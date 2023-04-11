import { patchDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";
import { GLOBALTYPES } from "./globalTypes"

export const updateProfile = ({ userData, avatar, auth }) => async (dispatch) => {
    console.log({ userData })
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        let newImg;
        if (avatar) newImg = await imageUpload([avatar]);

        const res = await patchDataAPI('user', {
            ...userData,
            avatar: avatar ? newImg[0].url : auth.user.avatar
        }, auth.token);
        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                ...auth,
                user: {
                    ...auth.user,
                    ...userData,
                    avatar: avatar ? newImg[0].url : auth.user.avatar
                }
            }
        });

        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (err) {
        console.log(err);
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response || err } });
    }
}