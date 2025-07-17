import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MESSAGE_TYPES } from './redux/actions/messageAction';
import audiobell from './audio/got-it-done-613.mp3'
import { GLOBALTYPES } from './redux/actions/globalTypes';
import { NOTIFY_TYPES } from './redux/actions/notifyAction';

const SocketClient = () => {
    const { auth, socket, online, call, notify } = useSelector(state => state);
    const dispatch = useDispatch();
    const audioRef = useRef();

    // Join user
    useEffect(() => {
        socket.emit('joinUser', auth.user)
    }, [socket, auth.user]);

    useEffect(() => {
        socket.on('addMessageToClient', msg => {
            // const currentConversationId = window.location.pathname.split('/').pop();
            // console.log({ msg })
            dispatch({ type: MESSAGE_TYPES.ADD_MESSAGE, payload: msg })

            dispatch({
                type: MESSAGE_TYPES.ADD_USER,
                payload: {
                    ...msg.user,
                    text: msg.text,
                    media: msg.media
                }
            });

            // if (currentConversationId && msg.conversationId !== currentConversationId) {
            //     dispatch(createNotify({
            //         msg: {
            //             id: msg._id,
            //             text: msg.text,
            //             recipients: [auth.user._id],
            //             url: `/message/${msg.conversationId}`,
            //             content: '',
            //             image: msg.media.length > 0 ? msg.media[0].url : '',
            //             user: msg.user,
            //             createdAt: msg.createdAt
            //         },
            //         auth,
            //         socket
            //     }));
            // }

        })

        return () => socket.off('addMessageToClient');
    }, [socket, dispatch, auth]);

    useEffect(() => {
        socket.on('deleteMessageToClient', data => {
            // console.log({ data });
            // dispatch({ type: MESSAGE_TYPES.DELETE_MESSAGE, payload: {newData: data, _id: data._id} });
            dispatch({
                type: MESSAGE_TYPES.DELETE_MESSAGE, payload: {

                    newData: data.listMessages,
                    _id: data.msg.conversation
                }

            });
        })
        return () => socket.off('deleteMessageToClient');
    }, [socket, dispatch]);


    // Check user online
    useEffect(() => {
        socket.emit("checkUserOnline", auth.user);
    }, [socket, auth.user]);

    useEffect(() => {
        socket.on('checkUserOnlineToMe', data => {
            data.forEach(item => {
                if (!online.includes(item.id)) {
                    dispatch({ type: GLOBALTYPES.ONLINE, payload: item.id })
                }
            })
        });
        return () => socket.off("checkUserOnlineToMe");
    }, [socket, dispatch, online]);


    useEffect(() => {
        socket.on('checkUserOnlineToClient', id => {
            // console.log(id);
            if (!online.includes(id)) {
                dispatch({ type: GLOBALTYPES.ONLINE, payload: id })
            }
        });
        return () => socket.off("checkUserOnlineToClient");
    }, [socket, dispatch, online]);

    // check user offline
    useEffect(() => {
        socket.on('CheckUserOffline', id => {
            dispatch({ type: GLOBALTYPES.OFFLINE, payload: id })
        });

        return () => socket.off('CheckUserOffline')
    }, [socket, dispatch]);

    // Call user
    useEffect(() => {
        socket.on('callUserToClient', data => {
            dispatch({ type: GLOBALTYPES.CALL, payload: data });
        });
        return () => socket.off('callUserToClient')
    }, [socket, dispatch]);

    useEffect(() => {
        socket.on('userBusy', (data) => {
            dispatch({ type: GLOBALTYPES.ALERT, pyaload: { error: `${call.username} is busy!!` } })
        });

        return () => socket.off('userBusy');
    }, [socket, dispatch, call]);

    // Notification
    useEffect(() => {
        socket.on('createNotifyToClient', (msg) => {
            // console.log('Notify Received:', msg);
            const currentConversationId = window.location.pathname.split('/').pop();
            // console.log({
            //     currentConversationId,
            //     conversationId: msg.url.endsWith(currentConversationId)
            // })
            if (msg.url.includes("/message/") && msg.url.endsWith(currentConversationId)) {
                return;
            }
            // if (currentConversationId && msg.conversationId !== currentConversationId) {
            //     dispatch({ type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg })
            //     if (notify.sound) audioRef.current.play();
            // }

            dispatch({ type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg })
            if (notify.sound) audioRef.current.play();

        });
        return () => socket.off('createNotifyToClient');
    }, [socket, dispatch, notify.sound]);

    useEffect(() => {
        socket.on('removeNotifyToClient', msg => {
            dispatch({ type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg })
        })

        return () => socket.off('removeNotifyToClient')
    }, [socket, dispatch]);

    useEffect(() => {
        socket.on("deleteMessageToClient", (data) => {
            const { msg, listMessages } = data;
            dispatch({
                type: MESSAGE_TYPES.DELETE_MESSAGE,
                payload: {
                    newData: listMessages,
                    _id: msg.sender
                }
            });
        });
        return () => socket.off("deleteMessageToClient");
    }, [socket, dispatch]);

    useEffect(() => {
        socket.on("editMessageToClient", (data) => {
            dispatch({
                type: MESSAGE_TYPES.EDIT_MESSAGE,
                payload: {
                    newData: data.listMessages,
                    _id: data.msg.sender
                }
            });
        })
        return () => socket.off("editMessageToClient");
    }, [socket, dispatch])
    return (
        <>
            <audio controls ref={audioRef} style={{ display: 'none' }}>
                <source src={audiobell} type="audio/mp3" />
            </audio>
        </>
    )
}

export default SocketClient;