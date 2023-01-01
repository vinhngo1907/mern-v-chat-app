import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { addMessage, getMessages } from "../../redux/actions/messageAction";
import UserCard from "../UserCard";
import Icons from "../Icons";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { imageUpload } from "../../utils/imageUpload";
import { imageShow, videoShow } from "../../utils/mediaShow";
import MsgDisplay from "./MsgDisplay";
import Avatar from "../Avatar";
import moment from "moment";

const RightSide = () => {
    const { auth, theme, message } = useSelector(state => state);
    const dispatch = useDispatch();

    const [user, setUser] = useState([]);
    const [text, setText] = useState("");

    const [media, setMedia] = useState([]);
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        if (id && message.users.length > 0) {
            // setTimeout(() => {
            //     refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
            // }, 50)

            const newUser = message.users.find(user => user._id === id)
            if (newUser) setUser(newUser)
        }
    }, [id, message.users]);

    useEffect(() => {
        const newData = message.data.find(item => item._id === id)
        if (newData) setData(newData.messages);

    }, [id, message.data]);

    // Get messages
    useEffect(() => {
        const getMessagesData = async () => {
            if (message.data.every(item => item._id !== id)) {
                await dispatch(getMessages({ id, auth }))
                // setTimeout(() => {
                //     refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
                // },50)
            }
        }
        getMessagesData()
    }, [id, dispatch, auth, message.data])

    const handleChangeMedia = (e) => {
        const files = [...e.target.files];
        let err = "";
        let newArr = [];
        files.forEach((item) => {
            if (!item) return err = "File does not exist."
            if (item.size > 5 * 1024 * 1024) return err = "The image/video largest is 5mb.";

            newArr.push(item);
            return;
        });

        if (err) {
            return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
        }
        setMedia([...media, ...newArr]);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() && media.length === 0) return;

        let newMedia = [];
        if (media.length > 0)
            newMedia = await imageUpload(media);

        const msg = {
            sender: auth.user._id,
            recipient: id,
            text,
            media: newMedia
        }
        setMedia([]);
        setText("");

        dispatch(addMessage({ msg, auth }));
    }
    const handleDeleteMedia = (index) => {
        const newArr = [...media];
        newArr.splice(index, 1);
        setMedia(newArr);
    }
    return (
        <>
            <div className="message_header p-3" style={{ cursor: "pointer" }}>
                <div className="message_back"><Link to="/"><i className="fas fa-arrow-left text-dark" /></Link></div>
                {
                    user.length !== 0 &&
                    <UserCard user={user}>
                        <div className="message_tool">
                            <i className="fas fa-phone-alt text-primary mr-2" />

                            <i className="fas fa-video text-success mr-2" />

                            <i className="fas fa-trash text-danger mr-2" />

                            <i className="fas fa-info-circle text-info mr-2"
                                onClick={() => setShowSidebar(!showSidebar)}
                            />
                        </div>
                    </UserCard>
                }
            </div>
            <div className="chat_container">
                <div className="chat_display">
                    {
                        data.map((item, index) => (
                            <div key={index}>
                                {
                                    item.recipient === auth.user._id &&
                                    <div className="chat_row other_message">
                                        <MsgDisplay user={user} theme={theme} msg={item} />
                                    </div>
                                }
                                {
                                    item.sender === auth.user._id &&
                                    <div className="chat_row you_message">
                                        <MsgDisplay user={auth.user} theme={theme} msg={item} data={data} />
                                    </div>
                                }
                            </div>
                        ))
                    }
                </div>
                <div className={`message_sidebar ${theme ? 'dark' : 'light'} ${showSidebar ? 'show' : ''}`}>
                    {
                        user.length !== 0 &&
                        <div className="chat_user_info text-center py-5">
                            <div className="chat_user_img">
                                <Avatar src={user.avatar} size="super-avatar" />
                            </div>
                            <div className="chat_user_content">
                                <Link to="#" className="chat_user_link">
                                    <div><i className="fas fa-calendar" /> </div>
                                    <span>{moment(user.createdAt).fromNow()}</span>
                                </Link>
                                <Link to="#" className="chat_user_link">
                                    <div><i className="fas fa-birthday-cake" /></div>
                                    <span>{user.birthday ? user.birthday : '12-06-1960'}</span>
                                </Link>
                                <Link to="#" className="chat_user_link">
                                    <div><i className="fas fa-mobile" /></div>
                                    <span>{`(+84) ${user.mobile}`}</span>
                                </Link>
                                <Link to="#" className="chat_user_link">
                                    <div><i className="fas fa-envelope" /></div>
                                    <span>{user.email}</span>
                                </Link>
                                <Link to="#" className="chat_user_link">
                                    <div><i className="fas fa-map-marker" /></div>
                                    <span>{user.address ? user.address : 'No address'}</span>
                                </Link>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <div className="show_media" style={{ display: media.length > 0 ? 'grid' : 'none' }}>
                {
                    media.map((item, index) => (
                        <div key={index} id="file_media">
                            {
                                item.type.match(/video/i)
                                    ? videoShow(URL.createObjectURL(item), theme)
                                    : imageShow(URL.createObjectURL(item), theme)
                            }
                            <span onClick={() => handleDeleteMedia(index)} >&times;</span>
                        </div>
                    ))
                }
            </div>
            <form className="chat_input" onSubmit={handleSubmit}>
                <input type="text"
                    placeholder="Enter you message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{
                        filter:
                            theme ? "invert(1)" : "invert(0)",
                        background: theme ? '#040404' : '', color: theme ? 'white' : ''
                    }}
                />

                <Icons setContent={setText} content={text} theme={theme} />
                <div className="file_upload">
                    <i className="fas fa-image text-danger" />
                    <input type="file" accept="image/*, video/*" name="file" id="file" multiple onChange={handleChangeMedia} />
                </div>
                <button type="submit" className="material-icons"
                    disabled={(text || media.length > 0) ? false : true}>
                    near_me
                </button>
            </form>
        </>
    )
}

export default RightSide;