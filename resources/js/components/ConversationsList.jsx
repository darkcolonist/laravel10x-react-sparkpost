import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import Moment from "./Moment";

export default function(){
  const [conversationsLoaded,setConversationsLoaded] = React.useState(false);
  const [conversations,setConversations] = React.useState([]);

  React.useEffect(() => {
    async function fetchConversations(){
      const loaded = await axios.post('sparkpost/conversations');
      console.debug(loaded.data);
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
                <ListItemButton title={conversation.from + " & " + conversation.to}>
                  <ListItemAvatar>
                    <Avatar>{conversation.total}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={conversation.subject} secondary={
                    <Stack
                      direction="row"
                      divider={<Divider orientation="vertical" flexItem />}
                      spacing={1}
                    >
                      <Typography variant="span">{conversation.total_in} / {conversation.total_out}</Typography>
                      <Moment format="fromNow">{conversation.created_at}</Moment>
                    </Stack>
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