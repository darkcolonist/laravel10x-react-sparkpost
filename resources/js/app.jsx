import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import ChatWidget from './widgets/ChatWidget';
import defaultTheme from './themes/defaultTheme';
import { BrowserRouter } from 'react-router-dom';

const theme = defaultTheme;

export default function() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ChatWidget />
      </ThemeProvider>
    </BrowserRouter>
  );
}