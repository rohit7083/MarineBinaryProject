// ** React Imports
import { Suspense, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '@utils'


import useJwt from "@src/auth/jwt/useJwt";

const PublicRoute = ({ children, route }) => {
  if (route) {
    const user = getUserData()

    const restrictedRoute = route.meta && route.meta.restricted

    if (user && restrictedRoute) {
      return <Navigate to={getHomeRouteForLoggedInUser(user.role)} />
    }
  }
  useEffect(()=>{
      (async()=>{
        try{
         await useJwt.getLocation()
        }catch(error){
          toast.error("Location Not Found")
        }finally{}
      })()
    },[])
  

  return <Suspense fallback={null}>{children}</Suspense>
}

export default PublicRoute
