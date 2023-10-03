import React from "react";
import { useLongPollerStore } from "../helpers/StateHelper";

function Poller(props){
  let fetchLatestEnabled = false;
  let lastID = null;
  let cancelAxiosSource;

  const {  } = props;

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
      if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].id !== undefined) {
        return response.data[0].id;
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

      if(props.post)
        postParams = {...postParams, ...props.post};

      const response = await axios.post(props.url, postParams, {
        cancelToken: cancelAxiosSource.token,
      });

      lastID = parseLastIDFromResponse(response);

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
  },[props]);
}

export default function AppPollers(){
  const { pollers } = useLongPollerStore();

  // const getPoller = useLongPollerStore((state) => state.getPoller);

  // React.useEffect(() => {
  //   console.debug('pollers changed', pollers)
  // },[pollers]);

  // React.useEffect(() => {
  //   console.debug('messageHistory poller updated', getPoller("messageHistory"))
  // },[getPoller("messageHistory")]);

  return <React.Fragment>
    {pollers.map(
      (aPollerItem, i) => (<Poller key={i} {...aPollerItem} />)
    )}
  </React.Fragment>
};