

import useJwt from "@src/auth/jwt/useJwt";
import { useEffect, useState } from "react";
import Authenticate from "../dash/dashboard_manage/Authenticate";
import ParkBoat from "./ParkBoat";
import Index from "./dashboard_manage";

function index() {
  const [allBoatData, setAllBoatData] = useState([]);
  const [loading, setLoading] = useState(false);
const [checkEmptySlip,setEmptySlip]=useState({ empty: 0, occupied: 0 });
  const getAllBoats = async () => {
    setLoading(true);
    try {
      const res = await useJwt.getslip();
      setAllBoatData(res?.data?.content?.result || []);

       const empty=res?.data?.content?.result.filter(boat=> !boat.isAssigned).length;
       const occupied=res?.data?.content?.result.filter(boat=> boat.isAssigned).length;

       setEmptySlip({empty,occupied});

      

    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBoats();
  }, []);
  return (
    <>
      <Authenticate isAssigne={allBoatData.isAssigned}/>
      <Index count={allBoatData.length} emptySlip={checkEmptySlip.empty} occupied={checkEmptySlip.occupied}/>
      <ParkBoat allBoatData={allBoatData} loading={loading} setLoading={setLoading} setAllBoatData={setAllBoatData} />
    </>
  );
}

export default index;
