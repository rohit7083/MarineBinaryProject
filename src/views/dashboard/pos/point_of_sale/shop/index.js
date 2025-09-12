import Header from './Header'
import ProductCards from './ProductCards'
import ProductsSearchbar from './ProductsSearchbar'
function index() {
  return (
    <div>
      {/* search bar and add new customer */}
      <Header/>
     <ProductsSearchbar/>
     <ProductCards/> 
    </div>
  )
}

export default index


