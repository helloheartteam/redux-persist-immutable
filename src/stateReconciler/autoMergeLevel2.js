
const merge = (state, payload) => {
  return state.mergeDeep(payload);
};

export default merge;