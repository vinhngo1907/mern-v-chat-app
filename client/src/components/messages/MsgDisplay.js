import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteMessage, editMessage } from "../../redux/actions/messageAction";
import { imageShow, videoShow } from "../../utils/mediaShow";
import Avatar from "../Avatar";
import Times from "./Times";

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
                    {
                        msg.media.map((item, index) => (
                            <div key={index}>
                                {
                                    item.url.match(/video/i)
                                        ? videoShow(item.url, theme)
                                        : imageShow(item.url, theme)
                                }
                            </div>
                        ))
                    }
                </div>
                {
                    msg.call &&
                    <button className="btn d-flex align-items-center py-3"
                        style={{ background: '#eee', borderRadius: '10px' }}>
                        <span className="material-icons font-weight-bold mr-1"
                            style={{
                                fontSize: '2.5rem', color: msg.call.times === 0 ? 'crimson' : 'green',
                                filter: theme ? 'invert(1)' : 'invert(0)'
                            }}
                        >
                            {
                                msg.call.times === 0
                                    ? msg.call.video ? 'videocam_off' : 'phone_disabled'
                                    : msg.call.video ? 'video_camera_front' : 'all'
                            }
                        </span>
                        <div className="text-left">
                            <h6>{msg.call.video ? 'Video Call' : 'Audio Call'}</h6>
                            <small>
                                {
                                    msg.call.times > 0
                                        ? <Times />
                                        : new Date(msg.createdAt).toLocaleTimeString()
                                }
                            </small>
                        </div>
                    </button>
                }
            </div>
        </>
    )
}

export default MsgDisplay;