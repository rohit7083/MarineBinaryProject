import useJwt from "@src/auth/jwt/useJwt";
import { useEffect, useState } from "react";
import Authenticate from "../dash/dashboard_manage/Authenticate";
import ParkBoat from "./ParkBoat";
import Index from "./dashboard_manage";

function index() {
  const [allBoatData, setAllBoatData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [waitingCount, setWaitingCount] = useState(0);
  const [checkEmptySlip, setEmptySlip] = useState({ empty: 0, occupied: 0 });
  const [isOfflineCount, setIsOfflineCount] = useState(0);

  const getAllBoats = async () => {
    setLoading(true);
    try {
      const res = await useJwt.getslip();
      const isOffline = res?.data?.content?.result.filter(
        (offline)=>{
          return offline.isOffline === true
        })

        setIsOfflineCount(isOffline?.length);
        
      setAllBoatData(res?.data?.content?.result || []);

      const empty = res?.data?.content?.result.filter(
        (boat) => !boat.isAssigned
      ).length;
      const occupied = res?.data?.content?.result.filter(
        (boat) => boat.isAssigned
      ).length;

      setEmptySlip({ empty, occupied });

      const getres = await useJwt.getAllWaiting();
      const WaitingCount = getres?.data?.content?.count || 0;
      setWaitingCount(WaitingCount);
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
      <Authenticate isAssigne={allBoatData.isAssigned} />
      <Index
        waitingCount={waitingCount}
        count={allBoatData.length}
        emptySlip={checkEmptySlip.empty}
        occupied={checkEmptySlip.occupied}
        isOfflineCount={isOfflineCount}
      />
      <ParkBoat
        allBoatData={allBoatData}
        loading={loading}
        setLoading={setLoading}
        setAllBoatData={setAllBoatData}
      />
    </>
  );
}

export default index;
