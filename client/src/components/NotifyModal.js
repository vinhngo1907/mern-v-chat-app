import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import moment from "moment";
import { isReadNotify, deleteAllNotifies } from "../redux/actions/notifyAction";

const NotifyModal = () => {
    const { auth, notify } = useSelector(state => state)
    const dispatch = useDispatch();

    const handleDeleteAll = () => {
        dispatch(deleteAllNotifies(auth.token))
    }

    const handleIsRead = (msg) => {
        dispatch(isReadNotify({ msg, auth }))
    }

    return (
        <div style={{ minWidth: '300px' }}>
            <div className="d-flex justify-content-between align-items-center px-3">
                <h3>Notification</h3>
            </div>
            <hr className="mt-0" />
            {/* Notify sound */}
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                {
                    notify.data.map((msg, index) => (
                        <div key={index} className="px-2 mb-3" >
                            <Link to={`${msg.url}`} className="d-flex text-dark align-items-center"
                                onClick={() => handleIsRead(msg)}>
                                <Avatar src={msg.user.avatar} size="big-avatar" />

                                <div className="mx-1 flex-fill">
                                    <div>
                                        <strong className="mr-1">{msg.user.username}</strong>
                                        <span>{msg.text}</span>
                                    </div>
                                    {msg.content && <small>{msg.content.slice(0, 20)}...</small>}
                                </div>

                                {
                                    msg.image &&
                                    <div style={{ width: '30px' }}>
                                        {
                                            msg.image.match(/video/i)
                                                ? <video src={msg.image} width="100%" />
                                                : <Avatar src={msg.image} size="medium-avatar" />
                                        }
                                    </div>
                                }

                            </Link>
                            <small className="text-muted d-flex justify-content-between px-2">
                                {moment(msg.createdAt).fromNow()}
                                {
                                    !msg.isRead && <i className="fas fa-circle text-primary" />
                                }
                            </small>
                        </div>
                    ))
                }
            </div>
            <hr className="my-1" />
            <div className="text-right text-danger mr-2" style={{ cursor: 'pointer' }}
                onClick={handleDeleteAll}>
                Delete All
            </div>
        </div>
    )
}

export default NotifyModal;