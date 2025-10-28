// ** React Imports
import useJwt from "@src/auth/jwt/useJwt";
import { useEffect, useState } from "react";

// ** Reactstrap Imports
import { Col, Row } from "reactstrap";

// ** Styles
import "@styles/react/apps/app-users.scss";
import HeaderCard from "./HeaderCard";
import UserData from "./UserData";
import UserInfoCard from "./UserInfoCard";

// ** Placeholder Components (Static Layout) **

const UserView = () => {
  const [active, setActive] = useState("event");
  const toggleTab = (tab) => {
    if (active !== tab) setActive(tab);
  };
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [userDataById, setUserDataById] = useState([]);
  const [loader, setLoader] = useState(false);
  const [UserDataLoader, setUserDataLoader] = useState(true);

  const fetchMembers = async () => {
    //fetch members code
    setLoader(true);
    try {
      const res = await useJwt.GetMember();
      console.log(res);
      const extractUser = res?.data?.content?.result?.map((x) => {
        return {
          label: `${x?.firstName} ${x?.lastName}`,
          value: x?.lazzerId,
          emailId: x?.emailId,
          phoneNumber: `${x?.countryCode} ${x?.phoneNumber}`,
          address: x?.address,
          city: x?.city,
          state: x?.state,
          country: x?.country,
          postalCode: x?.postalCode,
        };
      });

      setMembers(extractUser);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const getUserData = async () => {
    setUserDataLoader(true);
    try {
      setUserDataById([]);
      const res = await useJwt.getUserData(selectedMembers?.value);
      setUserDataById(res?.data?.paymentList);
    } catch (error) {
      console.log(error);
    } finally {
      setUserDataLoader(false);
    }
  };
  useEffect(() => {
    getUserData();
  }, [selectedMembers]);

  return (
    <div className="">
      <HeaderCard members={members} setSelectedMembers={setSelectedMembers} />

      <Row>
        <Col xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <UserInfoCard selectedMembers={selectedMembers} loader={loader} />
        </Col>

        <Col xl="8" lg="7" xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <UserData
            active={active}
            userDataById={userDataById}
            toggleTab={toggleTab}
            UserDataLoader={UserDataLoader}
          />
        </Col>
      </Row>
    </div>
  );
};

export default UserView;
