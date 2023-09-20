import React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Paper, Stack } from '@mui/material';
import { green } from '@mui/material/colors';

export default function({
  log
}) {
  return (
    <Stack spacing={0} className='debugLogList'>
      {log.length ? <Typography className='debugLogTitle'>debug log</Typography> : null}
      {log.map((logitem, index) =>
        <Box key={index}>
          <Typography className='debugLogTime' variant='span'>{logitem.timestamp}</Typography>
          {' '}
          <Typography className='debugLog' component='pre'>{logitem.log}</Typography>
        </Box>)}
    </Stack>
  );
}