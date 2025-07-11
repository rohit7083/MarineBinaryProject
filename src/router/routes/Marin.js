import { lazy } from "react";
import { Navigate } from "react-router-dom";
import VertualTerminal from "../../views/dashboard/pos/VertualTerminal";
import ParkingPassListing from "../../views/dashboard/parking_pass/index";
import AddVTypes from "../../views/dashboard/pos/vendorManagement/vendorTypes/AddVTypes";

const SlipManagementRoutes = lazy(() =>
  import("../../views/dashboard/slip-management")
);
const AddProductCategory = lazy(() =>
  import("../../views/dashboard/pos/product_management/addproductCategory")
);
const DashboardIM = lazy(() =>
  import("../../views/dashboard/invoice_management/invoice_setting")
);
const ManageInvoice = lazy(() =>
  import("../../views/dashboard/invoice_management/manageInvoice")
);
const ProductManagement = lazy(() =>
  import("../../views/dashboard/pos/product_management")
);
const AddProdCategory = lazy(() =>
  import(
    "../../views/dashboard/pos/product_management/addproductCategory/AddCategory"
  )
);
const AddProduct = lazy(() =>
  import("../../views/dashboard/pos/product_management/ProductAdd")
);
const InvoiceAdd = lazy(() =>
  import("../../views/dashboard/invoice_management/invoice/add")
);
const InvoiceList = lazy(() =>
  import("../../views/dashboard/invoice_management/invoice/list")
);
const InvoiceEdit = lazy(() =>
  import("../../views/dashboard/invoice_management/invoice/edit")
);
const InvoicePrint = lazy(() =>
  import("../../views/dashboard/invoice_management/invoice/print")
);
const InvoicePreview = lazy(() =>
  import("../../views/dashboard/invoice_management/invoice/preview")
);
const AddProductTax = lazy(() =>
  import("../../views/dashboard/pos/product_management/addTaxes")
);
const ManageStocks = lazy(() =>
  import("../../views/dashboard/pos/product_management/StockManage")
);
const AddStocks = lazy(() =>
  import("../../views/dashboard/pos/product_management/AddStocks")
);
const CustomerManagement = lazy(() =>
  import("../../views/dashboard/pos/customer_management")
);
const PointOfSale = lazy(() =>
  import("../../views/dashboard/pos/point_of_sale/shop")
);
const Ecomm = lazy(() =>
  import("../../views/dashboard/pos/point_of_sale/ecommerce/shop")
);


const VendorManage
= lazy(() =>
  import("../../views/dashboard/pos/vendorManagement")
);

const VendorAdd
= lazy(() =>
  import("../../views/dashboard/pos/vendorManagement/AddVender")
);
const QrPaymentStepTwo = lazy(() =>
  import(
    "../../views/dashboard/Ship/SlipMemberForm/steps-with-validation/QrPaymentStepTwo"
  )
);

const MemberManagement = lazy(() =>
  import(
    "../../views/dashboard/member_management/Add_Member"
  )
);

const MemberManagement_List = lazy(() =>
  import(
    "../../views/dashboard/member_management"
  )
);

const AddCategory = lazy(() =>
  import(
    "../../views/dashboard/pos/product_management/addproductCategory/AddCategory"
  )
);

const CreatePass = lazy(() =>
  import(
    "../../views/dashboard/parking_pass/Park_Pass"
  )
);


const SellPass = lazy(() =>
  import(
    "../../views/dashboard/parking_pass/SellPass"
  )
);


const ViewRoomBooking = lazy(() =>
  import(
    "../../views/dashboard/room_management/list_of_roomBooking/view_bookingrooms/View"
  )
);
const Event_Info=lazy(()=>import("../../views/dashboard/event_management/Event_info"))
const venueLocation=lazy(()=>import("../../views/dashboard/event_management/VenueLocation"))

const Client_info=lazy(()=>import("../../views/dashboard/event_management/Client_info"))
const Event_Type=lazy(()=>import("../../views/dashboard/event_management/event_type"))
const Cretae_Event_Type=lazy(()=>import("../../views/dashboard/event_management/event_type/AddEventTypes"))

const EventIndex=lazy(()=>import("../../views/dashboard/event_management"))
const CreateEvent=lazy(()=>import("../../views/dashboard/event_management/CreateEvent"))

