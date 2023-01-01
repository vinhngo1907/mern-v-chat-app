import React, { useState } from "react";
import Header from "../components/header/Header";
import LeftSide from "../components/messages/LeftSide";
import EditProfile from "../components/profile/EditProfile";

const Home = () => {
    const [onEdit, setOnEdit] = useState(false);
    return (
        <div className="Home">
            <div className="message d-flex">
                <div className="col-md-4 border-right px-0">
                    <Header setOnEdit={setOnEdit} />
                    <LeftSide />
                </div>

                <div className="col-md-8 px-0 right_mess">
                    <div className="d-flex justify-content-center align-items-center flex-column h-100">

                        <i className="fab fa-facebook-messenger text-primary"
                            style={{ fontSize: '5rem' }} />
                        <h4>Messenger</h4>

                    </div>
                </div>
            </div>
            <div className="info">
                <div className="info_container">
                    {
                        onEdit && <EditProfile setOnEdit={setOnEdit} />
                    }
                </div>
            </div>
        </div>
    )
}

export default Home
