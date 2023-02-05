import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MESSAGE_TYPES } from './redux/actions/messageAction';
import audiobell from './audio/got-it-done-613.mp3'
import { GLOBALTYPES } from './redux/actions/globalTypes';

const SocketClient = () => {
    const { auth, socket, online, call } = useSelector(state => state);
    const dispatch = useDispatch();
    const audioRef = useRef();

    // Join user
    useEffect(() => {
        socket.emit('joinUser', auth.user)
    }, [socket, auth.user]);

    useEffect(() => {
        socket.on('addMessageToClient', msg => {
            dispatch({ type: MESSAGE_TYPES.ADD_MESSAGE, payload: msg })

            dispatch({
                type: MESSAGE_TYPES.ADD_USER,
                payload: {
                    ...msg.user,
                    text: msg.text,
                    media: msg.media
                }
            })
        })

        return () => socket.off('addMessageToClient');
    }, [socket, dispatch]);

    useEffect(() => {
        socket.on('deleteMessageToClient', msg => {
            // console.log({msg});
            dispatch({ type: MESSAGE_TYPES.DELETE_MESSAGE, payload: msg });
        })
        return () => socket.off('deleteMessageToClient');
    }, [socket, dispatch]);

    // Check user online
    useEffect(() => {
        socket.emit("checkUserOnline", auth.user);
    }, [socket, auth.user]);

    useEffect(() => {
        socket.on('checkUserOnlineToMe', data => {
            // console.log({ data });
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
    }, [socket, dispatch]);

    return (
        <>
            <audio controls ref={audioRef} style={{ display: 'none' }}>
                <source src={audiobell} type="audio/mp3" />
            </audio>
        </>
    )
}

export default SocketClient;