
const merge = (state, payload) => {
  const value = state.mergeDeep(payload);
  console.log('level2 merge',state, payload,value);
  return value;
};

export default merge;