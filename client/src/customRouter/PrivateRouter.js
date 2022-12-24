import { Route, Redirect } from "react-router-dom";

const PrivateRouter = (props) => {
    const firsLogin = localStorage.getItem("firstLogin");
    return firsLogin ? <Route {...props} /> : <Redirect to="/" />
}

export default PrivateRouter;