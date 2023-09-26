import React from 'react';
import { useAuthStore } from '../helpers/StateHelper';
import { useNavigate } from 'react-router-dom';

export default function({loading, authorized, unauthorized}) {
  const [toRender,setToRender] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    setToRender(loading);

    async function getWhoami(){
      const response = await axios.post('/auth/google/whoami');
      useAuthStore.setState(response.data);

      if(response.data.email === null)
        setToRender(unauthorized);
      else{
        if(window.location.pathname === "/login")
          navigate('/');
        setToRender(authorized);
      }
    }

    getWhoami();
  },[]);

  return toRender;
}