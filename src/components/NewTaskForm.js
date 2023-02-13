import { useContext, React, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import DataContext from '../context/DataContext';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useInput from '../hooks/useInput';

const NewTaskForm = ({ userListOptions }) => {
    const {
        dueDate, setDueDate,
        priorities,
        tasks, setTasks,
        } = useContext(DataContext);

    const [title, resetTitle, titleAttribs] = useInput('title', '');
    const errRef = useRef();
    const [description, resetDescription, descriptionAttribs] = useInput('description', '');
    const [assignedTo, setAssignedTo] = useState('');
    const [hoursAssigned, setHoursAssigned] = useState(1);
    const [priority, setPriority] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const priorityList = priorities.current;
    const axiosPrivate = useAxiosPrivate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTask = {
        title : title,
        description : description,
        userid : assignedTo,
        state : "NEW",
        hoursAssigned : hoursAssigned,
        hoursLeft : hoursAssigned,
        priority : priority,
        dueDate : dueDate
        };
        try {
            const response = await axiosPrivate.post('/task', newTask);
            const allTasks = [...tasks, response.data];
            setTasks(allTasks);
        
            resetTitle();
            resetDescription();
            setAssignedTo('');
            setHoursAssigned(0);
            setPriority('');
            
            navigate("/task");
        } 
        catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } 
            else if (err.response?.status === 400) {
                setErrMsg('Invalid fields');
            } 
            else {
                navigate('/login', { state : { from: location}, replace : true});
            }
            errRef.current.focus();
        }
    }

  return (
    <section>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1>Add New Task</h1>
        <form className="newTaskForm" onSubmit={handleSubmit}>
                <label htmlFor="title">Title:</label>
                <input
                    id="title"
                    type="text"
                    required
                    {...titleAttribs}
                />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    required
                    {...descriptionAttribs}
                />
                
                <label htmlFor="hoursAssigned">Estimated Hours:</label>
                <input
                    id="hoursAssigned"
                    type="number"
                    min="1" max="500" step="5" 
                    required
                    value={hoursAssigned}
                    onChange={(e) => setHoursAssigned(e.target.value)}
                />
                
                <label htmlFor="priority">Priority: </label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="" disabled>--Select an Option--</option>
                    {
                        priorityList.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.text}
                            </option>
                          ))
                    }
                </select>

                <label htmlFor="assignedTo">Assignee: </label>
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                    <option value="" disabled>--Select a User--</option>
                    {
                        userListOptions.map((option, index) => (
                            <option key={index} value={option.value}>
                              {option.text}
                            </option>
                          ))
                    }
                </select>
                
                <label htmlFor="dueDate">Due Date: </label>
                <DatePicker 
                selected={dueDate} 
                onChange={(date) => setDueDate(date)} 
                dateFormat="yyyy/MM/dd"
                />
                
                <button type="submit">Submit</button>
        </form>
    </section>
  )
}

export default NewTaskForm