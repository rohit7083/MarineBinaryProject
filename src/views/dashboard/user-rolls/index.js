import Table from "./Table";

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
  //        (next);

  //       const { content } = data;

  //       setTableData({ count: content.count, results: content.result });
  //     } catch (error) {
  //        console.error(error);
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
