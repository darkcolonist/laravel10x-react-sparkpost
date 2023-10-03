import { Avatar
  , Divider
  , List
  , ListItem
  , ListItemAvatar
  , ListItemButton
  , ListItemText
  , Paper
  , Typography } from "@mui/material";
import React from "react";
import Moment from "./Moment";
import StringHelper from "../helpers/StringHelper";
import { useNavigate, useParams } from "react-router-dom";
import AxiosPoller from "../pollers/AxiosPoller";
import { useLongPollerStore } from "../helpers/StateHelper";

export default function(){
  const [conversationsLoaded,setConversationsLoaded] = React.useState(false);
  const [conversations,setConversations] = React.useState([]);

  const addPoller = useLongPollerStore((state) => state.addPoller);
  const removePoller = useLongPollerStore((state) => state.removePoller);

  const { conversationHash } = useParams();
  const navigate = useNavigate();
  const handleConversationClick = to => {
    navigate(to);
  }

  const newConversationsFound = (updatedConversations) => {
    if (!updatedConversations) return;

    updatedConversations.map((conversationItem, i) => {
      conversationItem.url = `/conversation/${conversationItem.conversation_id}`;
    });

    setConversations(updatedConversations);
    setConversationsLoaded(true);
  }

  React.useEffect(() => {
    addPoller({
      id: "conversationsList",
      url: "/sparkpost/conversations",
      // order: "asc",
      lastIDKey: "last_id",
      onNewUpdates: (newConversations) => newConversationsFound(newConversations)
    });

    return () => {
      removePoller('conversationsList');
    }
    // setPoller(<AxiosPoller
    //   pollerParams={{
    //     source:"/sparkpost/conversations?polling"
    //     , callback:(loadedConversations) => {
    //       if(!loadedConversations)
    //         return;

    //       loadedConversations.map((conversationItem, i) => {
    //         conversationItem.url = `/conversation/${conversationItem.conversation_id}`;
    //       });

    //       setConversations(loadedConversations);
    //       setConversationsLoaded(true);
    //     }
    //     , postParameterName: 'conversations'
    //   }}
    // />);
  },[]);

  return <React.Fragment>
    {conversationsLoaded ? (
      conversations.length ? (
        <React.Fragment>
          <Divider />
          <Paper>
            <List>
              <ListItem>Recent Conversations</ListItem>
              {conversations.map((conversation, conversationIndex) => (
                <ListItem key={conversationIndex} disablePadding>
                  <ListItemButton title={conversation.latest_message.from
                    + " & " + conversation.latest_message.to
                    + ": " + conversation.latest_message.subject}
                    selected={conversationHash === conversation.conversation_id}
                    onClick={() => handleConversationClick(conversation.url)}>
                    <ListItemAvatar>
                      <Avatar>{conversation.total}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={StringHelper.addElipsis(conversation.latest_message.subject, 7)}
                      secondary={
                        <React.Fragment>
                          <Typography variant="code">↓ {conversation.total_in} ↑ {conversation.total_out}</Typography>
                          {' - '}
                          <Moment format="fromNow">{conversation.latest_message.created_at}</Moment>
                        </React.Fragment>
                      } />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </React.Fragment>
      ) : (
        'no conversations'
      )
    ) : (
      'loading...'
    )}
  </React.Fragment>;
}