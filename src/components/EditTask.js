import EditTaskForm from './EditTaskForm';
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
            <h2>Edit Task</h2>
            {!fetchError && !isLoading && <EditTaskForm userListOptions={userListOptions}/>}
        </main>
    )
}

export default NewTask