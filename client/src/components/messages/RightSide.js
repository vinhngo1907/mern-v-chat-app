import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { addMessage, getMessages } from "../../redux/actions/messageAction";
import UserCard from "../UserCard";
import Icons from "../Icons";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { imageUpload } from "../../utils/imageUpload";
import { imageShow, videoShow } from "../../utils/mediaShow";

const RightSide = () => {
    const { auth, theme, message } = useSelector(state => state);
    const dispatch = useDispatch();

    const [user, setUser] = useState([]);
    const [text, setText] = useState("");

    const [media, setMedia] = useState([]);
    const { id } = useParams();
    const [data, setData] = useState([]);

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
        if(newData){
            setData(newData.messages);
        }

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
            <div className="message_header" style={{ cursor: "pointer" }}>
                <div className="message_back"><Link to="/"><i className="fas fa-arrow-left" /></Link></div>
                {
                    user.length !== 0 &&
                    <UserCard user={user}>
                        <div className="message_tool">
                            <i className="fas fa-phone-alt mx-4" />

                            <i className="fas fa-video mx-5" />

                            <i className="fas fa-trash text-danger mx-6" />

                            <i className="fas fa-info-alt" />
                        </div>
                    </UserCard>
                }
            </div>
            <div className="chat_container">
                <div className="chat_display"></div>
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