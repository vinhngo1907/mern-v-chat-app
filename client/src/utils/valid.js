export const valid = ({ username, fullname, email, cf_password, password }) => {
    let err = {}
    if (!email) {
        err.email = "Email can not be blank"
    } else if (!validEmail(email)) {
        err.email = "Email format is incorrect"
    }

    if (!username) {
        err.username = "User name can not be blank"
    } else if (username.replace(/ /g, '').length > 25) {
        err.username = "User name is up to 25 characters long."
    }

    if (!fullname) {
        err.fullname = "Fullname can not be blank"
    } else if (fullname.length > 25) {
        err.fullname = "Full name is up to 25 characters long."
    }

    if (!password) {
        err.password = "Password can not be blank"
    } else if (password.length < 6) {
        err.password = "Password must be at least 6 characters"
    }

    if (password !== cf_password) {
        err.cf_password = "Password does not match"
    }

    return {
        errMsg: err,
        errLength: Object.keys(err).length
    }
}

export const validPass = (password, cf_password) => {
    let err = {}
    if (!password) {
        err.password = "Password can not be blank"
    } else if (password.length < 6) {
        err.password = "Password must be at least 6 characters"
    }

    if (password !== cf_password) {
        err.cf_password = "Password does not match"
    }

    return {
        errMsg: err,
        errLength: Object.keys(err).length
    }
}

function validEmail(email) {
    // eslint-disable-next-line
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);

}