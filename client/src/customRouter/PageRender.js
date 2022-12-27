import React from "react";

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import NotFound from "../components/NotFound";

const genratePage = (pageName) => {
    const component = () => require(`../pages/${pageName}`).default;

    try {
        return React.createElement(component());
    } catch (error) {
        return <NotFound />
    }
}

const PageRender = () => {
    const { page, id } = useParams();
    const { auth } = useSelector(state => state);
    let pageName = "";
    if (auth.token) {
        if (id) {
            pageName = `${page}/[id]`;
        } else {
            pageName = `${page}`;
        }
    }
    return genratePage(pageName);
}

export default PageRender;