const CreateVenue=lazy(()=>import("../../views/dashboard/event_management/createVenue/CreateVenue"))
const VenueList=lazy(()=>import("../../views/dashboard/event_management/createVenue"))
const PaymentHistory=lazy(()=>import("../../views/dashboard/event_management/PaymentHistory"))
const ClientDetails=lazy(()=>import("../../views/dashboard/event_management/client_Information"))

const ViewClient=lazy(()=>import("../../views/dashboard/event_management/client_Information/ViewClient"))
const Payment=lazy(()=>import("../../views/dashboard/event_management/Payment"))
const Preview=lazy(()=>import("../../views/dashboard/event_management/Preview"))
const GenerateDiscountOtp=lazy(()=>import("../../views/dashboard/event_management/GenerateDiscountOtp"))

const VendorTypeList=lazy(()=>import("../../views/dashboard/pos/vendorManagement/vendorTypes"))

const ManageRoomType=lazy(()=>import("../../views/dashboard/room_management/manage_roomType"))
const AddRoomType=lazy(()=>import("../../views/dashboard/room_management/manage_roomType/AddRoomType"))
const RoomDetails=lazy(()=>import("../../views/dashboard/room_management/manage_room"))
const AddRoomDetails=lazy(()=>import("../../views/dashboard/room_management/manage_room/Add_RoomDetails"))


const RoomPayment=lazy(()=>import("../../views/dashboard/room_management/manage_roomBooking/addNewBooking/payment/RoomPayment"))

const RoomBooking
=lazy(()=>import("../../views/dashboard/room_management/manage_roomBooking/calendar"))


const AddRoomBooking
=lazy(()=>import("../../views/dashboard/room_management/manage_roomBooking/addNewBooking"))

const BookingListing
=lazy(()=>import("../../views/dashboard/room_management/list_of_roomBooking"))

const SearchRoom
=lazy(()=>import("../../views/dashboard/room_management/manage_roomBooking/addNewBooking/SearchRooms"))



const Checkout
=lazy(()=>import("../../views/dashboard/room_management/manage_roomBooking/addNewBooking/Checkout"))

const CheckInDetails
=lazy(()=>import("../../views/dashboard/room_management/manage_roomBooking/addNewBooking/CheckInDetails"))



