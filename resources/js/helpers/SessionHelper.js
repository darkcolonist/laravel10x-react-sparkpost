import StringHelper from "./StringHelper";

export default {
  getSessionID: () => {
    if(SESSION_ID)
      return StringHelper.addElipsis(SESSION_ID, 4);
    else
      return "no session";
  }
}