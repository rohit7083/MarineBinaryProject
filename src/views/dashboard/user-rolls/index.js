import React, { useEffect } from "react";
import Table from "./Table";
import useJwt from "@src/auth/jwt/useJwt";
import { permisionTableList } from "../user_rolls/roles-permissions/roles/fakedb";

const index = ({ data }) => {
  
  // const [tableData, setTableData] = React.useState({
  //   count: 0,
  //   results: [],
  // });

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { data } = await useJwt.userpermission();
  //       const next = data.content.next;
  //       console.log(next);

  //       const { content } = data;

  //       setTableData({ count: content.count, results: content.result });
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //     }
  //   })();
  // }, []);

  return (
    <div>
      <Table />
    </div>
  );
};

export default index;
