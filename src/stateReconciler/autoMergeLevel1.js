const merge = (state, payload) => {
  const value = state.merge(payload);
  console.log('level1 merge',value);
  return value;
};

export default merge;
