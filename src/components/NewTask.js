import NewTaskForm from './NewTaskForm';
import useFetch from '../hooks/useFetch';
import { useContext } from 'react';
import DataContext from '../context/DataContext';

const NewTask = () => {

    const { getUserList } = useContext(DataContext);

    const { data, fetchError, isLoading } = useFetch('user');

    const userListOptions = getUserList(data);

    return (
        <main className="NewTask">
            <p className={fetchError ? "errmsg" : "offscreen"} aria-live="assertive">{fetchError}</p>
            <h2>New Task</h2>
            {!fetchError && !isLoading && <NewTaskForm userListOptions={userListOptions}/>}
        </main>
    )
}

export default NewTask