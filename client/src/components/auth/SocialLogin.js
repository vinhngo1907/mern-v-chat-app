import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { GoogleLogin } from 'react-google-login-lite';
import { GoogleLogin } from 'react-google-login';
import { FacebookLogin } from 'react-facebook-login-lite';
import { gapi } from "gapi-script";
import { googleLogin } from "../../redux/actions/authAction";

const SocialLogin = () => {
    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: "699388591357-0t33r1ldkl5io1ghl68hmcpv1crma97g.apps.googleusercontent.com",
                scope: 'email',
            });
        }

        gapi.load('client:auth2', start);
    }, []);

    const dispatch = useDispatch();
    const onGGSuccess = async (response) => {
        console.log(response);
        // console.log(response.getAuthResponse());
        // const tokenId = response.getAuthResponse().id_token
        const tokenId = response.tokenId;
        dispatch(googleLogin(tokenId));
    }

    const onFailure = (err) => {
        console.log(err);
    }
    const onFBSuccess = async (response) => {
        console.log(response);
    }
    return (
        <>
            {/* <GoogleLogin
                    client_id='699388591357-0t33r1ldkl5io1ghl68hmcpv1crma97g.apps.googleusercontent.com'
                    cookiepolicy='single_host_origin'
                    onSuccess={onGGSuccess}
                    onFailure={onFailure}
                    isSignedIn={false}
                /> */}
            <GoogleLogin
                clientId="699388591357-0t33r1ldkl5io1ghl68hmcpv1crma97g.apps.googleusercontent.com"
                buttonText="Sign in with Google"
                onSuccess={onGGSuccess}
                cookiePolicy={'single_host_origin'}
                onFailure={onFailure}
            />
            <FacebookLogin
                appId="1515286105607652"
                onSuccess={onFBSuccess}
            />
        </>
    )
}

export default SocialLogin;