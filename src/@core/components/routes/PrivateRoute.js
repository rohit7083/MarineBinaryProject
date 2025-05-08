// ** React Imports
import { Navigate } from 'react-router-dom'
import { useContext, Suspense, useEffect } from 'react'

// ** Context Imports
import { AbilityContext } from '@src/utility/context/Can'
import LocationModal from '../../layouts/LocationModal';

// ** Spinner Import
import Spinner from '../spinner/Loading-spinner'

import useJwt from "@src/auth/jwt/useJwt";
import toast from 'react-hot-toast';

const PrivateRoute = ({ children, route }) => {
  // ** Hooks & Vars
  const ability = useContext(AbilityContext)
  const user = JSON.parse(localStorage.getItem('userData'))
  const [show, setShow] = useState(false);

  if (route) {
    let action = null
    let resource = null
    let restrictedRoute = false

    if (route.meta) {
      action = route.meta.action
      resource = route.meta.resource
      restrictedRoute = route.meta.restricted
    }
    if (!user) {
      return <Navigate to='/login' />
    }
    if (user && restrictedRoute) {
      return <Navigate to='/' />
    }
    if (user && restrictedRoute && user.role === 'client') {
      return <Navigate to='/access-control' />
    }
    // if (user && !ability.can(action || 'read', resource)) {
    //   return <Navigate to='/misc/not-authorized' replace />
    // }
  }

  // useEffect(()=>{
  //   (async()=>{
  //     try{
  //      await useJwt.getLocation()
  //     }catch(error){
  //       toast.error("Location Not Found")
  //       setShow(true);
  //     }finally{}
  //   })()
  // },[])

  return
  (
  <>
  <Suspense fallback={<Spinner className='content-loader' />}>{children}</Suspense>
   {/* <LocationModal show={show} setShow={setShow}/>  */}
  </>
  )
}

export default PrivateRoute




// import { Navigate } from 'react-router-dom'
// import { useContext, Suspense, useEffect, useState } from 'react'

// import { AbilityContext } from '@src/utility/context/Can'
// import LocationModal from '../../layouts/LocationModal'

// import Spinner from '../spinner/Loading-spinner'
// import useJwt from "@src/auth/jwt/useJwt"
// import toast from 'react-hot-toast'

// const PrivateRoute = ({ children, route }) => {
//   const ability = useContext(AbilityContext)
//   const user = JSON.parse(localStorage.getItem('userData'))
//   const [show, setShow] = useState(false)

//   if (route) {
//     let action = null
//     let resource = null
//     let restrictedRoute = false

//     if (route.meta) {
//       action = route.meta.action
//       resource = route.meta.resource
//       restrictedRoute = route.meta.restricted
//     }

//     if (!user) return <Navigate to='/login' />
//     if (user && restrictedRoute) return <Navigate to='/' />
//     if (user && restrictedRoute && user.role === 'client') return <Navigate to='/access-control' />
//   }

//   useEffect(() => {
//     (async () => {
//       try {
//         await useJwt.getLocation()
//       } catch (error) {
//         toast.error("Location Not Found")
//         setShow(true)
//       }
//     })()
//   }, [])

//   return (
//     <>
//       <Suspense fallback={<Spinner className='content-loader' />}>
//         {children}
//       </Suspense>
//       <LocationModal show={show} setShow={setShow} />
//     </>
//   )
// }

// export default PrivateRoute
