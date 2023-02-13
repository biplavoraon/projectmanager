import { useContext, React, useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import DataContext from '../context/DataContext';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const EditTaskForm = ({ userListOptions }) => {
    const {
            priorities,
            tasks, setTasks,
        } = useContext(DataContext);

    const { taskid } = useParams();
    const navigate = useNavigate();
    const task = tasks.find(task => (task.taskid).toString() === taskid);
    
    const [editTitle, setEditTitle] = useState('');
    const errRef = useRef();
    const [editDescription, setEditDescription] = useState('');
    const [editAssignedTo, setEditAssignedTo] = useState('');
    const [editHoursAssigned, setEditHoursAssigned] = useState('');
    const editHoursLeft = useRef(0);
    const [editPriority, setEditPriority] = useState('');
    const [editDueDate, setEditDueDate] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const dueDate = useRef(new Date(task.dueDate));
    dueDate.current.setHours(23, 59, 59);

    const priorityList = priorities.current;
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (task) {
            setEditTitle(task.title);
            setEditDescription(task.description);
            setEditHoursAssigned(task.hoursAssigned);
            setEditPriority(task.priority);
            setEditAssignedTo(task.userid)
            setEditDueDate(dueDate.current);
            editHoursLeft.current = task.hoursLeft;
        }
    }, [task])

    const handleEdit = async (id) => {
        editHoursLeft.current += editHoursAssigned - task.hoursAssigned;
        editHoursLeft.current = editHoursLeft.current >= 0 ? editHoursLeft.current : 0;

        const updatedTask = {
            title : editTitle,
            description : editDescription,
            userid : editAssignedTo,
            state : task.state,
            hoursAssigned : editHoursAssigned,
            hoursLeft : editHoursLeft.current,
            priority : editPriority,
            dueDate : editDueDate
        };

        try {
            const response = await axiosPrivate.put(`/task/${taskid}`, updatedTask);
            setTasks(tasks.map(task => task.taskid === id ? { ...response.data } : task));
        
            setEditTitle('');
            setEditDescription('');
            setEditAssignedTo('');
            setEditHoursAssigned('');
            setEditPriority('');
            setEditDueDate('');
            
            navigate("/task");
        } 
        catch (err) {
            setErrMsg(err.message);
            errRef.current.focus();
        }
    }

  return (
    <section>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h1>Edit Task</h1>
        <form className="newTaskForm" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="title">Title:</label>
            <input
                id="title"
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
            />

            <label htmlFor="description">Description:</label>
            <input
                id="description"
                type="text"
                required
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
            />
            
            <label htmlFor="hoursAssigned">Estimated Hours:</label>
            <input
                id="hoursAssigned"
                type="number"
                min="1" max="500" step="5" 
                required
                value={editHoursAssigned}
                onChange={(e) => setEditHoursAssigned(e.target.value)}
            />
            
            <label htmlFor="priority">Priority: </label>
            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
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
            <select value={editAssignedTo} onChange={(e) => setEditAssignedTo(e.target.value)}>
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
            selected={editDueDate} 
            onChange={(date) => setEditDueDate(date)} 
            dateFormat="yyyy/MM/dd"
            />
            
            <button type="submit" onClick={() => handleEdit(task.taskid)}>Submit</button>
        </form>
    </section>
  )
}

export default EditTaskForm