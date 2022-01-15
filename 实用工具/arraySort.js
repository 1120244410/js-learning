export const arraySort = (data, desc) => {
  return function(a, b) {
    const value1 = a[data];
    const value2 = b[data];
    return desc ? value2 - value1 : value1 - value2;
  };
};
