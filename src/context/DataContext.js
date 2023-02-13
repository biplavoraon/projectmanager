import { createContext, useState, useRef, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {

    const getList = (props) => {
        const propList = [];
        props?.forEach( (prop) => {
        propList.push({value : prop, text : prop});
    })
    return propList;
    }

    const getUserList = (users) => {
        const userArray = [];
        users?.forEach((user) => {
            userArray.push({value : user.userid, text : user.name});
        });
        return userArray;
    }

    const axiosPrivate = useAxiosPrivate();

    //states

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [taskCol, setTaskCol] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [stateList, setStateList] = useState([]);
    const priorities = useRef([]);
    const states = useRef([]);
    const pageList = [10, 15, 25];
    const pages = getList(pageList);

    const [dueDate, setDueDate] = useState(() =>{
        const defaultDate = new Date(Date.now());
        defaultDate.setHours(23, 59, 59);
        return defaultDate;
    });

  // Get request to fetch all tasks
    useEffect(() => {
        const fetchLists = async () => {
        try {
            const priorityResponse = await axiosPrivate.get('/task/priority');
            const stateResponse = await axiosPrivate.get('/task/states');
            setStateList(stateResponse.data);
            priorities.current = getList(priorityResponse.data);
            states.current = getList(stateResponse.data);
        } 
        catch (err) {
        }
        }

        fetchLists();
    }, [axiosPrivate])

    return (
        <DataContext.Provider value={{
            //Data
            
            tasks, setTasks,
            users, setUsers,
            userTasks, setUserTasks,
            dueDate, setDueDate,
            priorities,
            states, stateList,
            pages, getUserList,
            taskCol, setTaskCol
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;