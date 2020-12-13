import { combineReducers } from 'redux';

import messagesReducer from './messages';
import apiReducer from './api';

const rootReducer = combineReducers({
  api: apiReducer,
  messages: messagesReducer,
})

export default rootReducer
