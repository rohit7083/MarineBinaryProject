
import { lazy } from 'react'


const SlipManagementRoutes = lazy(()=>import("../../views/dashboard/slip-management"))
const CreateInvoice= lazy(()=> import('../../views/dashboard/invoice_management/Invoice/index'))
const AddActions= lazy(()=> import('../../views/dashboard/invoice_management/Invoice/AddActions'))
const DashboardIM = lazy(()=> import('../../views/dashboard/invoice_management/invoice_setting'))
const ManageInvoice =lazy(()=>import('../../views/dashboard/invoice_management/manageInvoice'))


export default [
 
 
    {
      path: '/marin/slip-management/:uid',
      element: <SlipManagementRoutes />
    },
  
    {
      path: '/marin/slip-management',
      element: <SlipManagementRoutes />
    },

    {
      path: '/dashboard/invoice_management/invoice',
      element: <CreateInvoice />
    }, 
    {
      path: '/dashboard/invoice_management/invoice',
      element: <AddActions />
    }, 
    
    {
      path: '/dashboard/invoice_management/invoice_setting',
      element: <DashboardIM />
    },
    {
      path: '/dashboard/invoice_management/manageInvoice',
      element: <ManageInvoice />
    },
 
  ]