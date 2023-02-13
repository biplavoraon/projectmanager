import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useContext, useRef } from "react";
import DataContext from "../context/DataContext";
import { useState } from "react";

const Grid = ({ tasks }) => {
    const {rolesMap} = useAuth();
    const allowedRoles = ['ROLE_ADMIN'];
    const axiosPrivate = useAxiosPrivate();
    const { setTasks } = useContext(DataContext);
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState();

    const cond = !rolesMap?.find(role => allowedRoles?.includes(role));

    const handleDelete = async (taskid) => {
        try {
            await axiosPrivate.delete(`/task/${taskid}`);
            const taskList = tasks.filter(task => task.taskid !== taskid);
            setTasks(taskList);
        } 
        catch (err) {
            setErrMsg(err.message);
            errRef.current.focus();
        }
    }

  return (
    <>
    <div className='grid'>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <ul>
            <li>
                <div className='heading'>Title</div>
                <div className='heading'>Assignee</div>
                <div className='heading'>State</div>
                <div className='heading'>Hours Left</div>
                <div className='heading'>Progress</div>
                <div className='heading'>Priority</div>
                <div className='heading'>Due Date</div>
                <div className='heading'>Actions</div>
            </li>

            { tasks.map((task) => (
                <li key={task.taskid}>
                    <div className='content'>{task.title}</div>
                    <div className='content'>{task.name}</div>
                    <div className='content'>{task.state}</div>
                    <div className='content'>{task.hoursLeft}</div>
                    <div className='content'>{task.progress}</div>
                    <div className='content'>{task.priority}</div>
                    <div className='content'>{task.dueDate}</div>
                    <div className='content'>
                        <Link to={`/task/${task.taskid}`}>
                            <button className="actions">
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                        </Link>
                        <Link to={`/edit/${task.taskid}`}>
                            <button className={cond ? "hide" : "actions"} >
                                <FontAwesomeIcon icon={faPenToSquare} />
                                {/* Edit */}
                            </button>
                        </Link>
                        <button className={cond ? "hide" : "actions"} onClick={() => handleDelete(task.taskid)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    </div>

    <div className="card">
        <ul>
            { tasks.map((task) => (
                <li key={task.taskid}>
                    <div className="heading">Title</div>
                    <div>{task.title}</div>

                    <div className="heading">Assignee</div>
                    <div>{task.name}</div>

                    <div className="heading">State</div>
                    <div>{task.state}</div>

                    <div className="heading">Hours Left</div>
                    <div>{task.hoursLeft}</div>

                    <div className="heading">Progress</div>
                    <div>{task.progress}</div>

                    <div className="heading">Priority</div>
                    <div>{task.priority}</div>

                    <div className="heading">Due Date</div>
                    <div>{task.dueDate}</div>

                    <div className="heading">Actions</div>
                    <div>
                        <Link to={`/task/${task.taskid}`}>
                            <button className="actions">
                                <FontAwesomeIcon icon={faEye} />
                            </button>
                        </Link>
                        <Link to={`/edit/${task.taskid}`}>
                            <button className={cond ? "hide" : "actions"} >
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                        </Link>
                        <button className={cond ? "hide" : "actions"} onClick={() => handleDelete(task.taskid)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    </div>
    </>
  )
}

export default Grid