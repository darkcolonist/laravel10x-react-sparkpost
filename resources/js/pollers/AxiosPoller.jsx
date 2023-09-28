import { useEffect, useRef } from "react";

const AxiosPoller = (props) => {
  const { source, pollInterval, postParams, callback } = props;
  const timeoutRef = useRef(null);
  const cancelToken = useRef(axios.CancelToken.source());

  const fetchLatest = async (callback) => {
    try {
      const response = await axios.post(source, postParams, {
        cancelToken: cancelToken.current.token,
      });

      if (typeof callback === "function") {
        callback(response.data);
      }

      // Set the timeout for the next poll
      timeoutRef.current = setTimeout(fetchLatest, pollInterval, callback);
    } catch (error) {
      if (!axios.isCancel(error)) {
        // Handle errors if needed, but only if it's not a cancelation error
      }

      // Set the timeout for the next poll even if there's an error
      timeoutRef.current = setTimeout(fetchLatest, pollInterval, callback);
    }
  };

  useEffect(() => {
    // Create a new CancelToken source when the component mounts
    cancelToken.current = axios.CancelToken.source();

    timeoutRef.current = setTimeout(fetchLatest, 100, callback);
    return () => {
      // Cancel the Axios request when the component unmounts
      cancelToken.current.cancel("Component unmounted");
      clearTimeout(timeoutRef.current);
    };
  }, [source, pollInterval, postParams]);

  return null;
};

export default AxiosPoller;