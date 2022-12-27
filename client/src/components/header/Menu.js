import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/actions/authAction";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import Avatar from "../Avatar";

const Menu = ({setOnEdit}) => {
    const { auth, theme } = useSelector(state => state);
    const dispatch = useDispatch();

    return (
        <div className="menu">
            <ul className="navbar-nav flex-row">
                <li className="nav-item dropdown" style={{ opacity: 1 }} >
                    <span className="nav-link dropdown-toggle" id="navbarDropdown"
                        role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <Avatar src={auth.user.avatar} size="medium-avatar" />
                    </span>

                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>
                            <i className="fas fa-user mr-2" /> Profile
                        </Link>
                        <label htmlFor="edit" className="dropdown-item"
                            onClick={() => setOnEdit(true)}>
                            < i className="fas fa-edit mr-2" /> Edit profile
                        </label>
                        <label htmlFor="theme" className="dropdown-item"
                            onClick={() => dispatch({
                                type: GLOBALTYPES.THEME, payload: !theme
                            })}>
                            {theme ? < i className="fas fa-sun light-icon mr-2" /> : <i className="fas fa-moon dark-icon mr-2"/>}
                            {theme ? 'Light mode' : 'Dark mode'}
                        </label>

                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to="/"
                            onClick={() => dispatch(logout())}>
                            <i className="fas fa-sign-out-alt" /> Logout
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Menu;