import { lazy } from 'react'

const DashboardAnalytics = lazy(() => import('../../views/dashboard/analytics'))
const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))
const DashboardSlipCategory = lazy(()=> import('../../views/dashboard/Ship/SlipCategory'))
const DashboardShip=lazy(()=>import('../../views/dashboard/Ship/SlipCategory'))
const DashboardSlipDetails = lazy(()=> import('../../views/dashboard/Ship/SlipDetails'))

const DashboardSlipList = lazy(()=> import('../../views/dashboard/Ship/SlipList'))

const DashboardRoutes = [
  {
    path: '/dashboard/analytics',
    element: <DashboardAnalytics />
  },
  {
    path: '/dashboard/ecommerce',
    element: <DashboardEcommerce />
  },
  {
    path: '/dashboard/Ship',
    element: <DashboardShip />
  },
  {
    path: '/dashboard/SlipCategory/:uid',
    element: <DashboardSlipCategory />
  },
  {
    path: '/dashboard/SlipCategory',
    element: <DashboardSlipCategory />
  },
   {
    path: '/dashboard/SlipDetails',
    element: <DashboardSlipDetails />
  }, 
  {
    path: '/dashboard/SlipList',
    element: <DashboardSlipList />
  }, 
  
]

export default DashboardRoutes
