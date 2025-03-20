import React from 'react'
import ProductCards from './ProductCards'
import ProductsSearchbar from './ProductsSearchbar'
import Header from './Header'
function index() {
  return (
    <div>
      <Header/>
      <ProductsSearchbar/>
      <ProductCards/>
    </div>
  )
}

export default index


