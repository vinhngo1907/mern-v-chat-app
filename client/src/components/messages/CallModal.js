import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import RingRing from '../../audio/ringring.mp3';
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { addMessage } from "../../redux/actions/messageAction";
import Avatar from "../Avatar";

const CallModal = () => {
    const { call, auth, socket } = useSelector(state => state);
    const dispatch = useDispatch();
    const [answer, setAnswer] = useState(false);

    const [hours, setHours] = useState(0);
    const [mins, setMins] = useState(0);
    const [second, setSecond] = useState(0);
    const [total, setTotal] = useState(0);

    const [tracks, setTracks] = useState(null);
    const [newCall, setNewCall] = useState(null);

    // Set Time
    useEffect(() => {
        const setTime = () => {
            setTotal((t) => t + 1);
            setTimeout(setTime, 1000);
        }
        setTime();
        return () => setTotal(0)
    }, []);

    useEffect(() => {
        setSecond(total % 60);
        console.log({ total, second });
        setMins(parseInt(total / 60));
        setHours(parseInt(total / 3600));
    }, [total])

    // End call
    const addCallMessage = useCallback((call, times, disconnect) => {
        if (call.recipient !== auth.user._id || disconnect) {
            const msg = {
                sender: call.sender,
                recipient: call.recipient,
                text: '',
                media: [],
                call: { video: call.video, times },
                createdAt: new Date().toISOString()
            }
            dispatch(addMessage({ msg, auth, socket }))
        }

    }, [auth, dispatch, socket, call]);

    const handleEndCall = (e) => {
        tracks && tracks.forEach(track => track.stop());
        if (newCall) newCall.close();

        let times = answer ? total : 0;
        socket.emit('endCall', { ...call, times });

        addCallMessage(call, times);
        dispatch({ type: GLOBALTYPES.CALL, payload: null })
    }

    useEffect(() => {
        if (answer) {
            setTotal(0);
        } else {
            const timer = setTimeout(() => {
                socket.emit('endCall', { ...call, times: 0 });
                addCallMessage(call, 0);
                dispatch({ type: GLOBALTYPES.CALL, payload: null });
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, [answer, dispatch, socket, addCallMessage, call])

    // Stream media

    // Answer Call
    const handleAnswer = () => {

    }

    // Disconnect
    useEffect(() => {
        socket.on('callerDisconnect')
    }, [socket, answer, dispatch, call, addCallMessage, tracks, total, newCall]);

    // play - pause audio
    const playAudio = (newAudio) => {
        newAudio.play();
    }
    const pauseAudio = (newAudio) => {
        newAudio.pause();
        newAudio.currentTime = 0;
    }
    useEffect(() => {
        let newAudio = new Audio(RingRing);
        if (answer) {
            pauseAudio(newAudio);
        } else {
            playAudio(newAudio)
        }

        return () => pauseAudio(newAudio);
    }, [answer])
    return (
        <div className="call_modal">
            <div className="call_box" >
                <div className="text-center" style={{ padding: '40px 0' }} >
                    <Avatar src={call.avatar} size="super-avatar" />
                    <h4>{call.username}</h4>
                    <h6>{call.fullname}</h6>

                    {
                        answer
                            ? <div>
                                <span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
                                <span>:</span>
                                <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                                <span>:</span>
                                <span>{second.toString().length < 2 ? '0' + second : second}</span>
                            </div>
                            : <div>
                                {
                                    call.video
                                        ? <span>calling video...</span>
                                        : <span>calling audio...</span>
                                }
                            </div>
                    }
                </div>
                {/* anwser */}
                <div className="call_menu">
                    <button className="material-icons text-danger"
                        onClick={handleEndCall}>
                        call_end
                    </button>
                    {
                        (call.recipient === auth.user._id && !answer) &&
                        <>
                            {
                                call.video
                                    ? <button className="material-icons text-success"
                                        onClick={handleAnswer}>
                                        videocam
                                    </button>
                                    : <button className="material-icons text-success"
                                        onClick={handleAnswer}>
                                        call
                                    </button>
                            }
                        </>
                    }
                </div>
            </div>
            <div className="show_video"></div>
        </div>
    )
}
export default CallModal;