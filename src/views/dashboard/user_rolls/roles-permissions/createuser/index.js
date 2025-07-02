import { Fragment } from "react";
import React from "react";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Table from "./Table";
// import RoleCards from './RoleCards'
import Createuser from "./Createuser";

import { useEffect } from "react";
import useJwt from "@src/auth/jwt/useJwt";
import { Card, CardBody } from "reactstrap";
import { Plus } from "react-feather";
const Roles = ({ data }) => {
  // const [allRoleName, setallRoleName] = React.useState([]);
  // const [tableData, setTableData] = React.useState({
  //   count: 0,
  //   results: [],
  // });

  // useEffect(()=>{
  //   setTableData({
  //     count:permisionTableList.content.result.length,
  //     results:permisionTableList.content.result
  //   })
  // },[])
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { data } = await useJwt.getallSubuser();
  //       const { content } = data;
  //       console.log("content", content);

  //       setTableData({ count: content.count, results: content.result });
  //       // setallRoleName("roles",content.result.map((role) => role.roleName));
  //     } catch (error) {
  //        console.error(error);
  //     } finally {
  //     }
  //   })();
  // }, []);
  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between align-items-center flex-wrap ">
            <h3 className="">Add new user </h3>

            <div className="mx-2">
              <Createuser />
            </div>
          </div>
          <hr />
          <div className="app-user-list">
            <Table />
          </div>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default Roles;
