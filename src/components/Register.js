import { React, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import useInput from '../hooks/useInput'

const NAME_REGEX = /^[A-z][A-z\s.,']{0,22}[A-z]$/;
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
    const API_URL = '/register';

    const userRef = useRef();
    const errRef = useRef();

    const [name, resetName, nameAttributes] = useInput('name', '');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [user, resetUser, userAttributes] = useInput('user', '');
    const [validUsername, setValidUsername] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name])

    useEffect(() => {
        setValidUsername(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [name, user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            name : name,
            username : user,
            password : pwd,
            role : 'USER'
        }

        try {
            await axios.post(API_URL, newUser,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            setSuccess(true);
            resetUser();
            resetName();
            setPwd('');
            setMatchPwd('');
        }
        catch(err) {
            setErrMsg(JSON.stringify(err.response ? err.response.data : 'Registration failed'));
            errRef.current.focus();
        }
    }

  return (
    <div className='login'>
    {
        success ? (
            <section>
                <h1>Success!</h1>
                <p>
                    <Link to="/login">Sign In</Link>
                </p>
            </section>
        ) : (
    
    <section>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">
                Name:
                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validName || !name ? "hide" : "invalid"} />
            </label>
            <input
                type="text"
                id="name"
                ref={userRef}
                {...nameAttributes}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="nidnote"
                onFocus={() => setNameFocus(true)}
                onBlur={() => setNameFocus(false)}
            />
            <p id="nidnote" className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                2 to 24 characters.<br />
                Must begin & end with a letter.<br />
                Letters, spaces, dots, commas, apostrophes allowed.
            </p>

            <label htmlFor="username">
                Username:
                <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validUsername || !user ? "hide" : "invalid"} />
            </label>
            <input
                type="text"
                id="username"
                autoComplete="off"
                {...userAttributes}
                required
                aria-invalid={validUsername ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
            />
             <p id="uidnote" className={userFocus && user && !validUsername ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                4 to 24 characters.<br />
                Must begin with a letter.<br />
                Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password">
                Password:
                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
            </label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
            />
            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.<br />
                Must include uppercase and lowercase letters, a number and a special character.<br />
                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd">
                Confirm Password:
                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
            </label>
            <input
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="confirmnote"
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
            />
            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
            </p>
            <button disabled={!validName || !validUsername || !validPwd || !validMatch ? true : false}>Sign Up</button>
        </form>
        <p>
            Already registered?<br />
            <span className="line">
                <Link to="/">Sign In</Link>
            </span>
        </p>
    </section>
        )}
    </div>
  )
}

export default Register