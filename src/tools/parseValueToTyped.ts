export default (value: string) => {
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else if (/^-?\d+$/.test(value)) {
    return parseInt(value, 10);
  }

  return value;
};
