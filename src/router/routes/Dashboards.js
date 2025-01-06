import { lazy } from 'react'

const DashboardAnalytics = lazy(() => import('../../views/dashboard/analytics'))
const DashboardEcommerce = lazy(() => import('../../views/dashboard/ecommerce'))
const DashboardSlipCategory = lazy(()=> import('../../views/dashboard/Ship/SlipCategory'))
const DashboardShip=lazy(()=>import('../../views/dashboard/Ship/SlipCategory'))
const DashboardSlipDetails = lazy(()=> import('../../views/dashboard/Ship/SlipDetails'))

const DashboardSlipList = lazy(()=> import('../../views/dashboard/Ship/SlipList'))
const DashboardSlipDetailList = lazy(()=> import('../../views/dashboard/Ship/SlipDetailList'))
const DashboardSlipMemberForm = lazy(()=> import('../../views/dashboard/Ship/SlipMemberForm'))
const DashboardSlipMemberList = lazy(()=> import('../../views/dashboard/Ship/SlipMemberList'))
// const DashboardSlipLogin = lazy(()=> import('../../views/dashboard/Ship/UserAuth/SlipLogin'))
// const DashboardRegisteruser= lazy(()=> import('../../views/dashboard/Ship/UserAuth/Registeruser'))
// const DashboardforgetPass= lazy(()=> import('../../views/dashboard/Ship/UserAuth/forgetPass'))
// const DashboardemailOTP= lazy(()=> import('../../views/dashboard/Ship/UserAuth/emailOTP'))
// const DashboardemailForReset= lazy(()=> import('../../views/dashboard/Ship/UserAuth/emailForReset'))
const DashboardSlipView=lazy(()=> import('../../views/dashboard/Ship/SlipDetails/SlipView'))
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
    path: '/dashboard/SlipDetails/:uid',
    element: <DashboardSlipDetails />
  }, 
  {
    path: '/dashboard/SlipList',
    element: <DashboardSlipList />
  },
  {
    path: '/dashboard/SlipDetailList',
    element: <DashboardSlipDetailList />
  }, {
    path: '/dashboard/SlipMemberForm',
    element: <DashboardSlipMemberForm />
  }, 

  {
    path: '/dashboard/SlipMemberList',
    element: <DashboardSlipMemberList />
  },
  {
    path: '/dashboard/SlipView',
    element: <DashboardSlipView />
  },
  // {
  //   path: '/dashboard/UserAuth/SlipLogin',
  //   element: <DashboardSlipLogin />
  // },
  // {
  //   path: '/dashboard/UserAuth/Registeruser',
  //   element: <DashboardRegisteruser />
  // },
  // {
  //   path: '/dashboard/UserAuth/forgetPass',
  //   element: <DashboardforgetPass />
  // },
  // {
  //     path: '/dashboard/UserAuth/emailOTP',
  //     element: <DashboardemailOTP />
  //   },


   

     {
      path: '/dashboard/SlipView',
      element: <DashboardSlipView />
    },


  // {
  //   path: '/dashboard/UI',
  //   element: <DashboardUI />
  // }, 
  
]

export default DashboardRoutes
