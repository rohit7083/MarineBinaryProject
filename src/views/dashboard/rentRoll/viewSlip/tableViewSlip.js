// ** Table Columns
import Table from "./DynamicTable"

// ** Third Party Components
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap'


const DataTablesBasic = () => {
  return (
    <Card className='overflow-hidden'>
     
      <CardBody>
       
        <Table />
      </CardBody>
    </Card>
  )
}

export default DataTablesBasic
