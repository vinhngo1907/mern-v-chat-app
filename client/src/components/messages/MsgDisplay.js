import React from "react";
import { useSelector } from "react-redux";
import Avatar from "../Avatar";

const MsgDisplay = ({ user, msg, theme, data }) => {
    const { auth } = useSelector(state => state);

    return (
        <>
            <div className="chat_tittle" title={user.username}>
                <Avatar src={user.avatar} size="small-avatar" />
                {/* <span>{user.username}</span> */}
            </div>
            <div className="chat_content">
                {
                    user._id === auth.user._id
                    && <i className="fas fa-trash text-danger" />
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