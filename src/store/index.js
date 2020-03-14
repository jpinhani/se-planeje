import { createStore, combineReducers } from 'redux'

import userReducer from './reducers/userReducer.js'
import cardReducer from './reducers/generalCardReducer.js'
import acountReducer from './reducers/generalAcountReducer.js'
import categoryReducer from '../store/reducers/generalCategoryReducer'
<<<<<<< HEAD

import visionReducer from '../store/reducers/visionReducer'

=======
import visionReducer from '../store/reducers/visionReducer'
>>>>>>> 9bba2183e619c72a72c3614d00cf3c6533a5b0df
import expenseReducer from '../store/reducers/generalExpenseReducer'

const reducers = combineReducers({
  user: userReducer,
  card: cardReducer,
  acount: acountReducer,
  category: categoryReducer,
  vision: visionReducer,
  expense: expenseReducer,
<<<<<<< HEAD
=======

>>>>>>> 9bba2183e619c72a72c3614d00cf3c6533a5b0df
})

export default createStore(reducers)