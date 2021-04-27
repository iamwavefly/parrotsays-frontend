const initState = {
  msg: '',
};
const rootReducer = (state = initState, action) => {
  if (action.type === 'ADD_MSG') {
    return {
      newMsg: action.payload,
    };
  }
  return state;
};
export default rootReducer;
