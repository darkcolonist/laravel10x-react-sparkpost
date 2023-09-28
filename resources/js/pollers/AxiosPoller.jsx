import { useEffect, useRef } from "react";

const AxiosPoller = (props) => {
  const { source, pollInterval, postParams, callback } = props;
  const timeoutRef = useRef(null);

  const fetchLatest = async (callback) => {
    try {
      const response = await axios.post(source, postParams);

      if (typeof callback === "function") {
        callback(response.data);
      }

      // Set the timeout for the next poll
      timeoutRef.current = setTimeout(fetchLatest, pollInterval, callback);
    } catch (error) {
      // Handle errors if needed
      // Set the timeout for the next poll even if there's an error
      timeoutRef.current = setTimeout(fetchLatest, pollInterval, callback);
    }
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(fetchLatest, 100, callback);
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [source, pollInterval, postParams]);

  return null;
};

export default AxiosPoller;