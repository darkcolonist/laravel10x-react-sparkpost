import React from "react";
import { useLongPollerStore } from "../helpers/StateHelper";

const Poller = React.memo((props) => {
  let fetchLatestEnabled = false;
  let lastID = null;
  let cancelAxiosSource;
  let iteration = 0;

  const [newPollerData,setNewPollerData] = React.useState([]);

  React.useEffect(() => {
    if(typeof props.onNewUpdates === 'function'){
      props.onNewUpdates(newPollerData);
    }
  },[newPollerData]);

  function startFetchLatest() {
    fetchLatestEnabled = true;
    fetchLatest();
  }

  function stopFetchLatest() {
    fetchLatestEnabled = false;
    if (cancelAxiosSource)
      cancelAxiosSource.cancel('poller cancelled');
  }

  function parseLastIDFromResponse(response) {
    if (response && response.data) {
      if (response.data.lastID !== undefined) {
        return response.data.lastID;
      }

      let lastIndex = 0;
      if (response.data.length > 0 && props.order !== undefined && props.order === "asc")
        lastIndex = response.data.length - 1;

      if (Array.isArray(response.data) && response.data.length > 0 && response.data[lastIndex].id !== undefined) {
        return response.data[lastIndex].id;
      }
    }
    return lastID;
  }

  async function fetchLatest() {
    cancelAxiosSource = axios.CancelToken.source();

    // Stop polling if the 'stopPolling' flag is set to true
    if (!fetchLatestEnabled) return;

    try {

      let postParams = {
        lastID
      };

      if (props.post)
        postParams = { ...postParams, ...props.post };

      const response = await axios.post(props.url + '#i' + iteration++, postParams, {
        cancelToken: cancelAxiosSource.token,
      });

      const tmpLastID = parseLastIDFromResponse(response);
      if(tmpLastID !== lastID){
        setNewPollerData(response.data);
        lastID = tmpLastID;
      }

      setTimeout(fetchLatest, 1000);
    } catch (error) {
      console.error(error, 'continue polling anyway');
      setTimeout(fetchLatest, 1000);
    }
  }

  React.useEffect(() => {
    console.debug('poller started', props.id);
    startFetchLatest();
    return () => {
      console.debug('poller ended', props.id);
      stopFetchLatest();
    }
  }, [props.url, props.post]);
});

export default function AppPollers(){
  const { pollers } = useLongPollerStore();

  return <React.Fragment>
    {pollers.map(
      (aPollerItem, i) => (<Poller key={i}
        {...aPollerItem} />)
    )}
  </React.Fragment>
};