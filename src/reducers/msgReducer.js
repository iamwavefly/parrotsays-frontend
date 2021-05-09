const initState = {
  users: [''],
};
const usersReducer = (state = initState, action) => {
  if (action.type === 'UPDATE_USERS') {
    return {
      ...state,
      users: action.payload,
    };
  }
  return state;
};
export default usersReducer;
