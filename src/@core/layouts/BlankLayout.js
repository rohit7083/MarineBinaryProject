// ** React Imports
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Third Party Components
import classnames from 'classnames'

import useJwt from "@src/auth/jwt/useJwt";
import LocationModal from './LocationModal';
import toast from 'react-hot-toast';

const BlankLayout = () => {
  // ** States
  const [show, setShow] = useState(false);

  const [isMounted, setIsMounted] = useState(false)

  // ** Hooks
  const { skin } = useSkin()

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(()=>{

    
  },[])


  useEffect(()=>{
 
    (async()=>{
  
      try{
      
       await useJwt.getLocation()
      }catch(error){
        toast.error("Location Not Found")
        setShow(true);

      }finally{}
    })()
  },[])

  if (!isMounted) {
    return null
  }

  // console.log(isMounted)

  
 

  return (
    <div
      className={classnames('blank-page', {
        'dark-layout': skin === 'dark'
      })}
    >
      <div className='app-content content'>
        <div className='content-wrapper'>
          <div className='content-body'>
            <Outlet />
            <LocationModal show={show} setShow={setShow}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlankLayout
