import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MESSAGE_TYPES } from './redux/actions/messageAction';

const SocketClient = () => {
    const { auth, socket } = useSelector(state => state);
    const dispatch = useDispatch();

    //Join user
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
    }, [socket, dispatch])

    return (
        <></>
    )
}

export default SocketClient;