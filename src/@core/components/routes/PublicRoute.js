// ** React Imports
import { Suspense, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '@utils'
import LocationModal from '../../layouts/LocationModal';


import useJwt from "@src/auth/jwt/useJwt";

const PublicRoute = ({ children, route }) => {
    const [show, setShow] = useState(false);

  if (route) {
    const user = getUserData()

    const restrictedRoute = route.meta && route.meta.restricted

    if (user && restrictedRoute) {
      return <Navigate to={getHomeRouteForLoggedInUser(user.role)} />
    }
  }
//   useEffect(()=>{
    
   
//       (async()=>{
//         try{
//          await useJwt.getLocation()
//         }catch(error){
//           toast.error("Location Not Found")
//           setShow(true);
//         }finally{}
//       })()
//     },[])


//     useEffect(()=>{
//       console.log("render")
// console.log(show)

//     },[show])
  
    return (
      <>
        <Suspense fallback={null}>{children}</Suspense>
        {/* <LocationModal show={show} setShow={setShow} /> */}
      </>
    )
  }    

export default PublicRoute
