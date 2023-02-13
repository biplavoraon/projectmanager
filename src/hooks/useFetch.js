import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const useFetch = (dataUrl) => {
    const [data, setData] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        const fetchData = async (url) => {
            setIsLoading(true);
            try {
              const response = await axiosPrivate.get(`/${url}`,
                {
                    signal: controller.signal
                });
                if (isMounted) {
                    setData(response.data);
                    setFetchError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setFetchError(err.message);
                    setData([]);
                }
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        fetchData(dataUrl);

        return () => {
          isMounted = false;
          controller.abort();
      }
    }, [dataUrl, axiosPrivate]);

    return { data, fetchError, isLoading };
}

export default useFetch;