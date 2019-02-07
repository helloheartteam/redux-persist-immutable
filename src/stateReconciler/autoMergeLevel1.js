const merge = (state, payload) => {
  const value = state.merge(payload);
  console.log('lvel2 merge',value);
  return value;
};

export default merge;
