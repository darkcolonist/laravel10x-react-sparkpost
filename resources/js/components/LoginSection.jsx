import { Alert, Box, Button, Stack } from "@mui/material";
import React from "react";

import GoogleIcon from '@mui/icons-material/Google';

import { useNavigate, useSearchParams } from "react-router-dom";
// import { useAuthStore } from "../helpers/StateHelper";

export default function(props){
  // const { loggedIn } = useAuthStore();
  const [ searchParams ] = useSearchParams()
  let navigate = useNavigate();
  let errorMessage = null;

  if (searchParams.get('noaccess')) {
    errorMessage = <Alert severity="error">{searchParams.get('noaccess')} has no access to this system.</Alert>
  }

  React.useEffect(() => {
    // if(loggedIn){
    //   return navigate('/');
    // }

    // if(appAuth.email !== null){
    //   useAuthStore.setState({
    //     loggedIn: true,
    //     user: appAuth
    //   });
    //   return navigate('/');
    // }
  },[]);

  return <React.Fragment>
    <Box
      sx={{
        '& > :not(style)': { m: 1, width: '80ch' },
      }}
      noValidate
    >
      {errorMessage}
      <Stack spacing={2}
        justifyContent="flex-start"
        alignItems="flex-start">
        <Button
          startIcon={<GoogleIcon />}
          size="large"
          variant="contained"
          onClick={()=>{
            window.location = `${APP_URL}/auth/google`;
        }}>
          Sign in with Google
        </Button>
      </Stack>
    </Box>
  </React.Fragment>;
}