export default [
  {
    path: "/marin/slip-management/:uid",
    element: <SlipManagementRoutes />,
  },

  {
    path: "/marin/slip-management",
    element: <SlipManagementRoutes />,
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
    path: "/dashboard/invoice_management/invoice_setting",
    element: <DashboardIM />,
  },
  {
    path: "/dashboard/invoice_management/manageInvoice",
    element: <ManageInvoice />,
  },

  {
    element: <InvoiceList />,
    path: "/dashboard/invoice_management/invoice/",
  },
  {
    element: <InvoicePreview />,
    path: "/dashboard/invoice_management/invoice/preview/:id",
  },
  // {
  //   element: <InvoicePreview />,
  //   path: '/dashboard/invoice_management/invoice/preview'
  // },
  {
    path: "/dashboard/invoice_management/invoice/preview",
    element: (
      <Navigate to="/dashboard/invoice_management/invoice/preview/4987" />
    ),
  },
  {
    element: <InvoiceEdit />,
    path: "/dashboard/invoice_management/invoice/edit/:id",
  },
  {
    path: "/dashboard/invoice_management/invoice/edit",
    element: <Navigate to="/dashboard/invoice_management/invoice/edit/4987" />,
  },
  {
    element: <InvoiceAdd />,
    path: "/dashboard/invoice_management/invoice/add",
  },
  {
    path: "/dashboard/invoice_management/invoice/print",
    element: <InvoicePrint />,
    meta: {
      layout: "blank",
    },
  },

  {
    path: "/dashboard/pos/product_management/addProduct",
    element: <AddProduct />,
  },
  {
    element: <InvoiceAdd />,
    path: "/dashboard/invoice_management/invoice/add",
  },

  {
    element: <AddProductCategory />,
    path: "/dashboard/pos/product_management/addproductCategory",
  },
  {
    element: <AddProductTax />,
    path: "/dashboard/pos/product_management/addtaxes",
  },

  {
    element: <ProductManagement />,
    path: "/dashboard/pos/product_management/",
  },

  {
    element: <AddStocks />,
    path: "/dashboard/pos/product_management/AddStocks",
  },

  {
    element: <ManageStocks />,
    path: "/dashboard/pos/product_management/manageStocks",
  },

  {
    element: <CustomerManagement />,
    path: "/dashboard/pos/customer_management",
  },

  {
    element: <PointOfSale />,
    path: "/dashboard/pos/point_of_sale/shop",
  },
  {
    element: <QrPaymentStepTwo />,
    path: "/slip_memberform/qr_paymentsteptwo",
    meta: {
      layout: "blank",
    },
  },

  {
    element: <QrPaymentStepTwo />,
    path: "/slip_memberform/qr_paymentsteptwo/:token",
    meta: { 
      publicRoute: true,
      layout: "blank",
    },
  },


  {
    element: <VertualTerminal />,
    path: "/dashboard/pos/point_of_sale/virtual-terminal",
  },

  {
    element: <VendorManage />,
    path: "/pos/VendorManage",
  },
  {
    element: <VendorAdd />,
    path: "/pos/VendorManage/addVendor",
  },
  

  {
    element: <MemberManagement />,
    path: "/member_management/add-member",
  },
  {
    element: <MemberManagement_List/>,
    path: "/member_management",
  },

  {
    element: <AddCategory/>,
    path: "/pos/product_management/add-category",
  },


   {
    element: <ParkingPassListing/>,
    path: "/parking_pass",
  },

    {
    element: <CreatePass/>,
    path: "/parking_pass/add_pass",
  },
   {
    element: <SellPass/>,
    path: "/parking_pass/sellpass",
  },
   

     {
    element: <Event_Info/>,
    path: "/event_info",
  },
   
    {
    element: <Client_info/>,
    path: "/Client_info",
  },
   {
    element: <Event_Type/>,
    path: "/addEvent_type",
  },

    {
    element: <EventIndex/>,
    path: "/event_index",
  },


   {
    element: <CreateEvent/>,
    path: "/CreateEvent",
  },

   {
    element: <CreateVenue/>,
    path: "/venue",
  },


   {
    element: <VenueList/>,
    path: "/VenueList",
  },

    {
    element: <Cretae_Event_Type/>,
    path: "/eventTypes",
  },
  
  
     {
    element: <venueLocation/>,
    path: "/venueLocation",
  },
  
   {
    element: <PaymentHistory/>,
    path: "/PaymentHistory",
  },
  
     {
    element: <ClientDetails/>,
    path: "/ClientDetails",
  },
  
      {
    element: <ViewClient/>,
    path: "/ViewClient",
  },

     {
    element: <Payment/>,
    path: "/payment",
  },
  
  
     {
    element: <Preview/>,
    path: "/preview",
  },

    {
    element: <GenerateDiscountOtp/>,
    path: "/genrateotp",
  },

  {
    element: <VendorTypeList/>,
    path: "/pos/vendor_typeList",
  },

    {
    element: <AddVTypes/>,
    path: "/pos/vendor_typeList/addVendorType",
  },
      {
    element: <ManageRoomType/>,
    path: "/manage_room_types",
  },
  
   {
    element: <AddRoomType/>,
    path: "/add_room_types",
  },
  

     {
    element: <RoomDetails/>,
    path: "/room_details",
  },
  
   {
    element: <AddRoomDetails/>,
    path: "/room_details/add_room_details",
  },


   {
    element: <RoomBooking/>,
    path: "/manage_roomBooking",
  },

  
   {
    element: <AddRoomBooking/>,
    path: "/addNew_room_booking",
  },
  
   {
    element: <BookingListing/>,
    path: "/bookingListing",
  },

     {
    element: <SearchRoom/>,
    path: "/search-rooms",
  },
    {
    element: <Checkout/>,
    path: "/search-rooms/previewBooking",
  },
     {
    element: <CheckInDetails/>,
    path: "/search-rooms/CheckInDetails",
  },

   {
    element: <RoomPayment/>,
    path: "/search-rooms/previewBooking/roomPayment",
  },

    {
    element: <ViewRoomBooking/>,
    path: "booking_listing/view",
  },

];
