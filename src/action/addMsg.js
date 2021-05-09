export const updateUsers = (payload) => {
  return {
    type: 'UPDATE_USERS',
    payload,
  };
};
export const addStream = (payload) => {
  return {
    type: 'ADD_STREAM',
    payload,
  };
};
export const shareScreen = (payload) => {
  return {
    type: 'SHARE_SCREEN',
    payload,
  };
};
