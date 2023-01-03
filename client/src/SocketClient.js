import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const SocketClient = () => {
    const { auth, socket } = useSelector(state => state);

    //Join user
    useEffect(() => {
        socket.emit('joinUser', auth.user)
    }, [socket, auth.user]);

    return (
        <></>
    )
}

export default SocketClient;