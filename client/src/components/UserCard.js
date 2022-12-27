import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

const UserCard = ({ children, user, border, msg }) => {
    const { theme } = useSelector(state => state);
    const handleCloseAll = () => {

    }
    const showMsg = (user) => {
        return (
            <>
                <div style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
                    {user.text}
                </div>
            </>
        )
    }
    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
            <div>
                <Link to={`/profile/${user._id}`} onClick={handleCloseAll}
                    className="d-flex align-items-center user_card">
                    <Avatar src={user.avatar} size='big-avatar' />
                    <div className="ml-1" style={{ transform: 'translateY(-2px)' }}>
                        <span className="d-block">{user.username}</span>
                        <small style={{ opacity: 0.7 }}>
                            {msg ? showMsg(user) : user.fullname}
                        </small>
                    </div>
                </Link>
            </div>
            {children}
        </div>
    )
}

export default UserCard;