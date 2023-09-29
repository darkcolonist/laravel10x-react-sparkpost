import React, { useEffect, useRef } from "react";

const AxiosPoller = (props) => {
  const { source
    , callback
    , pollInterval = 1000
    , postParameterName = 'data' } = props.pollerParams;
  const timeoutRef = useRef(null);
  const postParams = useRef(null);
  const iteration = useRef(0);
  const cancelToken = useRef(axios.CancelToken.source());

  const fetchLatest = async (callback) => {
    try {
      const response = await axios.post(
        source + "#i" + iteration.current++
        , postParams.current, {
        cancelToken: cancelToken.current.token,
      });

      if(response.data != ""){
        const _tmpDataToPostToPoller = {};
        _tmpDataToPostToPoller[postParameterName] = response.data;

        if (_tmpDataToPostToPoller)
          postParams.current = _tmpDataToPostToPoller;

        postParams.current = _tmpDataToPostToPoller;
      }

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

    // run first instance immediately
    timeoutRef.current = setTimeout(fetchLatest, 100, callback);

    // console.debug('AxiosPoller mounted', source);
    return () => {
      // Cancel the Axios request when the component unmounts
      cancelToken.current.cancel("Component unmounted");
      clearTimeout(timeoutRef.current);
      // console.debug('AxiosPoller un-mounted', source);
    };
  }, [props.pollerParams]);

  return null;
};

export default AxiosPoller;