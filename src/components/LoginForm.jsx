import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../actions/userActions';

const LoginForm = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.user.loading);
    const captchaRef = useRef(null);

    useEffect(() => {
        if (window.hcaptcha) {
            window.hcaptcha.render(captchaRef.current);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const phone_number = event.target.phone_number.value;
        const password = event.target.password.value;
        // const captchaResponse = await window.hcaptcha.getResponse(captchaRef.current);
        const captchaResponse = 'test';
        dispatch(loginUser(phone_number, password, captchaResponse));
    };

    return (
        <div>
            <div>Login Form</div>
            <form onSubmit={handleSubmit}>
                <input name="phone_number" type="text" placeholder="Phone Number" />
                <input name="password" type="password" placeholder="Password" />
                <div className="h-captcha" data-sitekey="0951ef00-8bbd-460b-8325-f2113addb774"></div>
                <br />
                <button type="submit">Log In</button>
            </form>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default LoginForm;