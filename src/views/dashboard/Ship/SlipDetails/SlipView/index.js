// // ** Reactstrap Imports
// import { Card, CardHeader, Progress } from 'reactstrap'

// // ** Third Party Components
// import { ChevronDown, Edit2 } from 'react-feather'
// import DataTable from 'react-data-table-component'

// // ** Custom Components
// import Avatar from '@components/avatar'

// // ** Label Images
// import xdLabel from '@src/assets/images/icons/brands/xd-label.png'
// import vueLabel from '@src/assets/images/icons/brands/vue-label.png'
// import htmlLabel from '@src/assets/images/icons/brands/html-label.png'
// import reactLabel from '@src/assets/images/icons/brands/react-label.png'
// import sketchLabel from '@src/assets/images/icons/brands/sketch-label.png'

// // ** Styles
// import '@styles/react/libs/tables/react-dataTable-component.scss'

// const projectsArr = [
//   {
//     totalTasks: 'Yours Slip',
//     title: 'Slip Name',
//   },
//   {
//     totalTasks: 'Uncovered',
//     title: 'Category',
//   },
//   {
//     totalTasks: '1350000',
//     title: 'Market Annual Price*',
//   },
// ]

// export const columns = [
//   {
//     sortable: true,
//     minWidth: '300px',
//     name: 'Fields',
//     selector: (row) => row.title,
//     cell: (row) => {
//       return (
//         <div className="d-flex justify-content-left align-items-center">
//           <div className="d-flex flex-column">
//             <span className="text-truncate fw-bolder">{row.title}</span>
//             <small className="text-muted">{row.subtitle}</small>
//           </div>
//         </div>
//       )
//     },
//   },
//   {
//     name: 'Details',
//     selector: (row) => row.totalTasks,
//   },
// ]

// const UserProjectsList = () => {
//   return (
//     <Card>
//       <CardHeader tag="h4" className="d-flex justify-content-between align-items-center">
//         <span>Slip Details View</span>
//         <Edit2 size={20} style={{ cursor: 'pointer' }} onClick={() => alert('Edit clicked!')} />
//       </CardHeader>
//       <div className="react-dataTable user-view-account-projects">
//         <DataTable
//           noHeader
//           responsive
//           columns={columns}
//           data={projectsArr}
//           className="react-dataTable"
//           sortIcon={<ChevronDown size={10} />}
//         />
//       </div>
//     </Card>
//   )
// }

// export default UserProjectsList







import { useState } from 'react';
import { Card, CardHeader } from 'reactstrap';  // Adjust imports as needed
import { Edit2, ChevronDown } from 'react-feather';  // Correct named imports
import DataTable from 'react-data-table-component';  // Ensure you have this imported
import SlipDetails from '../../SlipDetails/index';  // Ensure SlipDetails is imported

const UserProjectsList = () => {
  const [edit, setEdit] = useState(false);

  const handleEdit = () => {
    alert("edit clicked");
    setEdit(true);
  };

  // Define the columns
  const columns = [
    {
      name: 'Project Name',
      selector: row => row.projectName,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
    {
      name: 'Start Date',
      selector: row => row.startDate,
      sortable: true,
    },
    // Add more columns as needed
  ];

  // Define the projects data
  const projectsArr = [
    {
      projectName: 'Project A',
      status: 'Completed',
      startDate: '2024-01-01',
    },
    {
      projectName: 'Project B',
      status: 'In Progress',
      startDate: '2024-02-01',
    },
    // Add more projects as needed
  ];

  return (
    <Card>
      <CardHeader tag="h4" className="d-flex justify-content-between align-items-center">
        <span>Slip Details View</span>
        <Edit2 size={20} style={{ cursor: 'pointer' }} onClick={handleEdit} />
      </CardHeader>
      <div className="react-dataTable user-view-account-projects">
        {edit ? 
          <SlipDetails /> : 
          <DataTable
            noHeader
            responsive
            columns={columns}  // Ensure columns is defined
            data={projectsArr}  // Ensure projectsArr is defined
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
          />
        }
      </div>
    </Card>
  );
};

export default UserProjectsList;








// u have to add in u r code 
// <Route path="/dashboard/slip-details/:uid" element={<UserProjectsList />} />



// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Card, CardHeader } from "reactstrap";
// import DataTable from "react-data-table-component";
// import { ChevronDown } from "react-feather";

// const UserProjectsList = () => {
//   const { uid } = useParams(); // Get UID from the route
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Fetch slip details on component load
//   useEffect(() => {
//     const fetchSlipDetails = async () => {
//       try {
//         const response = await useJwt.getslipDetail(uid); // Pass UID to the API
//         setData(response.data); // Update state with the fetched data
//       } catch (error) {
//         console.error("Error fetching slip details:", error);
//       } finally {
//         setLoading(false); // Stop the loading indicator
//       }
//     };

//     fetchSlipDetails();
//   }, [uid]);

//   if (loading) {
//     return <div>Loading...</div>; // Show loading indicator while fetching
//   }

//   if (!data) {
//     return <div>No data found for this slip.</div>; // Handle case when no data is found
//   }

//   // Columns for DataTable
//   const columns = [
//     {
//       name: "Field",
//       selector: (row) => row.field,
//     },
//     {
//       name: "Value",
//       selector: (row) => row.value,
//     },
//   ];

//   // Convert API data into a format suitable for DataTable
//   const tableData = Object.keys(data).map((key) => ({
//     field: key,
//     value: data[key],
//   }));

//   return (
//     <Card>
//       <CardHeader tag="h4">Slip Details View</CardHeader>
//       <div className="react-dataTable user-view-account-projects">
//         <DataTable
//           noHeader
//           responsive
//           columns={columns}
//           data={tableData} // Render the fetched data
//           className="react-dataTable"
//           sortIcon={<ChevronDown size={10} />}
//         />
//       </div>
//     </Card>
//   );
// };

// export default UserProjectsList;
