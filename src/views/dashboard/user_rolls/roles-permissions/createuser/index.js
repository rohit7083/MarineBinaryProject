// ** React Imports
import { Fragment } from 'react'

import Table from './Table'
// import RoleCards from './RoleCards'

const Roles = () => {
  return (  
    <Fragment>
      {/* <h3>Roles & permissions</h3>
      <p className='mb-2'>
        A role provides access to predefined menus and features depending on the assigned role to an administrator that
        can have access to what he needs.
      </p>
      <RoleCards /> */}
      <h3 className='mt-50'>Add new user </h3>
      <p className='mb-2'>Find all of your company’s administrator accounts and their associate roles.</p>
      <div className='app-user-list'>
        <Table />
      </div>
    </Fragment>
  )
}

export default Roles
