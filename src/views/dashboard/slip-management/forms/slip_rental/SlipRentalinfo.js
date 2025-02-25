// ** React Imports
import { useState } from 'react'

// ** Table Columns and Data
import { data, reOrderColumns } from './Data'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Button, Card, CardHeader, CardTitle, Row, Col, Input, Label } from 'reactstrap'

const DataTablesReOrder = () => {
  // ** States
  const [currentPage, setCurrentPage] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState(data)

  // ** Function to handle filter
  const handleFilter = (e) => {
    const value = e.target.value
    setSearchValue(value)

    if (value.length) {
      const updatedData = data.filter(item => {
        const searchStr = value.toLowerCase()
        return (
          item.full_name.toLowerCase().includes(searchStr) ||
          item.post.toLowerCase().includes(searchStr) ||
          item.email.toLowerCase().includes(searchStr) ||
          item.age.toLowerCase().includes(searchStr) ||
          item.salary.toLowerCase().includes(searchStr) ||
          item.start_date.toLowerCase().includes(searchStr)
        )
      })
      setFilteredData(updatedData)
    } else {
      setFilteredData(data)
    }
  }

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setCurrentPage(page.selected)
  }

  // ** Custom Pagination Component
  const CustomPagination = () => (
    <ReactPaginate
      nextLabel='>'
      previousLabel='<'
      breakLabel='...'
      pageRangeDisplayed={2}
      forcePage={currentPage}
      pageCount={Math.ceil(filteredData.length / 7) || 1}
      onPageChange={handlePagination}
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
    />
  )

  return (
    <Card className='overflow-hidden'>
<CardHeader className="d-flex justify-content-between align-items-center">
  <CardTitle tag="h4">Slip Rental</CardTitle>
  
  <div className="d-flex align-items-center gap-2">
  <div className="d-flex align-items-center">
      <Label className='me-1 mb-0' htmlFor='search-input'>
        Search
      </Label>
      <Input
        className='dataTable-filter'
        type='text'
        bsSize='sm'
        id='search-input'
        value={searchValue}
        onChange={handleFilter}
        placeholder='Search...'
        style={{ minWidth: '250px' }} // Adjust width as needed
      />
    </div>
    <Button color='relief-primary'>Send Rental Invoice</Button>
    <Button color='relief-primary'>Take Slip Payment</Button>
    
   
  </div>
</CardHeader>

      <div className='react-dataTable'>
        <DataTable
          noHeader
          columns={reOrderColumns}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          pagination
          paginationComponent={CustomPagination}
          paginationDefaultPage={currentPage + 1}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          data={filteredData}
        />
      </div>
    </Card>
  )
}

export default DataTablesReOrder
