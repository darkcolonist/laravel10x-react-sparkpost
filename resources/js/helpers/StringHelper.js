export default {
  addElipsis: (string, numChars = 3) => {
    if (string.length > numChars * 2) {
      var start = string.slice(0, numChars);
      var end = string.slice(-numChars);
      return start + '...' + end;
    }
    return string;
  }
}