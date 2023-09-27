import { Avatar, Chip, Grid, Typography } from "@mui/material";
import React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import SessionHelper from "../helpers/SessionHelper";
import { useAuthStore } from "../helpers/StateHelper";

const UserChip = function(){
  const { email, name, avatar } = useAuthStore();

  if (email) {
    return <Chip
      avatar={<Avatar alt={name} src={avatar} />}
      label={name}
      variant="contained"
    />
  } else {
    return <Chip
      avatar={<Avatar>
        <AccountCircleIcon />
      </Avatar>}
      label="not logged in"
      variant="outlined"
    />
  }
}

export default function() {
  return <Grid container justifyContent="space-between" alignItems="center">
      <Grid item xs={10}>
        <Typography variant='h6'>{APP_NAME}</Typography>
      </Grid>
      <Grid item xs={2} style={{ textAlign: 'right' }}>
        <UserChip />
        {/* <Chip variant='outlined' className='sessionContainer' size='small' label={`session id ${SessionHelper.getSessionID()}`} /> */}
      </Grid>
    </Grid>
}