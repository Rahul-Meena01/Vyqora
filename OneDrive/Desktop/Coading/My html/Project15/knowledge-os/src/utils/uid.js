let counter = 0;

export const uid = () => {
  counter += 1;
  return `n_${Date.now().toString(36)}_${counter.toString(36)}`;
};
