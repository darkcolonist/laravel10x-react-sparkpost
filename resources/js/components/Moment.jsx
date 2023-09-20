import { Tooltip, Typography } from "@mui/material";
import moment from "moment";
import React from "react";

export const FORMAT_FROMNOW = 'fromNow';

export function MomentTooltip({ datetime, format, children, ...props }) {
  const extendedProps = {...props,
    title: moment(datetime).format(format)
  }

  return <Tooltip {...extendedProps}>{children}</Tooltip>
}

export default function Moment({children, format}){
  const [timeDisplay,setTimeDisplay] = React.useState(null);
  const [fullTimeDisplay,setFullTimeDisplay] = React.useState(null);

  React.useEffect(() => {
    const momentInstance = moment(children);

    if(!momentInstance.isValid()){
      setTimeDisplay(children);
      setFullTimeDisplay(children);
      return;
    }

    switch (format) {
      case FORMAT_FROMNOW:
        setTimeDisplay(momentInstance.fromNow());
        break;
      default:
        setTimeDisplay(momentInstance.format(format));
    }
    setFullTimeDisplay(momentInstance.toLocaleString());
  },[children, format]);

  return <Typography variant="span" title={fullTimeDisplay}>
    {timeDisplay}
  </Typography>;
}