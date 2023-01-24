import React from "react";
import { useDispatch } from "react-redux";
import { GoogleLogin } from 'react-google-login-lite';
import { FacebookLogin } from 'react-facebook-login-lite';
// import { gapi } from "gapi-script";
import { googleLogin } from "../../redux/actions/authAction";

const SocialLogin = () => {
    // useEffect(() => {
    //     function start() {
    //         gapi.client.init({
    //             clientId: "699388591357-0t33r1ldkl5io1ghl68hmcpv1crma97g.apps.googleusercontent.com",
    //             scope: 'email',
    //         });
    //     }

    //     gapi.load('client:auth2', start);
    // }, []);
    const dispatch = useDispatch();

    const onGGSuccess = async (googleUser) => {
        console.log(googleUser.getAuthResponse());
        const tokenId = googleUser.getAuthResponse().id_token
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
            <div className="my-2">
                <GoogleLogin
                    client_id='699388591357-0t33r1ldkl5io1ghl68hmcpv1crma97g.apps.googleusercontent.com'
                    cookiepolicy='single_host_origin'
                    onSuccess={onGGSuccess}
                    onFailure={onFailure}
                />
            </div>

            <div className="my-2">
                <FacebookLogin
                    appId="1515286105607652"
                    onSuccess={onFBSuccess}
                />
            </div>
        </>
    )
}

export default SocialLogin;