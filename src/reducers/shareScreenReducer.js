const initState = {
  share: false,
};
const screenReducer = (state = initState, action) => {
  if (action.type === 'SHARE_SCREEN') {
    return {
      share: action.payload,
    };
  }
  return state;
};
export default screenReducer;
