const cutoff = (text, length=10) => {
  if (text.length > length) {
    return text.substr(0, length - 1) + '...';
  }
  return text;
};

export default cutoff;
