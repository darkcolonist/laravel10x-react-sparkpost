import React from 'react';
import { useParams } from 'react-router-dom';
import AppPollers from '../pollers/AppPollers';
import { useLongPollerStore } from '../helpers/StateHelper';

const MessageList = ({ messages }) => {

  if(messages.length === 0) return <p>{'no messages to show'}</p>;

  return messages.map((message, index) =>
    <p key={index}>[{message.id}] {message.content}</p>
  )
}

export default function() {
  const { conversationHash } = useParams();

  const url = '/api/data'; // Replace with your API endpoint
  const method = 'GET'; // You can change this to 'POST' if needed
  const params = {
    // Any query parameters you want to include
  };

  const [currentConversation, setCurrentConversation] = React.useState('873abc1504f4284604773fc6b9ead56f');
  const [currentMessages,setCurrentMessages] = React.useState([]);

  React.useEffect(() => {
    if(currentConversation === null) return;

    updatePoller('messageHistory', {
      post: {
        conversation: currentConversation
      }
    });

    console.debug('TEST', 'updated current conversation to', currentConversation);
    setCurrentMessages([]); // empty the messages
  },[currentConversation]);

  const addPoller = useLongPollerStore((state) => state.addPoller);
  const removePoller = useLongPollerStore((state) => state.removePoller);
  const updatePoller = useLongPollerStore((state) => state.updatePoller);

  React.useEffect(() => {
    addPoller({ id: "conversationsList", url: "/sparkpost/conversations" });
    addPoller({
      id: "messageHistory", url: "/message/history", post: {
        conversation: currentConversation
      }
      , onNewUpdates: (updates) => setCurrentMessages(updates)});

    // setTimeout(() => {
    //   setCurrentConversation('873abc1504f4284604773fc6b9ead56f');
    // }, 5000);

    setTimeout(() => {
      setCurrentConversation('4d653e42e95f5de7f9e0f1e8c32ae953');
    }, 20000);

    setTimeout(() => {
      removePoller('messageHistory');
    }, 21500);

    setTimeout(() => {
      setCurrentConversation('873abc1504f4284604773fc6b9ead56f');
    }, 25000);

    setTimeout(() => {
      removePoller('conversationsList');
    }, 15000);
  },[]);

  return <React.Fragment>
    <AppPollers />
    {currentConversation
      ? `long polling test for ${currentConversation}`
      : 'waiting for conversation'}

    <MessageList messages={currentMessages} />
  </React.Fragment>
}