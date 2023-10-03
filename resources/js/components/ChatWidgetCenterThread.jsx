import React, { useRef } from "react";
import Grid from '@mui/material/Grid';
import { Button, Divider, Fab, LinearProgress, List, ListItem, Paper, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CircleIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorCircleIcon from '@mui/icons-material/ErrorOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrayHelper from "../helpers/ArrayHelper";
import uniqid from "uniqid";
import { MomentTooltip } from "./Moment";
import { useParams } from "react-router-dom";
import { useCurrentConversationStore, useLongPollerStore } from "../helpers/StateHelper";

const MessageCardContent = function(props){
  return (
    <MomentTooltip datetime={props.time} format="LLLL ZZ" placement="bottom">
      <Typography>{props.message}</Typography>
    </MomentTooltip>
  )
}

const OtherListItem = function (props) {
  return <ListItem className="messageListItem authorIsThem">
    <AccountCircleIcon
      sx={{
        display: {
          xs: "block",
          md: "none",
        }
      }}
    />
    <Paper>
      <MessageCardContent {...props} />
    </Paper>
  </ListItem>
}

const MeListItem = function (props) {
  return <ListItem className="messageListItem authorIsMe">
    <Paper elevation={10}>
      <MessageCardContent {...props} />
    </Paper>

    <MessageSentStatus {...props} />

  </ListItem>
}

const InfoListItem = function (props) {
  return <ListItem style={{ display: 'flex', justifyContent: 'center' }}>
    <em style={{opacity: .3}}>{props.message}</em>
  </ListItem>
}

const MessageSentStatus = function(props){
  if(props.status === undefined
    || props.status === 'active'
    || props.status === 'inactive')
    return;

  let content;
  if(props.status === "sent")
    content = <CheckCircleIcon className="statusIcon" color="success" />
  else if(props.status === "error")
    content = <ErrorCircleIcon className="statusIcon" color="error" />
  else
    content = <CircleIcon className="statusIcon" color="disabled" />

  return <Typography
    variant="body2" title={props.status}>{content}</Typography>
}

const MessageListItem = function (props){
  let OurComponent;
  if(props.type === "in")
    OurComponent = OtherListItem;
  else if(props.type === 'info')
    OurComponent = InfoListItem;
  else
    OurComponent = MeListItem;

  return <OurComponent {...props} />
}

const getListHeight = () => {
  // return window.innerHeight - 225;
  return window.innerHeight - 235; // this is due to changing title from <span> to <h6>
}

export default function ChatWidgetCenterThread({shouldPlaySound}){
  const messageRef = useRef('');
  const messageListRef = useRef(null);
  const audioRef = useRef(null);

  const addPoller = useLongPollerStore((state) => state.addPoller);
  const removePoller = useLongPollerStore((state) => state.removePoller);

  const { conversationHash } = useParams();

  const messageSamples = [
    // { type: "info", message: "this is a note", time: PAGE_LOAD },
    // { type: "out", message: "What to do?", time: PAGE_LOAD },
    // { type: "in", message: WELCOME_MESSAGE, time: PAGE_LOAD },


    /* test fill-ins */
    // ...Array(20).fill().map((_, index) => ({ type: "out", message: `test ${index + 1}`, time: "-00:00" }))
  ];

  const shouldPlaySoundRef = React.useRef(shouldPlaySound);
  React.useEffect(() => {
    shouldPlaySoundRef.current = shouldPlaySound;
  }, [shouldPlaySound]);

  const [messages,setMessages] = React.useState([]);
  const [clientSideMessageID,setClientSideMessageID] = React.useState(uniqid());
  const [listHeight, setListHeight] = React.useState(getListHeight()); // Initial height calculation
  const [isFormDisabled, setIsFormDisabled] = React.useState(true);
  // const [shouldPlaySound,setShouldPlaySound] = React.useState(false);
  const [messageHistoryLoaded,setMessageHistoryLoaded] = React.useState(false);

  const scrollToBottom = () => {
    // Scroll to the bottom of the list
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }

  React.useEffect(() => {
    scrollToBottom();
  },[messages]);

  React.useEffect(() => {
    if(messageHistoryLoaded){
      // Start the long polling loop
      // startFetchLatest(newMessagesReceivedFromServer);
      setIsFormDisabled(false);
    }else{
      // stopFetchLatest();
      setIsFormDisabled(true);
    }

    return () => {
      // stopFetchLatest();
    };
  }, [messageHistoryLoaded]);

  React.useEffect(() => {
    setMessages(messageSamples); // for testing and development only

    appendToMessages({ type: "info", message: `viewing conversation ${conversationHash}`, time: PAGE_LOAD });

    // Function to handle window resize event
    const handleResize = () => {
      setListHeight(getListHeight()); // Update the list height when window is resized
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // stopFetchLatest();
    };
  }, []);

  React.useEffect(() => {
    setMessages([]); // clear
    appendToMessages({ type: "info", message: `viewing conversation ${conversationHash}`, time: PAGE_LOAD });
    addPoller({
      id: "messageHistory",
      url: "/message/history",
      post: {
        conversation: conversationHash
      },
      onNewUpdates: (newMessages) => {
        processDataIntoMessageHistory(newMessages);
      }
    });
  },[conversationHash]);

  const processDataIntoMessageHistory = (messages) => {
    // console.debug(messages);

    let lastInboundMessage;

    if (ArrayHelper.isNonEmptyArray(messages)) {
      messages.reverse();
      messages.forEach((newMessage) => {
        const formattedMessage = formatMessage(newMessage);
        appendToMessages(formattedMessage);

        if (newMessage.direction === 'in')
          lastInboundMessage = newMessage;
      });
    }

    setMessageHistoryLoaded(true);
  }

  const fetchMessageHistory = async (conversationHash) => {
    setMessageHistoryLoaded(false);
    const { data } = await axios.post('/message/history', {
      conversation: conversationHash
    });

    let lastInboundMessage = null;

    if (ArrayHelper.isNonEmptyArray(data)) {
      appendToMessages({ type: "info", message: `viewing conversation ${conversationHash}`, time: PAGE_LOAD });
      useCurrentConversationStore.setState({lastLoadedMessageID: data[0].id});
      data.reverse();

      data.forEach((newMessage) => {
        const formattedMessage = formatMessage(newMessage);
        appendToMessages(formattedMessage);

        if(newMessage.direction === 'in')
          lastInboundMessage = newMessage;
      });

      // setFetchLatestLastMessageID(data[data.length - 1].id);

      // console.debug(lastInboundMessage);
      if(lastInboundMessage){
        useCurrentConversationStore.setState({
          to: lastInboundMessage.to
          , from: lastInboundMessage.from
          , subject: lastInboundMessage.subject
          , conversationID: lastInboundMessage.conversation_id
        });
      }
    }
    setMessageHistoryLoaded(true);
  }

  const setSendingMessageToSent = (setMessages, theMessage) => {
    // console.debug(theMessage);

    setMessages((prevMessages) => {
      const updatedMessagesCopy = [...prevMessages];
      const messageIndex = updatedMessagesCopy.findIndex(
        (message) => message.clientSideMessageID === theMessage.clientSideMessageID
      );
      if (messageIndex !== -1) {
        // Update the status of the message
        updatedMessagesCopy[messageIndex] = {
          ...theMessage,
          status: 'sent'
        };
      }
      return updatedMessagesCopy;
    });
  }

  const setSendingMessageToError = (setMessages, theMessage) => {
    setMessages((prevMessages) => {
      const updatedMessagesCopy = [...prevMessages];
      const messageIndex = updatedMessagesCopy.findIndex(
        (message) => message.clientSideMessageID === theMessage.clientSideMessageID
      );
      if (messageIndex !== -1) {
        // Update the status of the message
        updatedMessagesCopy[messageIndex] = {
          ...theMessage,
          status: 'error'
        };
      }
      return updatedMessagesCopy;
    });
  }

  const appendToMessages = (newMessageObject) => {
    // console.info('appending', newMessageObject)

    if(ONE_MESSAGE_AT_A_TIME && newMessageObject.type === "out")
      setIsFormDisabled(true);

    setMessages((prevMessages) => {
      // this is to prevent showing the message you already sent in
      // your present chatbox
      const isDuplicate = prevMessages.some((message) => {
        if (
          newMessageObject.meta &&
          typeof newMessageObject.meta === 'object' &&
          newMessageObject.meta.clientSideMessageID !== undefined &&
          message.clientSideMessageID !== undefined
        ) {
          // console.debug(`${message.clientSideMessageID} === ${newMessageObject.meta.clientSideMessageID}`);
          const duplicateResult = message.clientSideMessageID === newMessageObject.meta.clientSideMessageID;

          return duplicateResult;
        }
        return false;
      });

      if (isDuplicate) {
        // Message with duplicate ID already exists, return the current messages array
        return prevMessages;
      }

      // Check if the array length exceeds {WIDGET_MAX_MESSAGES}
      if (prevMessages.length > WIDGET_MAX_MESSAGES) {
        // Calculate the number of excess items
        const numExcessItems = prevMessages.length - WIDGET_MAX_MESSAGES;

        // Remove the specified number of items from the beginning of the array
        prevMessages.splice(0, numExcessItems + 1);
      }

      return [...prevMessages, newMessageObject];
    });
  }

  const formatMessage = (message) => {
    if (typeof message === 'object' && message !== null && 'direction' in message)
      message.type = message.direction;

    if (typeof message === 'object' && message !== null && 'created_at' in message)
      message.time = message.created_at;

    if (typeof message === 'object' && message !== null && 'content' in message)
      message.message = message.content;

    return message;
  }

  const newMessagesReceivedFromServer = (newMessages) => {
    if(ArrayHelper.isNonEmptyArray(newMessages))
    {
      newMessages.forEach((message) => {
        const formattedMessage = formatMessage(message);

        appendToMessages(formattedMessage);
      });

      const lastMessageInList = newMessages[newMessages.length - 1];

      // setFetchLatestLastMessageID(lastMessageInList.id);

      if (lastMessageInList.type === 'in'){
        setIsFormDisabled(false);
        // play our sound
        playAlertSound();
      }

    }
  }

  // React.useEffect(() => {
  //   // console.debug(shouldPlaySound);
  //   playAlertSound();
  // },[shouldPlaySound]);

  const playAlertSound = () => {
    if(shouldPlaySoundRef.current)
      audioRef.current.play();
  }

  const submitMessageToServer = async (newMessage) => {
    newMessage['conversation_id'] = conversationHash;
    newMessage["status"] = "sending";
    newMessage["clientSideMessageID"] = clientSideMessageID;
    newMessage["id"] = clientSideMessageID;

    // reset the clientSideMessageID
    setClientSideMessageID(uniqid());
    appendToMessages(newMessage);

    try{
      const axiosResponse = await axios.post('/message/send', newMessage);

      // change check mark of send message to green
      setSendingMessageToSent(setMessages, { ...newMessage, ...axiosResponse.data });
    }catch(e){
      console.error(e);
      setSendingMessageToError(setMessages, {...newMessage, time: "error"});
    }

    if(!ONE_MESSAGE_AT_A_TIME)
      setIsFormDisabled(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(isFormDisabled)
      return;

    const message = messageRef.current.value;
    if(message.trim() == '')
      return;

    setIsFormDisabled(true);

    submitMessageToServer({
      type: "out",
      message,
      time: "sending..."
    });

    // finally clear the textfield
    messageRef.current.value = '';
  }

  return !messageHistoryLoaded
      ? <LinearProgress />
      : <React.Fragment>
          <List className='messageArea' spacing={2}
            ref={messageListRef}
            sx={{
              height: listHeight,
              overflow: "auto"
            }}
          >
            {messages.map((item, i) => (
              <MessageListItem key={i} {...item} />
            ))}
          </List>

          <Divider />
          <Grid container style={{ padding: '20px' }}
            component="form" onSubmit={handleSubmit}>
            <Grid item xs={11}>
              <audio ref={audioRef}>
                <source src={`${APP_URL}/assets/sounds/ding.mp3`} type="audio/mpeg" />
              </audio>
              <TextField id="outlined-basic-message-text" label="Type Something" fullWidth
                autoComplete="off"
                inputRef={messageRef} />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab disabled={isFormDisabled} color="primary"
                aria-label="add" component={Button} type="submit"><SendIcon /></Fab>
            </Grid>
          </Grid>
        </React.Fragment>

}