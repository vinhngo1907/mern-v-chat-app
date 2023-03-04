import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
// import { showErrMsg, showSuccessMsg } from "../../components/alert/Message";
import { activeAccount } from "../../redux/actions/authAction";

const Active = () => {
    const { id } = useParams();
    console.log({id})
    // const [err, setErr] = useState('');
    // const [success, setSuccess] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            dispatch(activeAccount(id))
        }
    }, [id, dispatch])
    return (
        <div>
            {/* {err && showErrMsg(err)}
            {success && showSuccessMsg(success)} */}
        </div>
    )
}

export default Active;