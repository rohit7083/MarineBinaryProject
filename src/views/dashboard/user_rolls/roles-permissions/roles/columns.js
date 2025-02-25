// // ** React Imports
// import { Link } from 'react-router-dom'

// // ** Third Party Components
// import classnames from 'classnames'

// // ** Reactstrap Imports
// import { Badge } from 'reactstrap'

// // ** Vars
// const colors = {
//   support: 'light-info',
//   user: 'light-success',
//   manager: 'light-warning',
//   administrator: 'light-primary',
//   'restricted-user': 'light-danger'
// }

// export const columns = [
//   {
//     name: 'Id',
//     sortable: true,
//     minWidth: '50px',
//     cell: ({ id }) => id,
//     selector: row => row.id
//   }, {
//     name: 'Role Name',
//     sortable: true,
//     minWidth: '250px',
//     cell: ({ roleName }) => roleName,
//     selector: row => row.roleName
//   },
//   // {
//   //   sortable: true,
//   //   minWidth: '250px',
//   //   name: 'Role Permissions',
//   //   cell: ({ permissionIds }) => {
//   //     if (permissionIds) {
//   //       return permissionIds.map((permissionIds, index) => {
//   //         const isLastBadge = permissionIds[permissionIds.length - 1] === index
//   //         return (
//   //           <Link key={`${permissionIds}-${index}`} to='' className={classnames({ 'me-50': !isLastBadge })}>
//   //             <Badge pill color={colors[permissionIds]} className='text-capitalize'>
//   //               {permissionIds.replace('-', ' ')}
//   //             </Badge>
//   //           </Link>
//   //         )
//   //       })
//   //     } else {
//   //       return null
//   //     }
//   //   }
//   // },
//   // {
//   //   sortable: true,
//   //   minWidth: '350px',
//   //   name: 'Created Date',
//   //   selector: row => row.createdDate,
//   //   cell: ({ createdDate }) => createdDate,
//   //   sortFunction: (rowA, rowB) => {
//   //     return new Date(rowB.createdDate) - new Date(rowA.createdDate)
//   //   }
//   // }
// ]
