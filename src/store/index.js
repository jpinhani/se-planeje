import { createStore, combineReducers } from 'redux'

import userReducer from './reducers/userReducer.js'
import cardReducer from './reducers/generalCardReducer.js'
import acountReducer from './reducers/generalAcountReducer.js'
import categoryReducer from '../store/reducers/generalCategoryReducer'
import visionReducer from '../store/reducers/visionReducer'
import expenseReducer from '../store/reducers/generalExpenseReducer'
import revenueReducer from '../store/reducers/generalRevenuesReducer'
import expenseRealReducer from './reducers/generalExpenseRealReducer'
import controlerexpenseRealReducer from './reducers/controlerExpenseRealReducer'
import controlerexpenseMetaReducer from './reducers/controlerExpenseReducer'
import faturaDetalheReducer from './reducers/generalFaturaDetalheReducer'
import faturaReducer from './reducers/generalFaturaReducer'
import siderReducer from './reducers/generalSiderReducer'
import visionControlerReducer from './reducers/controlerVisionReducer'
import visionControlerComboReducer from './reducers/controlerListVisionReducer'

const reducers = combineReducers({
  user: userReducer,
  card: cardReducer,
  acount: acountReducer,
  category: categoryReducer,
  vision: visionReducer,
  visionControler: visionControlerReducer,
  visionControlerCombo: visionControlerComboReducer,
  expense: expenseReducer,
  revenue: revenueReducer,
  expenseReal: expenseRealReducer,
  detalheFatura: faturaDetalheReducer,
  fatura: faturaReducer,
  siderMenu: siderReducer,
  controlerExpenseReal: controlerexpenseRealReducer,
  controlerexpenseMeta: controlerexpenseMetaReducer
})

export default createStore(reducers)