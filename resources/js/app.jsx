import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, LinearProgress } from '@mui/material';
import defaultTheme from './themes/defaultTheme';
import { BrowserRouter } from 'react-router-dom';
import Authenticator from './components/Authenticator';
import LoginSection from './components/LoginSection';
import AxiosInterceptor from './components/AxiosInterceptor';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';

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