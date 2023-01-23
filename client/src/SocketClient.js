import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MESSAGE_TYPES } from './redux/actions/messageAction';
import audiobell from './audio/got-it-done-613.mp3'

const SocketClient = () => {
    const { auth, socket } = useSelector(state => state);
    const dispatch = useDispatch();
    const audioRef = useRef();

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
        <>
            <audio controls ref={audioRef} style={{display:'none'}}>
                <source src={audiobell} type="audio/mp3"/>
            </audio>
        </>
    )
}

export default SocketClient;