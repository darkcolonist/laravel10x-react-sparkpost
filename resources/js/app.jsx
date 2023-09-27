import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, LinearProgress } from '@mui/material';
import ChatWidget from './widgets/ChatWidget';
import defaultTheme from './themes/defaultTheme';
import { BrowserRouter } from 'react-router-dom';
import Authenticator from './components/Authenticator';
import LoginSection from './components/LoginSection';
import AxiosInterceptor from './components/AxiosInterceptor';

const theme = defaultTheme;

export default function() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AxiosInterceptor />
        <Authenticator
          authorized={<ChatWidget />}
          loading={<LinearProgress />}
          unauthorized={<LoginSection />}
        />
      </ThemeProvider>
    </BrowserRouter>
  );
}