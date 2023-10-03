import React from 'react';
import { useParams } from 'react-router-dom';
import AppPollers from '../pollers/AppPollers';
import { useLongPollerStore } from '../helpers/StateHelper';

export default function() {
  const { conversationHash } = useParams();

  const url = '/api/data'; // Replace with your API endpoint
  const method = 'GET'; // You can change this to 'POST' if needed
  const params = {
    // Any query parameters you want to include
  };

  const addPoller = useLongPollerStore((state) => state.addPoller);
  const removePoller = useLongPollerStore((state) => state.removePoller);

  React.useEffect(() => {
    addPoller({ id: "messageHistory", url: "/message/history", post: { conversation: '4d653e42e95f5de7f9e0f1e8c32ae953' } });
    addPoller({ id: "conversationsList", url: "/sparkpost/conversations" });

    // setTimeout(() => {
    //   removePoller('messageHistory');
    // }, 5000);

    setTimeout(() => {
      removePoller('conversationsList');
    }, 15000);
  },[]);

  return <React.Fragment>
    <AppPollers />
    long polling test for {conversationHash}
  </React.Fragment>
}