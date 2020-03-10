import { createStore, combineReducers } from 'redux'

import userReducer from './reducers/userReducer.js'
import cardReducer from './reducers/generalCardReducer.js'
import acountReducer from './reducers/generalAcountReducer.js'
import categoryReducer from '../store/reducers/generalCategoryReducer'
<<<<<<< HEAD
import visionReducer from '../store/reducers/visionReducer'
=======
import expenseReducer from '../store/reducers/generalExpenseReducer'
>>>>>>> 1ff90f71c7b704edc11bae5c9402b28867e3edce

const reducers = combineReducers({
  user: userReducer,
  card: cardReducer,
  acount: acountReducer,
  category: categoryReducer,
<<<<<<< HEAD
  vision: visionReducer
=======
  expense: expenseReducer,
>>>>>>> 1ff90f71c7b704edc11bae5c9402b28867e3edce
})

export default createStore(reducers)