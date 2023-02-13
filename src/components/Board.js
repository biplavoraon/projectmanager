import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DataContext from "../context/DataContext";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../helper/StrictModeDroppable"

const Board = () => {
    const { name } = useAuth();
    const { stateList, userTasks, setUserTasks, taskCol, setTaskCol } = useContext(DataContext);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const errRef = useRef();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const handleOnDragEnd = async (result) => {
        if (!result?.destination) return;

        if (result.source.droppableId === result.destination.droppableId) {
            const sourceIndex = stateList.indexOf(result.source.droppableId);
            const sourceArr = taskCol[sourceIndex];
            const [reOrderedItem] = sourceArr.splice(result.source.index, 1);
            sourceArr.splice(result.destination.index, 0, reOrderedItem);
            const order = sourceArr.map(task => task.taskid);
            const orderArr = stateList.map((state, index) => {
                return (taskCol[index].map(task => task.taskid))
            });
            orderArr.splice(sourceIndex, 1, order);
            localStorage.setItem('taskOrder', JSON.stringify(orderArr));
        }
        else {
            const id = parseInt(result.draggableId);
            const task = userTasks.find(i => i.taskid === id);
            let dueDate = new Date(task.dueDate);
            dueDate.setHours(23, 59, 59);

            const updatedTask = {
                title : task.title,
                description : task.description,
                userid : task.userid,
                state : result.destination.droppableId,
                hoursAssigned : task.hoursAssigned,
                hoursLeft : task.hoursLeft,
                priority : task.priority,
                dueDate : dueDate,
            }
            
            try {
                const response = await axiosPrivate.put(`/hour/${id}`, updatedTask);
                setUserTasks(userTasks.map(i => i.taskid === id ? { ...response.data } : i));
            } 
            catch (err) {
                setError(err.message);
                errRef.current.focus();
            }
            const sourceIndex = stateList.indexOf(result.source.droppableId);
            const destIndex = stateList.indexOf(result.destination.droppableId);
            const sourceArr = taskCol[sourceIndex];
            const destArr = taskCol[destIndex];
            const [reOrderedItem] = sourceArr.splice(result.source.index, 1);
            destArr.splice(result.destination.index, 0, reOrderedItem);
            const sourceOrder = sourceArr.map(task => task.taskid);
            const destOrder = destArr.map(task => task.taskid);
            const orderArr = stateList.map((state, index) => {
                return (taskCol[index].map(task => task.taskid))
            });
            orderArr.splice(sourceIndex, 1, sourceOrder);
            orderArr.splice(destIndex, 1, destOrder);
            localStorage.setItem('taskOrder', JSON.stringify(orderArr));
        }
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchTasks = async () => {
            const userObj = { username : name }
            try {
                const taskResponse = await axiosPrivate.post("/stats/task", userObj,
                {
                    signal: controller.signal
                });
                if (isMounted)
                {
                    setUserTasks(taskResponse.data);
                }
                setIsLoading(false);
            }
            catch (err) {
                if (err.constructor.name !== 'CanceledError')
                {
                    setError(err.message);
                    navigate('/login', { state : { from: location}, replace : true});
                }
            }
        }
        fetchTasks();
        return () => {
            isMounted = false;
            controller.abort();
        }
  }, [axiosPrivate, name, location, navigate, setUserTasks])

  useEffect(() => {
    let tasks = stateList.map(state => []);
    let orderid = stateList.map(state => []);
    const orderArr = JSON.parse(localStorage.getItem('taskOrder'))
    
    stateList?.map((state, index) => {
        const stateTask = userTasks.filter(task => task.state === state);
        let myArr;
        if (!orderArr?.length && stateTask?.length) {
            orderid[index] = stateTask.map(task => task.taskid);
        }
        
        if (orderArr?.length && stateTask?.length) {
            const order = orderArr[index];
            myArr = order.map(pos => {
                return stateTask.find(task => task.taskid === pos)
            });

            const newItems = stateTask.filter(task => {
                return !order.includes(task.taskid);
            })

            if (newItems?.length) myArr = [...newItems, ...myArr];
        }
        return tasks[index] = myArr?.length ? myArr : stateTask;
    });
    if (!orderArr?.length && orderid?.some(x => x?.length > 0))
        localStorage.setItem('taskOrder', JSON.stringify(orderid));
    setTaskCol(tasks);
  }, [userTasks, stateList, setTaskCol])

  const priorityColor = new Map([
    ['LOW', 'green'],
    ['MEDIUM', 'yellow'],
    ['HIGH', 'red'],
    ['CRITICAL', 'red']
  ]);


  let content;
  if (isLoading)
    content = <p>Loading...</p>
  else if (error)
    content = <p>{error}</p>
  else
    content = (
    <div className="board">
        <p ref={errRef} className={error ? "errmsg" : "offscreen"} aria-live="assertive">{error}</p>
        <DragDropContext onDragEnd={handleOnDragEnd}>
            {stateList.map((state, index) => {
            return (
                <Droppable key={state} droppableId={state} >
                    {(provided, col) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className={col.isDraggingOver ? 'boardCol highlight-region' : 'boardCol'}>
                            <h3 style={{backgroundColor: '#55608f'}}>{state}</h3>
                            {taskCol[index].map((task, idx) => {
                                return (
                                    <Draggable key={task.taskid} draggableId={task.taskid.toString()} index={idx} >
                                        {(provided) => (
                                            <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className='boardItem'>
                                                <p>{task.title}</p>
                                                <div className="progress">
                                                    <span style={{ backgroundColor: priorityColor.get(task.priority), borderRadius: 5 }}>{task.priority}</span>
                                                    <span>{task.progress}</span>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>)

            })}
        </DragDropContext>
    </div>)


  return (
    <>
        <h2>Task Board</h2>
        {content}
    </>
  )
}

export default Board