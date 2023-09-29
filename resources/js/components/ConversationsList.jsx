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

export default function(){
  const [conversationsLoaded,setConversationsLoaded] = React.useState(false);
  const [conversations,setConversations] = React.useState([]);
  const [poller,setPoller] = React.useState(null);

  const { conversationHash } = useParams();
  const navigate = useNavigate();
  const handleConversationClick = to => {
    navigate(to);
  }

  React.useEffect(() => {
    setPoller(<AxiosPoller
      pollerParams={{
        source:"/sparkpost/conversations?polling#kew"
        , callback:(loadedConversations) => {
          if(!loadedConversations)
            return;

          loadedConversations.map((conversationItem, i) => {
            conversationItem.url = `/conversation/${conversationItem.conversation_id}`;
          });

          setConversations(loadedConversations);
          setConversationsLoaded(true);
          // console.debug('data received from poller', data);
        }
        , postParameterName: 'conversations'
      }}
    />);

    // async function fetchConversations(){
    //   const loaded = await axios.post('/sparkpost/conversations');

    //   loaded.data.map((conversationItem, i) => {
    //     conversationItem.url = `/conversation/${conversationItem.conversation_id}`;
    //   });

    //   setConversations(loaded.data);
    //   setConversationsLoaded(true);
    // }

    // fetchConversations();
  },[]);

  return <React.Fragment>
    {poller}
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