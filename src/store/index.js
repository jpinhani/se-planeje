import { createStore, combineReducers } from 'redux'

import userReducer from './reducers/userReducer.js'
import cardReducer from './reducers/generalCardReducer.js'
import acountReducer from './reducers/generalAcountReducer.js'
import categoryReducer from '../store/reducers/generalCategoryReducer'
import visionReducer from '../store/reducers/visionReducer'
import expenseReducer from '../store/reducers/generalExpenseReducer'
import revenueReducer from '../store/reducers/generalRevenuesReducer'
import expenseRealReducer from './reducers/generalExpenseRealReducer'
import faturaDetalheReducer from './reducers/generalFaturaDetalheReducer'

const reducers = combineReducers({
  user: userReducer,
  card: cardReducer,
  acount: acountReducer,
  category: categoryReducer,
  vision: visionReducer,
  expense: expenseReducer,
  revenue: revenueReducer,
  expenseReal: expenseRealReducer,
  detalheFatura: faturaDetalheReducer,
})

export default createStore(reducers)