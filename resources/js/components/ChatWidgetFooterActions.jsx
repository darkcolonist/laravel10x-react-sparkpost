import * as React from 'react';
import UnmuteIcon from '@mui/icons-material/VolumeUp';
import MuteIcon from '@mui/icons-material/VolumeOff';
import ToggleButton from '@mui/material/ToggleButton';

export default function ({ shouldPlaySound, setShouldPlaySound }) {
  return (
    <ToggleButton
      size='small'
      value="check"
      selected={shouldPlaySound}
      onChange={() => {
        setShouldPlaySound(!shouldPlaySound);
      }}
    >
      {shouldPlaySound ? <UnmuteIcon /> : <MuteIcon color='disabled' />}
    </ToggleButton>
  );
}