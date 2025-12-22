// ** Custom Components
import { AbilityContext } from "@src/utility/context/Can";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// ** Third Party Components
import { Edit2, Trash } from "react-feather";
// ** Reactstrap Imports
import useJwt from "@src/auth/jwt/useJwt";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

const states = [
  "success",
  "danger",
  "warning",
  "info",
  "dark",
  "primary",
  "secondary",
];

const status = {
  1: { title: "Current", color: "light-primary" },
  2: { title: "Professional", color: "light-success" },
  3: { title: "Rejected", color: "light-danger" },
  4: { title: "Resigned", color: "light-warning" },
  5: { title: "Applied", color: "light-info" },
};

// ** Expandable table component
const ExpandableTable = ({ data }) => {
  return (
    <div className="expandable-content p-2">
      <p>
        <span className="fw-bold">City:</span> {data.city}
      </p>
      <p>
        <span className="fw-bold">Experience:</span> {data.experience}
      </p>
      <p className="m-0">
        <span className="fw-bold">Post:</span> {data.post}
      </p>
    </div>
  );
};

// ** Table Server Side Column
export const serverSideColumns = (currentPage, rowsPerPage) => [
  {
    sortable: true,
    name: "Id",
    minWidth: " 50px",
    selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
  },
  //   {
  //     sortable: true,
  //     name: "Status",
  //     minWidth: "50px",
  //     selector: (row) =>{
  //       // {{ }}
  //       const checkStatus=row.isInUse;
  // console.log(row);

  //       return (
  //         <div className="d-flex justify-content-center">
  //           <Badge
  //             color={checkStatus ? "light-success" : "light-danger"}
  //             pill
  //             className="text-capitalize"
  //           >
  //             {checkStatus ? "Active" : "Inactive"}
  //           </Badge>
  //         </div>
  //       )
  //     },
  //   },
  {
    sortable: true,
    name: "Slip Category",
    minWidth: "50px",
    selector: (row) => row.shipTypeName,
  },

  {
    sortable: true,
    name: "Dimensions",
    minWidth: "50px",
    selector: (row) =>
      row.dimensions && row.dimensions.length > 0
        ? row.dimensions.join("   |   ")
        : "N/A",
  },

  {
    name: "Actions",
    sortable: true,
    minWidth: "75px",
    cell: (row) => {
      const [data, setData] = useState([]);

      const MySwal = withReactContent(Swal);
      const ability = useContext(AbilityContext);

      const handleDelete = async (uid) => {
        return MySwal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-danger ms-1",
          },
          buttonsStyling: false,
        }).then(async (result) => {
          if (result.value) {
            try {
              const response = await useJwt.deleteslipCatogory(uid);
              if (response.status === 204) {
                MySwal.fire({
                  icon: "success",
                  title: "Deleted!",
                  text: "Your Record has been deleted.",
                  customClass: {
                    confirmButton: "btn btn-success",
                  },
                });
                // setData((prevData) => {
                //   const newData = prevData.filter((item) => item.uid !== uid);
                //   console.log("Updated Data:", newData);
                //   return newData;
                // });

                window.location.reload();
              }
            } catch (error) {
              console.error("Error deleting item:", error);
              if (error.response && error.response.status === 400) {
                const errorMessage =
                  error?.response?.data?.content || "Item not found.";
                MySwal.fire({
                  icon: "error",
                  title: errorMessage,
                  customClass: {
                    confirmButton: "btn btn-danger",
                  },
                });
              }
            }
          } else if (result.dismiss === MySwal.DismissReason.cancel) {
            MySwal.fire({
              title: "Cancelled",
              text: "Your Record is safe :)",
              icon: "error",
              customClass: {
                confirmButton: "btn btn-success",
              },
            });
          }
        });
      };

      const handle = async () => {
        console.log(row.shipTypeName);
        console.log(row.dimensions);
        console.log("Passing to Link:", row.shipTypeName, row.dimensions);
      };

      return (
        <div className="d-flex">
          {ability.can("update", "slip management") ? (
            <Link
              to={`/dashboard/slipcategory`} // Don't pass UID in the path
              state={{
                shipTypeName: row.shipTypeName,
                dimensions: row.dimensions,
                uid: row.uid,
              }}
            >
              <span
                style={{ margin: "0.5rem", cursor: "pointer" }}
                onClick={() => handle(row)}
              >
                <Edit2 className="font-medium-3 text-body" />
              </span>
            </Link>
          ) : null}
          {ability.can("delete", "slip management") ? (
            <Link>
              <span
                color="danger"
                style={{ margin: "0.5rem", cursor: "pointer" }}
                onClick={() => handleDelete(row.uid)}
              >
                <Trash className="font-medium-3 text-body" />
              </span>
            </Link>
          ) : null}
        </div>
      );
    },
  },
];

export default ExpandableTable;
