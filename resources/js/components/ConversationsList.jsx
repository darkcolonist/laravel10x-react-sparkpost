import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import Moment from "./Moment";

export default function(){
  const [conversationsLoaded,setConversationsLoaded] = React.useState(false);
  const [conversations,setConversations] = React.useState([]);

  React.useEffect(() => {
    async function fetchConversations(){
      const loaded = await axios.post('sparkpost/conversations');
      // console.debug(loaded.data);
      setConversations(loaded.data);
      setConversationsLoaded(true);
    }

    fetchConversations();
  },[]);

  return conversationsLoaded ? (
    conversations.length ? (
      <React.Fragment>
        <Divider />
        <Paper>
          <List>
            <ListItem>Recent Conversations</ListItem>
            {conversations.map((conversation, conversationIndex) => (
              <ListItem key={conversationIndex} disablePadding>
                <ListItemButton title={conversation.latest_message.from + " & " + conversation.latest_message.to + ": " + conversation.latest_message.content}>
                  <ListItemAvatar>
                    <Avatar>{conversation.total}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={conversation.latest_message.subject} secondary={
                    <React.Fragment>
                      <Typography variant="span">{conversation.total_in} / {conversation.total_out}</Typography>
                      {" "}
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
  );
}