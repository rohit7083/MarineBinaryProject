import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Star, ShoppingCart, Heart } from 'react-feather'
import { Card, CardBody, CardText, Button, Badge, Row, Col } from 'reactstrap'

const ProductCards = props => {
  const {
    store,
    products,
    dispatch,
    addToCart,
    activeView,
    getProducts,
    getCartItems,
    addToWishlist,
    deleteWishlistItem
  } = props

  const handleCartBtn = (id, val) => {
    if (!val) {
      dispatch(addToCart(id))
    }
    dispatch(getCartItems())
    dispatch(getProducts(store.params))
  }

  const handleWishlistClick = (id, val) => {
    if (val) {
      dispatch(deleteWishlistItem(id))
    } else {
      dispatch(addToWishlist(id))
    }
    dispatch(getProducts(store.params))
  }

  // const renderProducts = () => {
  //   if (products.length) {
  //     return (
  //       <Row className="gy-3">
  //         {products.map(item => {
  //           const CartBtnTag = item.isInCart ? Link : 'button'

  //           return (
  //             <Col lg="4" md="6" sm="12" key={item.name}>
  //               <Card className="ecommerce-card">
  //                 <div className="item-img text-center mx-auto">
  //                   <Link to={`/apps/ecommerce/product-detail/${item.slug}`}>
  //                     <img className="img-fluid card-img-top" src={item.image} alt={item.name} />
  //                   </Link>
  //                 </div>
  //                 <CardBody>
  //                   <div className="item-wrapper">
  //                     <div className="item-rating">
  //                       <ul className="unstyled-list list-inline">
  //                         {new Array(5).fill().map((_, index) => (
  //                           <li key={index} className="ratings-list-item me-25">
                           
  //                           </li>
  //                         ))}
  //                       </ul>
  //                     </div>
  //                     <div className="item-cost">
  //                       <h6 className="item-price">${item.price}</h6>
  //                     </div>
  //                   </div>
  //                   <h6 className="item-name">
  //                     <Link className="text-body" to={`/apps/ecommerce/product-detail/${item.slug}`}>
  //                       {item.name}
  //                     </Link>
  //                     <CardText tag="span" className="item-company">
  //                       By{' '}
  //                       <a className="company-name" href="/" onClick={e => e.preventDefault()}>
  //                         {item.brand}
  //                       </a>
  //                     </CardText>
  //                   </h6>
  //                 </CardBody>
  //                 <div className="item-options text-center">
  //                   <div className="item-wrapper">
  //                     <div className="item-cost">
                       
  //                     </div>
  //                   </div>
  //                   <Button
  //                     className="btn-wishlist"
  //                     color="light"
  //                     onClick={() => handleWishlistClick(item.id, item.isInWishlist)}
  //                   >
  //                     <Heart
  //                       className={classnames('me-50', {
  //                         'text-danger': item.isInWishlist
  //                       })}
  //                       size={14}
  //                     />
  //                     <span>Wishlist</span>
  //                   </Button>
  //                   <Button
  //                     color="primary"
  //                     tag={CartBtnTag}
  //                     className="btn-cart move-cart"
  //                     onClick={() => handleCartBtn(item.id, item.isInCart)}
  //                     {...(item.isInCart ? { to: '/apps/ecommerce/checkout' } : {})}
  //                   >
  //                     <ShoppingCart className="me-50" size={14} />
  //                     <span>{item.isInCart ? 'View In Cart' : 'Add To Cart'}</span>
  //                   </Button>
  //                 </div>
  //               </Card>
  //             </Col>
  //           )
  //         })}
  //       </Row>
  //     )
  //   }
  // }
  const renderProducts = () => {
    if (products.length) {
      return (
        <Row className="gy-3">
          {products.map(item => {
            const CartBtnTag = item.isInCart ? Link : 'button'

            return (
              <Col lg="4" md="6" sm="12" >
                <Card className="ecommerce-card">
                  <div className="item-img text-center mx-auto">
                    {/* <Link to={`/apps/ecommerce/product-detail/${item.slug}`}> */}
                      <img className="img-fluid card-img-top" src={item.image}  />
                    {/* </Link> */}
                  </div>
                  <CardBody>
                    <div className="item-wrapper">
                      <div className="item-rating">
                        <ul className="unstyled-list list-inline">
                          {/* {new Array(5).fill().map((_, index) => ( */}
                            <li className="ratings-list-item me-25">
                           
                            </li>
                          {/* ))} */}
                        </ul>
                      </div>
                      <div className="item-cost">
                        <h6 className="item-price">9856</h6>
                      </div>
                    </div>
                    <h6 className="item-name">
                      {/* <Link className="text-body" to={`/apps/ecommerce/product-detail/${item.slug}`}> */}
                        {/* {item.name} */}
                        name
                      {/* </Link> */}
                      <CardText tag="span" className="item-company">
                        By{' '}
                        <a className="company-name" href="/" onClick={e => e.preventDefault()}>
                          {/* {item.brand} */}
                          brand
                        </a>
                      </CardText>
                    </h6>
                  </CardBody>
                  <div className="item-options text-center">
                    <div className="item-wrapper">
                      <div className="item-cost">
                       
                      </div>
                    </div>
                    <Button
                      className="btn-wishlist"
                      color="light"
                      // onClick={() => handleWishlistClick(item.id, item.isInWishlist)}
                    >
                      {/* <Heart
                        className={classnames('me-50', {
                          'text-danger': item.isInWishlist
                        })}
                        size={14}
                      /> */}
                      <span>Wishlist</span>
                    </Button>
                    <Button
                      color="primary"
                      tag={CartBtnTag}
                      className="btn-cart move-cart"
                      // onClick={() => handleCartBtn(item.id, item.isInCart)}
                      // {...(item.isInCart ? { to: '/apps/ecommerce/checkout' } : {})}
                    >
                      <ShoppingCart className="me-50" size={14} />
                      <span>View In Cart'</span>
                    </Button>
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      )
    }
  }
  return (
    <div
      className={classnames({
        'grid-view': activeView === 'grid',
        'list-view': activeView === 'list'
      })}
    >
      {renderProducts()}
    </div>
  )
}

export default ProductCards
