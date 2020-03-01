import { createStore, combineReducers } from 'redux'

import userReducer from './reducers/userReducer.js'
import cardReducer from './reducers/generalCardReducer.js'
import acountReducer from './reducers/generalAcountReducer.js'

const reducers = combineReducers({
  user: userReducer,
  card: cardReducer,
  acount: acountReducer
})

export default createStore(reducers)