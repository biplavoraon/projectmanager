import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios'
import useAuth from '../hooks/useAuth';
import useInput from '../hooks/useInput';

const Login = () => {
    const { setAuth } = useAuth();
    
    const userRef = useRef();
    const errRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [user, resetUser, userAttributes] = useInput('user', '');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userRequest = {
            username : user,
            password : pwd
        }

        try {
            const response = await axios.post('/login', userRequest, 
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
            );
            const accessToken = response?.data?.accessToken;
            setAuth({ user, accessToken });
            resetUser('');
            setPwd('');
            navigate(from, { replace: true });
        }
        catch (err){
            if (!err?.response) {
                setErrMsg('No Server Response');
            } 
            else if (err.response?.status === 403) {
                setErrMsg('Invalid Username or Password');
            } 
            else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const handleDemo = async (e) => {
        e.preventDefault();
        const userRequest = {
            username : process.env.REACT_APP_USERNAME,
            password : process.env.REACT_APP_PASSWORD
        }

        try {
            const response = await axios.post('/login', userRequest, 
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
            );
            const accessToken = response?.data?.accessToken;
            setAuth({ user : process.env.REACT_APP_USERNAME, accessToken });
            navigate(from, { replace: true });
        }
        catch (err){
            if (!err?.response) {
                setErrMsg('No Server Response');
            } 
            else if (err.response?.status === 403) {
                setErrMsg('Invalid Username or Password');
            } 
            else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

  return (
    <div className='login'>
    <section>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username:</label>
            <input 
                type="text" 
                id="username"
                ref={userRef}
                autoComplete="off"
                {...userAttributes}
                required
            />

            <label htmlFor="password">Password:</label>
            <input 
                type="password" 
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
            />
            <div>
                <button onClick={handleSubmit} >Sign In</button>
                <button onClick={handleDemo} className='sign'>Demo User</button>
            </div>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>

        </form>
    </section>
    </div>
    )
}
export default Login