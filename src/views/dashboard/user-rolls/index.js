import React, { useEffect } from "react";

// ** Table Components
import Table from "./Table";

// ** Jwt Class
import useJwt from "@src/auth/jwt/useJwt";
import { permisionTableList } from "../user_rolls/roles-permissions/roles/fakedb";
// import Createuser from "../user_rolls/roles-permissions/createuser/Createuser";
const index = ({ data }) => {
  // const [nextPageLink, setNextPageLink] = useState(null);

  // const [allRoleName, setallRoleName] = React.useState([]);
  const [tableData, setTableData] = React.useState({
    count: 0,
    results: [],
  });

  // useEffect(()=>{
  //   setTableData({
  //     count:permisionTableList.content.result.length,
  //     results:permisionTableList.content.result
  //   })
  // },[])
  useEffect(() => {
    (async () => {
      try {
        const { data } = await useJwt.userpermission();
        const next = data.content.next;
        console.log(next);

        const { content } = data;

        setTableData({ count: content.count, results: content.result });
        // setallRoleName("roles",content.result.map((role) => role.roleName));
      } catch (error) {
        console.log(error);
      } finally {
      }
    })();
  }, []);

  return (
    <div>
      {/* <Createuser setallRoleName={setallRoleName} allRoleName={allRoleName}/> */}
      <Table data={tableData} />
    </div>
  );
};

export default index;
