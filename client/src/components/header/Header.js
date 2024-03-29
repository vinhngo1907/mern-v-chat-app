import React from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";

const Header = ({setOnEdit}) => {
    return (
        <div className="header bg-light">
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
                <Link to="/" className="logo">
                    <h4 className="navbar-brand text-uppercase p-0 m-0"
                        onClick={() => window.scrollTo({ top: 0 })}>
                        V-Chat
                    </h4>
                </Link>
                <Menu setOnEdit={setOnEdit}/>
            </nav>
        </div>
    )
}

export default Header;