import { createStore, combineReducers } from 'redux'

import userReducer from './reducers/userReducer.js'
import cardReducer from './reducers/generalCardReducer.js'

const reducers = combineReducers({
  user: userReducer,
  card: cardReducer
})

export default createStore(reducers)