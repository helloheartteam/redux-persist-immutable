const merge = (state, payload) => {
  const value = state.merge(payload);
  console.log('level1 merge--------');
  console.log(state);
  console.log(payload);
  console.log(value);
  return value;
};

export default merge;
