// ** Reducers Imports
import calendar from '@src/views/apps/calendar/store'
import chat from '@src/views/apps/chat/store'
import ecommerce from '@src/views/apps/ecommerce/store'
import email from '@src/views/apps/email/store'
import invoice from '@src/views/apps/invoice/store'
import kanban from '@src/views/apps/kanban/store'
import productSlice from '@src/views/apps/pos/store'
import cartSlice from '@src/views/apps/pos/store/cartSlice'
import permissions from '@src/views/apps/roles-permissions/store'
import todo from '@src/views/apps/todo/store'
import users from '@src/views/apps/user/store'
import dataTables from '@src/views/tables/data-tables/store'
import auth from './authentication'
import layout from './layout'
import navbar from './navbar'

const rootReducer = {
  auth,
  todo,
  chat,
  email,
  users,
  kanban,
  navbar,
  layout,
  invoice,
  calendar,
  ecommerce,
  dataTables,
  permissions,
  productSlice,
  cartSlice
}

export default rootReducer
