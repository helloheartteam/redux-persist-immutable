
const merge = (state, payload) => {
  const value = state.mergeDeep(payload);
  console.log('level2 merge',value);
  return value;
};

export default merge;