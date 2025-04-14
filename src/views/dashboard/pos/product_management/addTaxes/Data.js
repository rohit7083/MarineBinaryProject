// ** Custom Components
import Avatar from '@components/avatar'
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// ** Third Party Components
import { Link } from "react-router-dom";

import axios from 'axios'
import { useEffect, useState } from 'react'
import { MoreVertical, Edit, FileText, Archive, Trash, Eye, Edit2 } from 'react-feather'
import useJwt from "@src/auth/jwt/useJwt";

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

// ** Vars
const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary']

const status = {
  1: { title: 'Current', color: 'light-primary' },
  2: { title: 'Professional', color: 'light-success' },
  3: { title: 'Rejected', color: 'light-danger' },
  4: { title: 'Resigned', color: 'light-warning' },
  5: { title: 'Applied', color: 'light-info' }
}

export let data



// ** Table Zero Config Column
export const basicColumns = [
  {
    name: 'ID',
    sortable: true,
    maxWidth: '100px',
    selector: row => row.id
  },
  {
    name: 'Name',
    sortable: true,
    minWidth: '225px',
    selector: row => row.full_name
  },
  {
    name: 'Email',
    sortable: true,
    minWidth: '310px',
    selector: row => row.email
  },
  {
    name: 'Position',
    sortable: true,
    minWidth: '250px',
    selector: row => row.post
  },
  {
    name: 'Age',
    sortable: true,
    minWidth: '100px',
    selector: row => row.age
  },
  {
    name: 'Salary',
    sortable: true,
    minWidth: '175px',
    selector: row => row.salary
  }
]
// ** Table ReOrder Column
export const reOrderColumns = [
  {
    name: 'ID',
    reorder: true,
    sortable: true,
    maxWidth: '100px',
    selector: row => row.id
  },
  {
    name: 'Name',
    reorder: true,
    sortable: true,
    minWidth: '225px',
    selector: row => row.full_name
  },
  {
    name: 'Email',
    reorder: true,
    sortable: true,
    minWidth: '310px',
    selector: row => row.email
  },
  {
    name: 'Position',
    reorder: true,
    sortable: true,
    minWidth: '250px',
    selector: row => row.post
  },
  {
    name: 'Age',
    reorder: true,
    sortable: true,
    minWidth: '100px',
    selector: row => row.age
  },
  {
    name: 'Salary',
    reorder: true,
    sortable: true,
    minWidth: '175px',
    selector: row => row.salary
  }
]

// ** Expandable table component
const ExpandableTable = ({ data }) => {
  return (
    <div className='expandable-content p-2'>
      <p>
        <span className='fw-bold'>City:</span> {data.city}
      </p>
      <p>
        <span className='fw-bold'>Experience:</span> {data.experience}
      </p>
      <p className='m-0'>
        <span className='fw-bold'>Post:</span> {data.post}
      </p>
    </div>
  )
}

// ** Table Common Column
// export const columns = [
//   {
//     name: 'Name',
//     minWidth: '250px',
//     sortable: row => row.full_name,
//     cell: row => (
//       <div className='d-flex align-items-center'>
//         {row.avatar === '' ? (
//           <Avatar color={`light-${states[row.status]}`} content={row.full_name} initials />
//         ) : (
//           <Avatar img={row.avatar} />
//         )}
//         <div className='user-info text-truncate ms-1'>
//           <span className='d-block fw-bold text-truncate'>{row.full_name}</span>
//           <small>{row.post}</small>
//         </div>
//       </div>
//     )
//   },
//   {
//     name: 'Email',
//     sortable: true,
//     minWidth: '250px',
//     selector: row => row.email
//   },
//   {
//     name: 'Date',
//     sortable: true,
//     minWidth: '150px',
//     selector: row => row.start_date
//   },

//   {
//     name: 'Salary',
//     sortable: true,
//     minWidth: '150px',
//     selector: row => row.salary
//   },
//   {
//     name: 'Age',
//     sortable: true,
//     minWidth: '100px',
//     selector: row => row.age
//   },
//   {
//     name: 'Status',
//     minWidth: '150px',
//     sortable: row => row.status.title,
//     cell: row => {
//       return (
//         <Badge color={status[row.status].color} pill>
//           {status[row.status].title}
//         </Badge>
//       )
//     }
//   },
//   {
//     name: 'Actions',
//     allowOverflow: true,
//     cell: () => {
//       return (
//         <div className='d-flex'>
//           <UncontrolledDropdown>
//             <DropdownToggle className='pe-1' tag='span'>
//               <MoreVertical size={15} />
//             </DropdownToggle>
//             <DropdownMenu end>
//               <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
//                 <FileText size={15} />
//                 <span className='align-middle ms-50'>Details</span>
//               </DropdownItem>
//               <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
//                 <Archive size={15} />
//                 <span className='align-middle ms-50'>Archive</span>
//               </DropdownItem>
//               <DropdownItem tag='a' href='/' className='w-100' onClick={e => e.preventDefault()}>
//                 <Trash size={15} />
//                 <span className='align-middle ms-50'>Delete</span>
//               </DropdownItem>
//             </DropdownMenu>
//           </UncontrolledDropdown>
//           <Edit size={15} />
//         </div>
//       )
//     }
//   }
// ]

