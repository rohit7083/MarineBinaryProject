
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'


const SlipManagementRoutes = lazy(()=>import("../../views/dashboard/slip-management"))
const AddProductCategory= lazy(()=> import('../../views/dashboard/pos/product_management/addproductCategory'))
const DashboardIM = lazy(()=> import('../../views/dashboard/invoice_management/invoice_setting'))
const ManageInvoice =lazy(()=>import('../../views/dashboard/invoice_management/manageInvoice'))
const ProductManagement=lazy(()=>import('../../views/dashboard/pos/product_management'))
const AddProdCategory = lazy(()=>import('../../views/dashboard/pos/product_management/addproductCategory/AddCategory'))
const AddProduct=lazy(()=>import('../../views/dashboard/pos/product_management/ProductAdd'))
const InvoiceAdd = lazy(() => import('../../views/dashboard/invoice_management/invoice/add'))
const InvoiceList = lazy(() => import('../../views/dashboard/invoice_management/invoice/list'))
const InvoiceEdit = lazy(() => import('../../views/dashboard/invoice_management/invoice/edit'))
const InvoicePrint = lazy(() => import('../../views/dashboard/invoice_management/invoice/print'))
const InvoicePreview = lazy(() => import('../../views/dashboard/invoice_management/invoice/preview'))
const AddProductTax = lazy(() => import('../../views/dashboard/pos/product_management/addTaxes'))
 const ManageStocks = lazy(() => import('../../views/dashboard/pos/product_management/StockManage'))
 const AddStocks = lazy(() => import('../../views/dashboard/pos/product_management/AddStocks'))

export default [
 
 
    {
      path: '/marin/slip-management/:uid',
      element: <SlipManagementRoutes />
    },
  
    {
      path: '/marin/slip-management',
      element: <SlipManagementRoutes />
    },

    // {
    //   path: '/dashboard/invoice_management/invoice',
    //   element: <CreateInvoice />
    // }, 
    // {
    //   path: '/dashboard/invoice_management/invoice',
    //   element: <AddActions />
    // }, 
    
    {
      path: '/dashboard/invoice_management/invoice_setting',
      element: <DashboardIM />
    },
    {
      path: '/dashboard/invoice_management/manageInvoice',
      element: <ManageInvoice />
    },

     {
        element: <InvoiceList />,
        path: '/dashboard/invoice_management/invoice/'
      },
      {
        element: <InvoicePreview />,
        path: '/dashboard/invoice_management/invoice/preview/:id'
      },
      // {
      //   element: <InvoicePreview />,
      //   path: '/dashboard/invoice_management/invoice/preview'
      // },
      {
        path: '/dashboard/invoice_management/invoice/preview',
        element: <Navigate to='/dashboard/invoice_management/invoice/preview/4987' />
      },
      {
        element: <InvoiceEdit />,
        path: '/dashboard/invoice_management/invoice/edit/:id'
      },
      {
        path: '/dashboard/invoice_management/invoice/edit',
        element: <Navigate to='/dashboard/invoice_management/invoice/edit/4987' />
      },
      {
        element: <InvoiceAdd />,
        path: '/dashboard/invoice_management/invoice/add'
      },
      {
        path: '/dashboard/invoice_management/invoice/print',
        element: <InvoicePrint />,
        meta: {
          layout: 'blank'
        }
      },
 


      {
        path: '/dashboard/pos/product_management/addProduct',
        element: <AddProduct/>
      },
      {
        element: <InvoiceAdd />,
        path: '/dashboard/invoice_management/invoice/add'
      },
     
 
      {
        element: <AddProductCategory />,
        path: '/dashboard/pos/product_management/addproductCategory'
      },
      {
        element: <AddProductTax />,
        path: '/dashboard/pos/product_management/addtaxes'
      },


      {
        element: <ProductManagement />,
        path: '/dashboard/pos/product_management/'
      },
      
      {
        element: <AddStocks />,
        path: '/dashboard/pos/product_management/AddStocks'
      },
      
      {
        element: <ManageStocks />,
        path: '/dashboard/pos/product_management/manageStocks'
      },
   
  ]