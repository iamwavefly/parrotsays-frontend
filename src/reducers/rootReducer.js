import screenShare from './shareScreenReducer';
import users from './msgReducer';
import { combineReducers } from 'redux';

export default combineReducers({
  users,
  screenShare,
});
