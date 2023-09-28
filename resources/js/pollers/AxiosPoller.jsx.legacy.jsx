import { useEffect, useRef } from "react";
import axios from "axios";
// import { useConversationsStore, useCurrentConversationStore } from "../helpers/StateHelper";

const AxiosPoller = (props) => {
  const { source, pollInterval, postParams } = props;
  const fetchLatestEnabledRef = useRef(false);
  const cancelAxiosSourceRef = useRef(null);

  const handleResponse = (data) => {
    // console.log("Received data:", data);
  };

  const startFetchLatest = () => {
    console.info('fetchLatest poller started');
    fetchLatestEnabledRef.current = true;
    fetchLatest(handleResponse);
  }

  const stopFetchLatest = () => {
    console.info('fetchLatest poller stopped');
    fetchLatestEnabledRef.current = false;
    if (cancelAxiosSourceRef.current) {
      console.info(cancelAxiosSourceRef.current.token, 'axios source stopped');
      cancelAxiosSourceRef.current.cancel('poller cancelled');
    }
  }

  const fetchLatest = async (callback) => {
    if (!fetchLatestEnabledRef.current) return;

    try {
      const response = await axios.post(source, postParams, {
        cancelToken: cancelAxiosSourceRef.current.token,
      });

      if (typeof callback === 'function') {
        callback(response.data);
      }

      setTimeout(fetchLatest, pollInterval, props.callback);
    } catch (error) {
      setTimeout(fetchLatest, pollInterval, props.callback);
    }
  }

  useEffect(() => {
    cancelAxiosSourceRef.current = axios.CancelToken.source();
    startFetchLatest();

    return () => {
      stopFetchLatest();
    }
  }, [source, pollInterval, postParams]); // Add postParams to dependency array

  return null;
}

// const MessagePoller = () => {
//   const conversations = useConversationsStore.getState();
//   const currentConversation = useCurrentConversationStore.getState();

//   return (
//     <React.Fragment>
//       {/* Example usage of Poller component */}
//       <Poller
//         source="/message/fetch?conversations"
//         postParams={conversations}
//         pollInterval={1000}
//       />
//       <Poller
//         source="/message/fetch?messageHistory"
//         postParams={{ conversationID: currentConversation.conversationID, lastLoadedMessageID: currentConversation.lastLoadedMessageID }}
//         pollInterval={2000}
//       />
//     </React.Fragment>
//   );
// }

export default AxiosPoller;
