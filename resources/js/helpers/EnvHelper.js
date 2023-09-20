const helper = {
  isLocalMode: () => {
    return APP_ENV === "local";
  },

  isDebugMode: () => {
    return APP_DEBUG === "1";
  }
};

export default helper;