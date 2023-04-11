import React, { useState } from "react";
import Header from "../../components/header/Header";
import LeftSide from "../../components/messages/LeftSide"
import RightSide from "../../components/messages/RightSide"
import EditProfile from "../../components/profile/EditProfile";

const Conversation = () => {
    const [onEdit, setOnEdit] = useState(false);
    return (
        <>
            <div className="message d-flex">
                <div className="col-md-4 border-right px-0 left_mess">
                    <Header setOnEdit={setOnEdit} />
                    <LeftSide />
                </div>

                <div className="col-md-8 px-0">
                    <RightSide />
                </div>
            </div>
            <div className="info">
                <div className="info_container">
                    {
                        onEdit && <EditProfile setOnEdit={setOnEdit} />
                    }
                </div>
            </div>
        </>
    )
}

export default Conversation