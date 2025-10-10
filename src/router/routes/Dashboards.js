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
// const DashboardRegisteruser= lazy(()=> import('../../views/dashboard/Ship/UserAuth/Registeruser'))
// const DashboardforgetPass= lazy(()=> import('../../views/dashboard/Ship/UserAuth/forgetPass'))
// const DashboardemailOTP= lazy(()=> import('../../views/dashboard/Ship/UserAuth/emailOTP'))

const Dashboarddash=lazy(()=> import('../../views/dashboard/dash'))
const Dashboardroles=lazy(()=> import('../../views/dashboard/user-rolls'))
const DashboardRoleModal=lazy(()=>(import('../../views/dashboard/user_rolls/roles-permissions/roles/Role_modal')))
const Dashboardcreateuser=lazy(()=> import('../../views/dashboard/user_rolls/roles-permissions/createuser'))
const ParkBoat=lazy(()=> import('../../views/dashboard/dash/ParkBoat'))
const DashboardRoutes = [
 
 
  {
    path: '/dashboard/user_rolls/roles-permissions/roles/Role_modal',
    element: <DashboardRoleModal />
  },
  {
    path: '/dashboard/analytics',
    element: <DashboardAnalytics />
  },
  {
    path: '/dashboard/ecommerce',
    element: <DashboardEcommerce />
  },
  
  {
    path: '/dashboard/user_rolls/roles-permissions/roles',
    element: <Dashboardroles />
  },
  {
    path: '/dashboard/user_rolls/roles-permissions/createuser',
    element: <Dashboardcreateuser/>
  },


  {
    path: '/dashboard/slip',
    element: <DashboardShip />
  },
  {
    path: '/dashboard/slipcategory/:uid',
    element: <DashboardSlipCategory />
  },
  {
    path: '/dashboard/slipcategory',
    element: <DashboardSlipCategory />
  },
   {
    path: '/dashboard/slip-details',
    element: <DashboardSlipDetails />
  }, 
  {
    path: '/dashboard/slip-details/:uid',
    element: <DashboardSlipDetails />
  }, 
  {
    path: 'slip_Management/sliplist',
    element: <DashboardSlipList />
  },
  {
    path: '/dashboard/slipdetail_list',
    element: <DashboardSlipDetailList />
  }, {
    path: '/dashboard/slip_memberform',
    element: <DashboardSlipMemberForm />
  }, 
  {
    path: '/dashboard/slip_memberform/:uid',
    element: <DashboardSlipMemberForm />
  }, 

  {
    path: '/dashboard/slipmember_list',
    element: <DashboardSlipMemberList />
  },
  // {
  //   path: '/dashboard/SlipView/:uid',
  //   element: <DashboardSlipView />
  // },
    

    //  {
    //   path: '/dashboard/SlipView',
    //   element: <DashboardSlipView />
    // },
   
    {
      path: '/dashbord',
      element: <Dashboarddash />
    },
   
    {
      path: '/dashbord',
      element: <ParkBoat />
    },
    


 
  
]

export default DashboardRoutes
