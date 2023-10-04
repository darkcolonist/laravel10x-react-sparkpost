/**
 * @date February 06, 2023 4:31 PM
 * solution taken from https://stackoverflow.com/a/71047161/27698
 */

import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function(){
  const navigate = useNavigate();

  const fallbackAndReload = (message, location) => {
    const secondsWaitTillRedirect = 2;
    console.error(`${message} detected, reloading page to '${location}' in ${secondsWaitTillRedirect} second(s).`);

    if (location === undefined){
      setTimeout(() => { window.location.reload() }, secondsWaitTillRedirect*1000);
    }else{
      // setTimeout(() => { navigate(location); }, secondsWaitTillRedirect * 1000);
      setTimeout(() => { window.location.href = location }, secondsWaitTillRedirect * 1000);
    }
  }

  useEffect(()=>{
    /**
     * covers:
     *  - token_mismatch
     *  - expired csrf token
     *  - authentication or not logged in
     */
    axios.interceptors.response.use(
      response => {
        // console.log("found", response.data);
        if (response !== undefined
          && response.data.type !== undefined
          && response.data.type === "token_mismatch") {
          fallbackAndReload("token mismatch detected, reloading page.");
          // console.log("token mismatch detected, reloading page."); //☺old implementations
          // window.location.reload();☺                               // old implementations
          // return Promise.reject("token_mismatch");☺                // old implementations
        }

        return response;
      }
      , error => {
        // expired csrf token
        if (error.response && 419 === error.response.status) {
          fallbackAndReload(error.statusText);
        }

        // not logged in
        if (error.response && 401 === error.response.status) {
          fallbackAndReload(error.statusText, "/logout");
        }
      }
    )
  });
}