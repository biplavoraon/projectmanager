import { useState, useEffect, useContext } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import DataContext from "../context/DataContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import PageButton from "./PageButton";
import { Link } from "react-router-dom";
import Grid from "./Grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const List = () => {

    const { tasks, setTasks, pages } = useContext(DataContext);
    const [pageSize, setPageSize] = useState(pages[0].value);
    const [offset, setOffset] = useState(0);
    const [search, setSearch] = useState('');
    const totalPages = useRef(1);

    const [isLoading, setIsLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const axiosPrivate = useAxiosPrivate();

    const firstPage = () => setOffset(0);
    const lastPage = () => setOffset(totalPages.current - 1);
    const pageList = Array(Math.min(totalPages.current, 3)).fill().map((_, index) => index)

    const handleChange = (e) => {
        setPageSize(e.target.value);
        setOffset(0);
    }

    const filter = (tasks) => {
        return tasks.filter(task => 
            ((task.title).toLowerCase()).includes(search.toLowerCase()) ||
            ((task.name).toLowerCase()).includes(search.toLowerCase()) ||
            ((task.state).toLowerCase()).includes(search.toLowerCase()) ||
            ((task.priority).toLowerCase()).includes(search.toLowerCase())
            );
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchTasks = async () => {
            try {
                    const taskResponse = await axiosPrivate.get(`/task/${pageSize}/${offset}`,
                        {
                            signal: controller.signal
                        });
                if (isMounted)
                {
                    setTasks(taskResponse.data.content);
                    totalPages.current = taskResponse.data.totalPages;
                }
                setSuccess(true);
                setIsLoading(false);
            }
            catch (err) {
                if (err.constructor.name !== 'CanceledError')
                {
                    navigate('/login', { state : { from: location}, replace : true});
                }
            }
        }
        fetchTasks();
        return () => {
            isMounted = false;
            controller.abort();
        }
  }, [axiosPrivate, setTasks, location, navigate, pageSize, offset])
  
    return (
      <main>
            <h2>Tasks List</h2>
        <section className="tasklist">
            <div className="taskselect">
                <span>Tasks per page</span>
                <select value={pageSize} onChange={handleChange} className='pageselect'>
                    {
                        pages.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.text}
                            </option>
                            ))
                    }
                </select>
            </div>

            <nav className="nav-ex2">
                <button onClick={firstPage} disabled={!success || offset === 0}>&lt;&lt;</button>
                {pageList.map(pg => <PageButton key={pg} pg={pg} offset={offset} setOffset={setOffset} />)}
                <button onClick={lastPage} disabled={!success || offset === totalPages.current - 1}>&gt;&gt;</button>
            </nav>

            <form className="filter" onSubmit={(e) => e.preventDefault()}>
                <input 
                    className="search"
                    id="search" 
                    type="text"
                    placeholder="Search" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    >
                </input>
                <Link to={'/addtask'}>
                    <button className="plus">
                    <FontAwesomeIcon icon={faPlus} />
                    <span> Task</span>
                    </button>
                </Link>
                
            </form>

        </section>
        
        { 
            success 
                ? (tasks?.length && filter(tasks)?.length)
                    ? <Grid tasks={filter(tasks)} />
                    : <p>No tasks to display</p> 
                : isLoading && <p>Loading...</p>
        }
      </main>
    )
}

export default List