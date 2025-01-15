// ** Router imports
import { lazy } from 'react'

// ** Router imports
import { useRoutes, Navigate } from 'react-router-dom'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'

// ** Hooks Imports
import { useLayout } from '@hooks/useLayout'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '../utility/Utils'

// ** GetRoutes
import { getRoutes } from './routes'

// ** Components
const Error = lazy(() => import('../views/pages/misc/Error'))
// const Login = lazy(() => import('../views/pages/authentication/Login'))
const Login= lazy(() => import('../views/pages/authentication/slip/Login'))
const NotAuthorized = lazy(() => import('../views/pages/misc/NotAuthorized'))
const Email_Reset=lazy(()=>import('../views/pages/authentication/slip/Email_Reset'))
const EmailOTP=lazy(()=>import('../views/pages/authentication/slip/EmailOTP'))
const Mobile_OTP=lazy(()=>import('../views/pages/authentication/slip/Mobile_OTP'))
const Forget_password=lazy(()=>import('../views/pages/authentication/slip/Forget_password'))
const Router = () => {
  
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)
  const getHomeRoute = () => {
    const user = getUserData()
    if (user) {
      return getHomeRouteForLoggedInUser(user.role)
    } else {
      return '/Login'
    }
  }

  const routes = useRoutes([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    {
      path: '/Login',
      element: <BlankLayout />,
      children: [{ path: '/Login', element: <Login /> }]
    },
    {
      path: '/Email_Reset',
      element: <BlankLayout />,
      children: [{ path: '/Email_Reset', element: <Email_Reset /> }]
    },
    {
      path: '/Mobile_OTP',
      element: <BlankLayout />,
      children: [{ path: '/Mobile_OTP', element: <Mobile_OTP /> }]
    },
    {
      path: '/EmailOTP',
      element: <BlankLayout />,
      children: [{ path: '/EmailOTP', element: <EmailOTP /> }]
    },
   
    {
      path: '/auth/not-auth',
      element: <BlankLayout />,
      children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
    },
    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Error /> }]
    },
    ...allRoutes
  ])

  return routes
}

export default Router
