import React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, LinearProgress } from '@mui/material';
import defaultTheme from './themes/defaultTheme';
import { BrowserRouter } from 'react-router-dom';
import Authenticator from './components/Authenticator';
import AxiosInterceptor from './components/AxiosInterceptor';

const AuthenticatedLayout = React.lazy(() => import('./layouts/AuthenticatedLayout'));
const LoginSection = React.lazy(() => import('./components/LoginSection'));

const theme = defaultTheme;

export default function() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AxiosInterceptor />
        <Authenticator
          authorized={<AuthenticatedLayout />}
          loading={<LinearProgress />}
          unauthorized={<LoginSection />}
        />
      </ThemeProvider>
    </BrowserRouter>
  );
}