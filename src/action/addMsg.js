export const addMsg = (payload) => {
  return {
    type: 'ADD_MSG',
    payload,
  };
};
export const addStream = (payload) => {
  return {
    type: 'ADD_STREAM',
    payload,
  };
};
