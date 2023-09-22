export default {
  addElipsis: (string, numChars = 3) => {
    if (string.length > numChars * 2) {
      var start = string.slice(0, numChars);
      var end = string.slice(-numChars);
      return start + '...' + end;
    }
    return string;
  }

 , truncateString: (str, maxLength = 10) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...';
  } else {
    return str;
  }
}
}