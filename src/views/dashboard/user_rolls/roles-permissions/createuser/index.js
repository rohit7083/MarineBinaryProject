import { Fragment } from "react";
import React from "react";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Table from "./Table";
// import RoleCards from './RoleCards'
import { useEffect } from "react";
import useJwt from "@src/auth/jwt/useJwt";
import { Card, CardBody } from "reactstrap";
const Roles = ({ data }) => {
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
        const { data } = await useJwt.getallSubuser();
        const { content } = data;
        console.log(data);

        setTableData({ count: content.count, results: content.result });
        // setallRoleName("roles",content.result.map((role) => role.roleName));
      } catch (error) {
        console.log(error);
      } finally {
      }
    })();
  }, []);
  return (
    <Fragment>
      <Card>
        <CardBody>

       
      <h3 className="mt-50">Add new user </h3>
      <p className="mb-2">
        Find all of your company’s administrator accounts and their associate
        roles.
      </p>
      <hr/>
      <div className="app-user-list">
        <Table data={tableData} />
      </div>
      </CardBody>
      </Card>
    </Fragment>
  );
};

export default Roles;
