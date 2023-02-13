import { useContext, useState } from 'react';
import DataContext from '../context/DataContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const TaskPage = ( ) => {
    const { tasks, setTasks } = useContext(DataContext);
    const { taskid } = useParams();
    const { name } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const task = tasks.find(task => (task.taskid).toString() === taskid);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(23, 59, 59);
    const [hoursLeft, setHoursLeft] = useState(task.hoursLeft);

    const updateHours = async (id) => {
        const updatedTask = {
            title : task.title,
            description : task.description,
            userid : task.userid,
            state : task.state,
            hoursAssigned : task.hoursAssigned,
            hoursLeft : hoursLeft,
            priority : task.priority,
            dueDate : dueDate
        }

        try {
            const response = await axiosPrivate.put(`/hour/${id}`, updatedTask);
            setTasks(tasks.map(task => task.taskid === taskid ? { ...response.data } : task));
            navigate('/task');
            } 
            catch (err) {
            }
        }

    return (
            <section className="task">
                {task &&
                    <>
                        <h2>{task.title}</h2>
                        <ul className='taskpage'>
                            <li><h4>Description</h4>{task.description}</li>
                            <li><h4>State</h4>{task.state}</li>
                            <li><h4>Hours Assigned</h4>{task.hoursAssigned}</li>
                            <li>
                                <h4>Hours Left </h4>
                                
                                {task.username === name ? (
                                <>
                                <input
                                    id="hoursAssigned"
                                    type="number"
                                    min="0" max={task.hoursAssigned} step="5" 
                                    required
                                    value={hoursLeft}
                                    onChange={(e) => setHoursLeft(e.target.value)}
                                />
                                <button onClick={() => updateHours(taskid)}>Update</button>
                                </>
                                ) : <p>{task.hoursLeft}</p>}
                            </li>
                            <li><h4>Task Prority</h4>{task.priority}</li>
                            <li><h4>Due Date</h4>{task.dueDate}</li>
                            <li><h4>Progress</h4>{task.progress}</li>
                            <li><h4>Assigned To</h4>{task.name}</li>
                        </ul>
                    </>
                }
                {!task &&
                    <>
                        <h2>Task Not Found</h2>
                        <p>Well, that's disappointing.</p>
                        <p>
                            <Link to='/'>Visit Our Homepage</Link>
                        </p>
                    </>
                }
            </section>
    )
}

export default TaskPage