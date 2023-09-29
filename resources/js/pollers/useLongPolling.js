import { useState, useEffect } from 'react';

function useLongPolling(url, method = 'GET', params = {}, pollingInterval = 5000) {
  const [data, setData] = useState([]);
  const [lastLoadedData, setLastLoadedData] = useState(null);
  const [error, setError] = useState(null);
  const [lastID, setLastID] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios({
        method,
        url,
        params: lastID ? { ...params, lastID } : params,
      });

      if (response.status === 200) {
        const newData = response.data;
        if (newData.length > 0) {
          setLastID(newData[newData.length - 1].id);
          setData(newData);
          setLastLoadedData(new Date());
        }
      } else {
        setError(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (err) {
      setError(`Error fetching data: ${err.message}`);
    } finally {
      setTimeout(fetchData, pollingInterval);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url, method, params, pollingInterval]);

  return { data, lastLoadedData, error };
}

export default useLongPolling;