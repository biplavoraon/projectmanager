import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Home = () => {
  const { name } = useAuth();
  const [dueTasks, setDueTasks] = useState([]);
  const [weekTasks, setWeekTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchTasks = async () => {
        const userObj = { username : name }
        try {
            const taskResponse = await axiosPrivate.post("/stats/due", userObj,
            {
                signal: controller.signal
            });
            const tasks = await axiosPrivate.post("/stats/week", userObj,
            {
                signal: controller.signal
            });
            if (isMounted)
            {
              setDueTasks(taskResponse.data);
              setWeekTasks(tasks.data);
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
}, [name, axiosPrivate, location, navigate])

  return (
    isLoading
      ? <p>Loading...</p>
      : error
        ? <p>{error}</p>
        : (
          <>
          <section className="homeSec">
            <h3>Overdue Tasks</h3>
            {dueTasks?.length ? (
            <ul>
              {
                dueTasks?.map(task => {
                  return (
                    
                      <li key={task.taskid} className='home' >
                        <div>{task.title}</div>
                        <div className="progress">
                          <span>{task.dueDate}</span>
                          <span>{task.progress}</span>
                        </div>
                      </li>
                  )
                })
              }
            </ul>)
            : <p>No task to display</p>}
          </section>
          <section className="homeSec">
            <h3>Tasks Due This Week</h3>
            {
              weekTasks?.length ? (
                <ul>
                  {
                    weekTasks?.map(task => {
                      return (
                        <li key={task.taskid} className='home'>
                          <div>{task.title}</div>
                          <div className="progress">
                            <span>{task.dueDate}</span>
                            <span>{task.progress}</span>
                          </div>
                        </li>
                      )
                    })
                  }
                </ul>
              ) : <p>No task to display</p>
            }
          </section>
          </>)
  )
}

export default Home