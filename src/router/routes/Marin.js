
import { lazy } from 'react'


const SlipManagementRoutes = lazy(()=>import("../../views/dashboard/slip-management"))


export default [
 
 
    {
      path: '/marin/slip-management',
      element: <SlipManagementRoutes />
    },]