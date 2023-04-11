import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showErrMsg, showSuccessMsg } from "../../components/alert/Message";
// import { activeAccount } from "../../redux/actions/authAction";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { postDataAPI } from "../../utils/fetchData";

const Active = () => {
    const { id } = useParams();
    console.log({ id })
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (id) {
            postDataAPI("auth/activate-account", { active_token: id })
                .then(res => {
                    setSuccess(res.data.msg)
                    localStorage.setItem("firstLogin", true);
                    dispatch({
                        type: GLOBALTYPES.AUTH,
                        payload: {
                            user: res.data.user,
                            token: res.data.access_token
                        }
                    });
                })
                .catch(err => setErr(err?.response?.data?.msg || "Something wrong"));
        }
    }, [id, dispatch])
    return (
        <>
            <div>
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}

            </div>
            <div className="text-center bg-light py-4">
                <h6>Welcome V-Chat app DevVN-VietNam</h6>
                <a href="https://mern-v-chat-app.netlify.app"
                    target="_blank" rel="noreferrer"
                    className="mb-2 d-block">
                    V-Chat App
                </a>
                <p> Copyright &copy; 2022</p>
            </div>
        </>
    )
}

export default Active;