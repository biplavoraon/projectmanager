import axios from '../api/axios'
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();
    const API_URL = '/token/refresh';

    const refresh = async () => {
        const response = await axios.get(API_URL, 
            {
                withCredentials: true
            });
            setAuth(prev => {
                return { ...prev, accessToken: response.data.accessToken }
            });
            return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;