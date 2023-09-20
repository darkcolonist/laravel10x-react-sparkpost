import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import ChatWidget from './widgets/ChatWidget';
import defaultTheme from './themes/defaultTheme';

const theme = defaultTheme;

export default function() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatWidget />
    </ThemeProvider>
  );
}