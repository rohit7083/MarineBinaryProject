import react from '@src/assets/images/icons/react.svg'
import vuejs from '@src/assets/images/icons/vuejs.svg'
import angular from '@src/assets/images/icons/angular.svg'
import bootstrap from '@src/assets/images/icons/bootstrap.svg'

// const table1Data = [
//   {
//     projectIcon: angular,
//     projectName: 'Angular Project',
//     client: 'Peter Charles'
//   },
//   {
//     projectIcon: react,
//     projectName: 'React Project',
//     client: 'Ronald Frest'
//   },
//   {
//     projectIcon: bootstrap,
//     projectName: 'Bootstrap Project',
//     client: 'Jerry Milton'
//   },
//   {
//     projectIcon: vuejs,
//     projectName: 'Vuejs Project',
//     client: 'Jack Obes'
//   }
// ]

const table2Data = [
  {
    projectIcon: vuejs,
    projectName: 'Vuejs Project',
    client: 'Jack Obes'
  },
  {
    projectIcon: bootstrap,
    projectName: 'Bootstrap Project',
    client: 'Jerry Milton'
  }
]

const renderTableRows = (data) =>
  data.map((row, index) => (
    <tr key={index}>
      <td>
        <img className='me-75' src={row.projectIcon} alt={row.projectName} height='20' width='20' />
        <span className='align-middle fw-bold'>{row.projectName}</span>
      </td>
      <td>{row.client}</td>
    </tr>
  ))

const TableSplit = () => {
  return (
    <div className='d-flex'>
      {/* First Table */}
      {/* <table className='table table-bordered' style={{ width: '50%' }}>
        <thead>
          <tr>
            <th>Project</th>
            <th>Client</th>
          </tr>
        </thead>
        <tbody>{renderTableRows(table1Data)}</tbody>
      </table> */}
      {/* Second Table */}
      <table className='table table-bordered ms-2' style={{ width: '50%' }}>
        <thead>
          <tr>
            <th>Project</th>
            <th>Client</th>
          </tr>
        </thead>
        <tbody>{renderTableRows(table2Data)}</tbody>
      </table>
    </div>
  )
}

export default TableSplit
