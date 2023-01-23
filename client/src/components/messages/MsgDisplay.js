import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteMessage, editMessage } from "../../redux/actions/messageAction";
import Avatar from "../Avatar";

const MsgDisplay = ({ user, msg, theme, data }) => {
    const { auth, socket } = useSelector(state => state);
    const dispatch = useDispatch();
    const handleDeleteMessage = () => {
        if (window.confirm("Do you want to continue delete message?")) {
            dispatch(deleteMessage({ msg, auth, data, socket }))
        }
    }
    const { id } = useParams();
    const handleEditMessage = () => {

        dispatch(editMessage({ id, msg, auth, data, socket }))
    }

    return (
        <>
            <div className="chat_tittle" title={user.username}>
                <Avatar src={user.avatar} size="small-avatar" />
                {/* <span>{user.username}</span> */}
            </div>
            <div className="chat_content">
                {
                    user._id === auth.user._id
                    && <div className="chat_action">
                        <i className="fas fa-trash text-danger" onClick={handleDeleteMessage} />
                        <i className="fas fa-edit text-primary" onClick={handleEditMessage} />
                    </div>
                }
                <div className="chat_details">
                    {
                        msg.text && <p className="chat_text" style={{ filter: theme ? "invert(1)" : "invert(0)" }}>{msg.text}</p>
                    }
                </div>
            </div>
        </>
    )
}

export default MsgDisplay;