import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import ChatWidgetCenterThread from '../components/ChatWidgetCenterThread';
import ChatWidgetProfileCard from '../components/ChatWidgetProfileCard';
import { blue, red } from '@mui/material/colors';
import SessionHelper from '../helpers/SessionHelper';
// import DateTimeHelper from '../helpers/DateTimeHelper';
import { Chip, Button, Typography } from '@mui/material';
import ChatWidgetFooterActions from '../components/ChatWidgetFooterActions';
// import EnvHelper from '../helpers/EnvHelper';
// import DebugLogContainer from '../components/DebugLogContainer';
import ConversationsList from '../components/ConversationsList';
import { Outlet, Route, Routes } from 'react-router-dom';
import { useCurrentConversationStore } from '../helpers/StateHelper';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ChatWidget() {
  const currentConversation = useCurrentConversationStore();
  const [shouldPlaySound,setShouldPlaySound] = React.useState(false);

  const headerFooter = <React.Fragment>
    <Typography variant='span'>{APP_NAME}</Typography>
    <Typography variant='span'>{' '}</Typography>
    <Chip variant='outlined' className='sessionContainer' size='small' label={`session id ${SessionHelper.getSessionID()}`} />
  </React.Fragment>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>{headerFooter}</Item>
        </Grid>

        <Grid item xs={12}>

          <Grid container spacing={2}>
            <Grid item xs={2} sx={{
              display: {
                xs: "none",
                md: "block"
              }
            }}>
              {currentConversation.conversationID
                ? <ChatWidgetProfileCard name={currentConversation.from} description={"Subject: "+currentConversation.subject} bgcolor={red[500]} />
                : null}
              <Routes>
                <Route path="/conversation?/:conversationHash?" element={<ConversationsList />}/>
              </Routes>
            </Grid>

            <Grid item xs={12} md={8}>
              <Routes>
                <Route path="/" element={<Outlet />}>
                  <Route path="/conversation/:conversationHash" element={<ChatWidgetCenterThread {...{
                      shouldPlaySound
                    }} />}
                  />
                  <Route path="/conversation?" element={<Typography>Please select a conversation to proceed.</Typography>} />
                </Route>
              </Routes>
            </Grid>

            <Grid item xs={2} sx={{
              display: {
                xs: "none",
                md: "block"
              }
            }}>
              {currentConversation.conversationID
                ? <ChatWidgetProfileCard name={currentConversation.to} description="This is you" bgcolor={blue[300]} />
                : null}
            </Grid>
          </Grid>

        </Grid>

        {/* hide footer for now */}
        <Grid item xs={12}>
          <Item>
            <ChatWidgetFooterActions {...{
              shouldPlaySound,
              setShouldPlaySound
            }} />
            <Button
              startIcon={<ExitToAppIcon />}
              component="a"
              href={APP_URL + '/auth/google/logout'}
              size="large"
              color="primary"
            >Logout</Button>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}