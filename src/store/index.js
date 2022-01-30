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
import faturaPagaReducer from './reducers/generalFaturaPagaReducer'
import siderReducer from './reducers/generalSiderReducer'
import visionControlerReducer from './reducers/controlerVisionReducer'
import visionControlerComboReducer from './reducers/controlerListVisionReducer'
import revenueRealReducer from './reducers/generalRevenuesRealReducer'
import transferenciaReducer from './reducers/generalTransferenciaReducer'
import homeReducer from './reducers/generalHomeReducer'
import viewinformationReducer from './reducers/visionReducer'

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
  faturaPaga: faturaPagaReducer,
  siderMenu: siderReducer,
  controlerExpenseReal: controlerexpenseRealReducer,
  controlerexpenseMeta: controlerexpenseMetaReducer,
  revenueReal: revenueRealReducer,
  transferencia: transferenciaReducer,
  viewInformation: viewinformationReducer,
  home: homeReducer
})

export default createStore(reducers)