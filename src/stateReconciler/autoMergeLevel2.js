
const merge = (state, payload) => {
  const value = state.mergeDeep(payload);
  console.log('level2 merge--------');
  console.log(state);
  console.log(payload);
  console.log(value);
  return value;
};

export default merge;