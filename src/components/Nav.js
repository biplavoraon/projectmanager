import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios'
import useAuth from '../hooks/useAuth';

const Nav = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(prev => !prev);
  }

  const logout = async () => {
    try {
      await axios.get('/signout', {
        withCredentials : true
      });
        setAuth({});
        localStorage.removeItem('taskOrder');
        navigate("/login");
      }
      catch (err){
      }
    }

  return (
    <header className='header'>
      <nav className='navbar'>
          <p className='title'><Link to="/">💻 Project Manager</Link></p>
          <ul className={toggle ? 'active' : 'menu'}>
            <li><Link to="task">List</Link></li>
            <li><Link to="board">Board</Link></li>
            <li><button className='logout' onClick={() => logout()}>Sign Out</button></li>
          </ul>
        <button className='hamburger' onClick={() => handleToggle()}>&#9776;</button>
      </nav>
    </header>
  )
}

export default Nav