const merge = (state, payload) => {
  const value = state.merge(payload);
  console.log('level1 merge',state, payload,value);
  return value;
};

export default merge;
