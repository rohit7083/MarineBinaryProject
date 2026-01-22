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
  const [onclickName, setClick] = useState(null);

  const getAllBoats = async () => {
    setLoading(true);
    try {
      const res = await useJwt.getslip();
      const isOffline = res?.data?.content?.result.filter((offline) => {
        return offline.isOffline === true;
      });
console.log("isOffline",isOffline);

      setIsOfflineCount(isOffline?.length);

      setAllBoatData(res?.data?.content?.result || []);

      const empty = res?.data?.content?.result.filter(
        (boat) => !boat.isAssigned
      );
      const occupied = res?.data?.content?.result.filter(
        (boat) => boat.isAssigned
      ).length;

      console.log("empty", empty);
      

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
        emptySlip={checkEmptySlip?.empty?.length || 0}
        occupied={checkEmptySlip.occupied}
        isOfflineCount={isOfflineCount}
        setClick={setClick}
      />
      <ParkBoat
        allBoatData={allBoatData}
        loading={loading}
        setLoading={setLoading}
        setAllBoatData={setAllBoatData}
        checkEmptySlip={checkEmptySlip}
        onclickName={onclickName}
        
      />
    </>
  );
}

export default index;
