import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { addMessage, deleteConversation, getMessages, loadMoreMessages } from "../../redux/actions/messageAction";
import UserCard from "../UserCard";
import Icons from "../Icons";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { imageUpload } from "../../utils/imageUpload";
import { imageShow, videoShow } from "../../utils/mediaShow";
import MsgDisplay from "./MsgDisplay";
import Avatar from "../Avatar";
import moment from "moment";
import LoadIcon from '../../assets/loading.gif'

const RightSide = () => {
    const { auth, theme, message, socket, peer } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();
    const [user, setUser] = useState([]);
    const [text, setText] = useState("");

    const [media, setMedia] = useState([]);
    const [loadMedia, setLoadMedia] = useState(false);

    const { id } = useParams();
    const [data, setData] = useState([]);
    const [result, setResult] = useState(9);
    const [page, setPage] = useState(0);
    const [isLoadMore, setIsLoadMore] = useState(0);

    const [showSidebar, setShowSidebar] = useState(false);

    const refDisplay = useRef();
    const pageEnd = useRef();

    useEffect(() => {
        if (id && message.users.length > 0) {
            setTimeout(() => {
                refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
            }, 50)

            const newUser = message.users.find(user => user._id === id)
            if (newUser) setUser(newUser)
        }
    }, [id, message.users]);

    useEffect(() => {
        const newData = message.data.find(item => item._id === id);
        if (newData) {
            setData(newData.messages);
            setResult(newData.result);
            setPage(newData.page);
        }

    }, [id, message.data]);

    // Get messages
    useEffect(() => {
        const getMessagesData = async () => {
            if (message.data.every(item => item._id !== id)) {
                await dispatch(getMessages({ id, auth }))
                setTimeout(() => {
                    refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
                }, 50)
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
        setMedia([]);
        setText("");
        setLoadMedia(true);

        let newMedia = [];
        if (media.length > 0) newMedia = await imageUpload(media);

        const msg = {
            sender: auth.user._id,
            recipient: id,
            text,
            media: newMedia,
            createdAt: new Date().toISOString(),
            conversationId: auth.user._id
        }

        setLoadMedia(false)
        await dispatch(addMessage({ msg, auth, socket }));

        if (refDisplay.current) {
            refDisplay.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
    }
    const handleDeleteMedia = (index) => {
        const newArr = [...media];
        newArr.splice(index, 1);
        setMedia(newArr);
    }

    const handleDeleteCV = () => {
        if (window.confirm("Are your sure to continue delete this conversation?")) {
            const users = message.users;
            dispatch(deleteConversation({ id, auth, users }));
            return history.push("/");
        }
    }

    // Load More
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsLoadMore(p => p + 1)
            }
        }, {
            threshold: 0.1
        })

        observer.observe(pageEnd.current)
    }, [setIsLoadMore])

    useEffect(() => {
        if (isLoadMore > 1) {
            if (result >= page * 9) {
                dispatch(loadMoreMessages({ auth, id, page: page + 1 }))
                setIsLoadMore(1)
            }
        }
    }, [isLoadMore, result, page, dispatch, id, auth])

    // Call
    const caller = ({ video }) => {
        const { _id, avatar, username, fullname } = user;
        const msg = {
            sender: auth.user._id,
            recipient: _id,
            avatar, username, fullname, video
        }
        dispatch({ type: GLOBALTYPES.CALL, payload: msg })
    }

    const callUser = ({ video }) => {
        const { _id, avatar, username, fullname } = auth.user;
        const msg = {
            sender: _id,
            recipient: user._id,
            avatar, username, fullname, video
        }
        if (peer.open) msg.peerId = peer._id
        socket.emit('callUser', msg);
    }

    const handleAudioCall = () => {
        caller({ video: false });
        callUser({ video: false });
    }

    const handleVideoCall = () => {
        caller({ video: true });
        callUser({ video: true });
    }

    return (
        <>
            <div className="message_header p-3" style={{ cursor: "pointer" }}>
                <div className="message_back"><Link to="/"><i className="fas fa-arrow-left text-dark" /></Link></div>
                {
                    user.length !== 0 &&
                    <UserCard user={user}>
                        <div className="message_tool">
                            <i className="fas fa-phone-alt text-primary mr-3" onClick={handleAudioCall} />

                            <i className="fas fa-video text-success mr-3" onClick={handleVideoCall} />

                            <i className="fas fa-trash text-danger mr-3"
                                onClick={handleDeleteCV}
                            />

                            <i className="fas fa-info-circle text-info"
                                onClick={() => setShowSidebar(!showSidebar)}
                            />
                        </div>
                    </UserCard>
                }
            </div>
            <div className="chat_container" style={{ height: media.length > 0 ? 'calc(100% - 180px)' : '' }} >
                <div className="chat_display" ref={refDisplay}>
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
                    {
                        loadMedia &&
                        <div className="chat_row you_message">
                            <img src={LoadIcon} alt="loading" />
                        </div>
                    }
                    <button className="btn-view btn-load-more"
                        ref={pageEnd} style={{ marginTop: '-25px', opacity: 0 }} >
                        Load More
                    </button>
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
                                    <div><i className="fas fa-venus-mars" /></div>
                                    <span>{user.birthday ? user.gender : 'Other'}</span>
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