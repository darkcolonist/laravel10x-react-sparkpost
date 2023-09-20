import { blue, blueGrey, green } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const palette = {
  mode: 'dark',
  // mode: 'light',
  tertiary: {
    dark: green[400],
    light: green[900],
    main: green[200],
    color: () => palette.mode === "dark" ? palette.tertiary.dark : palette.tertiary.light
  }
};

export default createTheme({
  palette,
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          '&.sessionContainer': {
            fontFamily: 'monospace',
            color: blueGrey[300],
            fontSize: "80%"
          },
        },
      },
    },

    MuiStack: {
      styleOverrides: {
        root: {
          '&.debugLogList': {
            height: "60vh",
            overflowY: "scroll"
          },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          '&.debugLog': {
            fontFamily: 'monospace',
            color: green[300],
            borderLeft: `5px solid ${green[900]}`,
            paddingLeft: 5
          },
          '&.debugLogTime': {
            borderBottom: `3px solid ${green[900]}`,
            fontFamily: 'monospace',
            color: green[700],
            fontSize: "70%"
          },
          '&.debugLogTitle': {
            color: green[400]
          },
        },
      },

      variants: [
        {
          props: { variant: "time" },
          style: {
            fontSize: ".75rem",
            color: palette.tertiary.color()
          }
        }
      ]
    },

    MuiListItem: {
      styleOverrides:{
        root: {
          '&.messageListItem .MuiPaper-root': {
            padding: "10px",
            maxWidth: "95%"
          },

          '&.authorIsMe .MuiPaper-root': {
            borderBottomLeftRadius: 20
          },
          '&.authorIsThem .MuiPaper-root': {
            // borderTopRightRadius: 15,
            borderBottomRightRadius: 20
          },

          '&.authorIsMe' : {
            justifyContent: "flex-end",
            textAlign: "right",
            '& .statusIcon': {
              fontSize: 15
            },
            '& p.MuiTypography-root': {
              textAlign: "left"
            },
            '& .MuiPaper-root': {
              backgroundColor: palette.mode === "dark" ? blue[900] : blue[300],
              color: palette.mode === "dark" ? '#fff' : '#000'
            }
          },

          '&.authorIsThem' : {
            justifyContent: "flex-start",
            textAlign: "left",
          },


        }
      }
    }
  },
});