// ** Table Intl Column
export const multiLingColumns = [
  {
    name: 'Name',
    sortable: true,
    minWidth: '200px',
    selector: row => row.full_name
  },
  {
    name: 'Position',
    sortable: true,
    minWidth: '250px',
    selector: row => row.post
  },
  {
    name: 'Email',
    sortable: true,
    minWidth: '250px',
    selector: row => row.email
  },
  {
    name: 'Date',
    sortable: true,
    minWidth: '150px',
    selector: row => row.start_date
  },

  {
    name: 'Salary',
    sortable: true,
    minWidth: '150px',
    selector: row => row.salary
  },
  {
    name: 'Status',
    sortable: true,
    minWidth: '150px',
    selector: row => row.status,
    cell: row => {
      return (
        <Badge color={status[row.status].color} pill>
          {status[row.status].title}
        </Badge>
      )
    }
  },
  {
    name: 'Actions',
    allowOverflow: true,
    cell: () => {
      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <DropdownToggle className='pe-1' tag='span'>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>
                <FileText size={15} />
                <span className='align-middle ms-50'>Details</span>
              </DropdownItem>
              <DropdownItem>
                <Archive size={15} />
                <span className='align-middle ms-50'>Archive</span>
              </DropdownItem>
              <DropdownItem>
                <Trash size={15} />
                <span className='align-middle ms-50'>Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <Edit size={15} />
        </div>
      )
    }
  }
]

// ** Table Server Side Column
export const serverSideColumns = [
  {
    sortable: true,
    name: 'Tax Name',
    minWidth: '225px',
    selector: row => row.taxName
  },
  {
    sortable: true,
    name: 'Tax Type',
    minWidth: '250px',
    selector: row => row.taxType
  },
  {
    sortable: true,
    name: 'Tax Value',
    minWidth: '250px',
    selector: row => row.taxValue
  },
 
 
   {
     name: "Actions",
     sortable: true,
     minWidth: "150px",
     cell: (row) => {
      
 
       const MySwal = withReactContent(Swal);
 
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
         }).then(async function (result) {
           if (result.value) {
             try {
               // Call delete API
               const response = await useJwt.deleteTax(uid);
               if (response.status === 204) {
                 setData((prevData) =>{
                   const newData=prevData.filter((item) => item.uid !== uid)
                   return newData;
                 })
               ;
                 // Show success message
                 MySwal.fire({
                   icon: "success",
                   title: "Deleted!",
                   text: "Your file has been deleted.",
                   customClass: {
                     confirmButton: "btn btn-success",
                   },
                 });
                
               }
             } catch (error) {
               console.error("Error deleting item:", error);
             }
           } else if (result.dismiss === MySwal.DismissReason.cancel) {

            MySwal.fire({
               title: "Cancelled",
               text: "Your imaginary file is safe :)",
               icon: "error",
               customClass: {
                 confirmButton: "btn btn-success",
               },
             });
           }
         });
       };
 
       return (
         <div className="d-flex">
        

           <Link
             style={{ margin: "0.5rem" }}
            //  to={`/pos/VendorManage/`}
            // onClick={}
             state={{
              venderData:row,
              uid:row.uid}}
           >
             <span>
               <Edit2 className="font-medium-3 text-body" />
             </span>
           </Link>
 
           <Link style={{ margin: "0.5rem" }}>
             {" "}
             <span
               color="danger"
               style={{ cursor: "pointer", color: "red" }}
               onClick={() => handleDelete(row.uid)}
             >
               <Trash className="font-medium-3 text-body" />
             </span>
           </Link>
         </div>
       );
     },
   },
]

// ** Table Adv Search Column
export const advSearchColumns = [
  {
    name: 'Name',
    sortable: true,
    minWidth: '200px',
    selector: row => row.full_name
  },
  {
    name: 'Email',
    sortable: true,
    minWidth: '250px',
    selector: row => row.email
  },
  {
    name: 'Post',
    sortable: true,
    minWidth: '250px',
    selector: row => row.post
  },
  {
    name: 'City',
    sortable: true,
    minWidth: '150px',
    selector: row => row.city
  },
  {
    name: 'Date',
    sortable: true,
    minWidth: '150px',
    selector: row => row.start_date
  },

  {
    name: 'Salary',
    sortable: true,
    minWidth: '100px',
    selector: row => row.salary
  }
]

export default ExpandableTable
