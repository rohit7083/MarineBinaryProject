import { lazy } from 'react'

const DashboardAnalytics = lazy(() => import('../../views/dashboard/analytics'))
const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))
const DashboardSlipCategory = lazy(()=> import('../../views/dashboard/Ship/SlipCategory'))
const DashboardShip=lazy(()=>import('../../views/dashboard/Ship/SlipCategory'))
const DashboardSlipDetails = lazy(()=> import('../../views/dashboard/Ship/SlipDetails'))
const DashboardSlipLogin = lazy(()=> import('../../views/dashboard/Ship/SlipLogin'))
const DashboardRoutes = [
  {
    path: '/dashboard/analytics',
    element: <DashboardAnalytics />
  },
  {
    path: '/dashboard/ecommerce',
    element: <DashboardEcommerce />
  },{
    path: '/dashboard/Ship',
    element: <DashboardShip />
  },
  {
    path: '/dashboard/SlipCategory',
    element: <DashboardSlipCategory />
  }, {
    path: '/dashboard/SlipDetails',
    element: <DashboardSlipDetails />
  }, 
  {
    path: '/dashboard/SlipLogin',
    element: <DashboardSlipLogin />
  }
]

export default DashboardRoutes
