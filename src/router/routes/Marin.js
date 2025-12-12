import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ParkingPassListing from "../../views/dashboard/parking_pass/index";
import AddVTypes from "../../views/dashboard/pos/vendorManagement/vendorTypes/AddVTypes";
import VertualTerminal from "../../views/dashboard/pos/VertualTerminal";
import VirtualTerminal from "../../views/dashboard/pos/virtualTerminal/index";
import EventPaymentList from "../../views/dashboard/qrCode/eventPaymentList/index";
import QrList from "../../views/dashboard/qrCode/qrList/index";
import QrPaymentFrom from "../../views/dashboard/qrCode/qrList/QrPaymentForm";
import InverSlip from "../../views/dashboard/rentRoll/inverseSlip/index";
import ViewSlip from "../../views/dashboard/rentRoll/viewSlip/index";
import SwitchSlipPaymentForm from "../../views/dashboard/slip-management/forms/SwitchSlipPaymentForm";

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
  import("../../views/dashboard/pos/product_management/addProduct/ProductAdd")
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

const VendorManage = lazy(() =>
  import("../../views/dashboard/pos/vendorManagement")
);

const VendorAdd = lazy(() =>
  import("../../views/dashboard/pos/vendorManagement/AddVender")
);
const QrPaymentStepTwo = lazy(() =>
  import(
    "../../views/dashboard/Ship/SlipMemberForm/steps-with-validation/QrPaymentStepTwo"
  )
);

const MemberManagement = lazy(() =>
  import("../../views/dashboard/member_management/Add_Member")
);

const MemberManagement_List = lazy(() =>
  import("../../views/dashboard/member_management")
);

const AddCategory = lazy(() =>
  import(
    "../../views/dashboard/pos/product_management/addproductCategory/AddCategory"
  )
);

const CreatePass = lazy(() =>
  import("../../views/dashboard/parking_pass/Park_Pass")
);

const SellPass = lazy(() =>
  import("../../views/dashboard/parking_pass/SellPass")
);

const ViewRoomBooking = lazy(() =>
  import(
    "../../views/dashboard/room_management/list_of_roomBooking/view_bookingrooms/View"
  )
);
const Event_Info = lazy(() =>
  import("../../views/dashboard/event_management/Event_info")
);
const venueLocation = lazy(() =>
  import("../../views/dashboard/event_management/VenueLocation")
);
const ProductPayment = lazy(() => import("../../views/apps/pos"));
const Client_info = lazy(() =>
  import("../../views/dashboard/event_management/Client_info")
);
const Event_Type = lazy(() =>
  import("../../views/dashboard/event_management/event_type")
);
const Cretae_Event_Type = lazy(() =>
  import("../../views/dashboard/event_management/event_type/AddEventTypes")
);

const EventIndex = lazy(() => import("../../views/dashboard/event_management"));
const CreateEvent = lazy(() =>
  import("../../views/dashboard/event_management/CreateEvent")
);

const CreateVenue = lazy(() =>
  import("../../views/dashboard/event_management/createVenue/CreateVenue")
);
const VenueList = lazy(() =>
  import("../../views/dashboard/event_management/createVenue")
);
const PaymentHistory = lazy(() =>
  import("../../views/dashboard/event_management/PaymentHistory")
);
const ClientDetails = lazy(() =>
  import("../../views/dashboard/event_management/client_Information")
);

const ViewClient = lazy(() =>
  import("../../views/dashboard/event_management/client_Information/ViewClient")
);
const Payment = lazy(() =>
  import("../../views/dashboard/event_management/Payment")
);
const Preview = lazy(() =>
  import("../../views/dashboard/event_management/Preview")
);
const GenerateDiscountOtp = lazy(() =>
  import("../../views/dashboard/event_management/GenerateDiscountOtp")
);

const VendorTypeList = lazy(() =>
  import("../../views/dashboard/pos/vendorManagement/vendorTypes")
);

const ManageRoomType = lazy(() =>
  import("../../views/dashboard/room_management/manage_roomType")
);
const AddRoomType = lazy(() =>
  import("../../views/dashboard/room_management/manage_roomType/AddRoomType")
);
const RoomDetails = lazy(() =>
  import("../../views/dashboard/room_management/manage_room")
);
const AddRoomDetails = lazy(() =>
  import("../../views/dashboard/room_management/manage_room/Add_RoomDetails")
);

const RoomPayment = lazy(() =>
  import(
    "../../views/dashboard/room_management/manage_roomBooking/addNewBooking/payment/RoomPayment"
  )
);

const RoomBooking = lazy(() => import("../../views/apps/booked-events"));

const AddRoomBooking = lazy(() =>
  import(
    "../../views/dashboard/room_management/manage_roomBooking/addNewBooking"
  )
);

const BookingListing = lazy(() =>
  import("../../views/dashboard/room_management/list_of_roomBooking")
);

const SearchRoom = lazy(() =>
  import(
    "../../views/dashboard/room_management/manage_roomBooking/addNewBooking/SearchRooms"
  )
);

const Checkout = lazy(() =>
  import(
    "../../views/dashboard/room_management/manage_roomBooking/addNewBooking/Checkout"
  )
);

const CheckInDetails = lazy(() =>
  import(
    "../../views/dashboard/room_management/manage_roomBooking/addNewBooking/CheckInDetails"
  )
);

const UpdateEvent = lazy(() =>
  import("../../views/dashboard/event_management/event_update/UpdateEvent")
);

const AddProductIndex = lazy(() =>
  import("../../views/dashboard/pos/product_management/addProduct")
);
const SaleSummery = lazy(() => import("../../views/dashboard/sales/index"));

const SalesTrends = lazy(() =>
  import("../../views/dashboard/sales/sales_trends/index")
);
const Report = lazy(() => import("../../views/dashboard/accounting/index"));

const Sales = lazy(() =>
  import("../../views/dashboard/accounting/sales/index")
);
const Ledger = lazy(() =>
  import("../../views/dashboard/accounting/ledger/index")
);

const Purchase = lazy(() =>
  import("../../views/dashboard/accounting/purchase/index")
);

const WaitingSlip = lazy(() =>
  import("../../views/dashboard/slip-management/waiting_slip")
);

const ViewCustomer = lazy(() =>
  import("../../views/dashboard/pos/customer_management/view/index")
);

const EnterWaitingSlipDetails = lazy(() =>
  import("../../views/dashboard/slip-management/waiting_slip/EnterDetails")
);
const EmailSMSIndex = lazy(() =>
  import("../../views/dashboard/crm_setting/emailSetting/index")
);
const EmailSMSsetting = lazy(() =>
  import("../../views/dashboard/crm_setting/emailSetting/AddEmailSMS")
);
const Template = lazy(() =>
  import("../../views/dashboard/crm_setting/template/index")
);

const EmailSmsTemplate = lazy(() =>
  import("../../views/dashboard/crm_setting/template/EmailSmsTemplate")
);

// const AddBranch = lazy(() =>
//   import("../../views/dashboard/branch_management/AddBranch")
// );

// const BranchIndex = lazy(() =>
//   import("../../views/dashboard/branch_management/index")
// );
const AutoPay = lazy(() =>
  import("../../views/dashboard/slip-management/autopaymentlist/index")
);



export default [
  {
    path: "/marin/slip-management/:uid",
    element: <SlipManagementRoutes />,
    meta: {
      resource: "slip management",
      action: "view",
    },
  },

  {
    path: "/marin/slip-management",
    element: <SlipManagementRoutes />,
    meta: {
      resource: "slip management",
      action: "view",
    },
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
    meta: {
      resource: "pos",
      action: "view",
    },
  },
  {
    element: <InvoiceAdd />,
    path: "/dashboard/invoice_management/invoice/add",
  },

  {
    element: <AddProductCategory />,
    path: "/dashboard/pos/product_management/addproductCategory",
    meta: {
      resource: "pos",
      action: "view",
    },
  },
  {
    element: <AddProductTax />,
    path: "/dashboard/pos/product_management/addtaxes",
    meta: {
      resource: "pos",
      action: "view",
    },
  },

  {
    element: <ProductManagement />,
    path: "/dashboard/pos/product_management/",
    meta: {
      resource: "pos",
      action: "view",
    },
  },

  {
    element: <AddStocks />,
    path: "/dashboard/pos/product_management/AddStocks",
    meta: {
      resource: "pos",
      action: "view",
    },
  },

  {
    element: <ManageStocks />,
    path: "/dashboard/pos/product_management/manageStocks",
    meta: {
      resource: "pos",
      action: "view",
    },
  },

  {
    element: <CustomerManagement />,
    path: "/dashboard/pos/customer_management",
    meta: {
      resource: "pos",
      action: "view",
    },
  },

  {
    element: <PointOfSale />,
    path: "/dashboard/pos/point_of_sale/shop",
    meta: {
      resource: "pos",
      action: "view",
    },
  },
  {
    element: <VirtualTerminal />,
    path: "/dashboard/pos/virtualTerminal",
    meta: {
      resource: "pos",
      action: "view",
    },
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
    meta: {
      resource: "pos",
      action: "view",
    },
  },

  {
    element: <VendorManage />,
    path: "/pos/VendorManage",
    meta: {
      resource: "pos",
      action: "view",
    },
  },
  {
    element: <VendorAdd />,
    path: "/pos/VendorManage/addVendor",
    meta: {
      resource: "pos",
      action: "view",
    },
  },

  {
    element: <MemberManagement />,
    path: "/member_management/add-member",
  },
  {
    element: <MemberManagement_List />,
    path: "/member_management",
  },

  {
    element: <AddCategory />,
    path: "/pos/product_management/add-category",
    meta: {
      resource: "pos",
      action: "view",
    },
  },

  {
    element: <ParkingPassListing />,
    path: "/parking_pass",
    meta: {
      resource: "parking pass",
      action: "view",
    },
  },

  {
    element: <CreatePass />,
    path: "/parking_pass/add_pass",
    meta: {
      resource: "parking pass",
      action: "view",
    },
  },
  {
    element: <SellPass />,
    path: "/parking_pass/sellpass",
    meta: {
      resource: "parking pass",
      action: "view",
    },
  },

  {
    element: <Event_Info />,
    path: "/event_info",
    meta: {
      resource: "event management",
      action: "view",
    },
  },

  {
    element: <Client_info />,
    path: "/Client_info",
  },
  {
    element: <Event_Type />,
    path: "/addEvent_type",
    meta: {
      resource: "event management",
      action: "view",
    },
  },

  {
    element: <EventIndex />,
    path: "/event_index",
    meta: {
      resource: "event management",
      action: "view",
    },
  },

  {
    element: <CreateEvent />,
    path: "/CreateEvent",
    meta: {
      resource: "event management",
      action: "view",
    },
  },

  {
    element: <CreateVenue />,
    path: "/venue",
     meta: {
      resource: "event management",
      action: "view",
    },
  },

  {
    element: <VenueList />,
    path: "/VenueList",
     meta: {
      resource: "event management",
      action: "view",
    },
  },

  {
    element: <Cretae_Event_Type />,
    path: "/eventTypes",
    meta: {
      resource: "event management",
      action: "view",
    },
  },

  {
    element: <venueLocation />,
    path: "/venueLocation",
  },

  {
    element: <PaymentHistory />,
    path: "/PaymentHistory",
  },

  {
    element: <ClientDetails />,
    path: "/ClientDetails",
  },

  {
    element: <ViewClient />,
    path: "/ViewClient",
  },

  {
    element: <Payment />,
    path: "/payment",
  },

  {
    element: <Preview />,
    path: "/preview",
  },

  {
    element: <GenerateDiscountOtp />,
    path: "/genrateotp",
  },

  {
    element: <VendorTypeList />,
    path: "/pos/vendor_typeList",
    meta: {
      resource: "pos",
      action: "view",
    },
  },

  {
    element: <AddVTypes />,
    path: "/pos/vendor_typeList/addVendorType",
    meta: {
      resource: "pos",
      action: "view",
    },
  },
  {
    element: <ManageRoomType />,
    path: "/manage_room_types",
    meta: {
      resource: "room management",
      action: "view",
    },
  },

  {
    element: <AddRoomType />,
    path: "/add_room_types",
    meta: {
      resource: "room management",
      action: "view",
    },
  },

  {
    element: <RoomDetails />,
    path: "/room_details",
    meta: {
      resource: "room management",
      action: "view",
    },
  },

  {
    element: <AddRoomDetails />,
    path: "/room_details/add_room_details",
    meta: {
      resource: "room management",
      action: "view",
    },
  },

  {
    element: <RoomBooking />,
    path: "/manage_roomBooking",
    meta: {
      resource: "room management",
      action: "view",
    },
  },

  {
    element: <AddRoomBooking />,
    path: "/addNew_room_booking",
    meta: {
      resource: "room management",
      action: "view",
    },
  },

  {
    element: <BookingListing />,
    path: "/bookingListing",
    meta: {
      resource: "room management",
      action: "view",
    },
  },

  {
    element: <SearchRoom />,
    path: "/search-rooms",
    meta: {
      resource: "room management",
      action: "view",
    },
  },
  {
    element: <Checkout />,
    path: "/search-rooms/previewBooking",
    meta: {
      resource: "room management",
      action: "view",
    },
  },
  {
    element: <CheckInDetails />,
    path: "/search-rooms/CheckInDetails",
    meta: {
      resource: "room management",
      action: "view",
    },
  },

  {
    element: <RoomPayment />,
    path: "/search-rooms/previewBooking/roomPayment",
    meta: {
      resource: "room management",
      action: "view",
    },
  },

  {
    element: <ViewRoomBooking />,
    path: "booking_listing/view",
    meta: {
      resource: "room management",
      action: "view",
    },
  },

  {
    element: <UpdateEvent />,
    path: "event/update",
    meta: {
      resource: "event management",
      action: "view",
    },
  },

  {
    element: <AddProductIndex />,
    path: "/dashboard/pos/product_management/addProduct_index",
    meta: {
      resource: "pos",
      action: "view",
    },
  },

  {
    element: <ViewSlip />,
    path: "/dashboard/rentroll/view_slip",

    meta: {
      resource: "rent roll",
      action: "view",
    },
  },
  {
    element: <InverSlip />,
    path: "/dashboard/rentroll/inverse_slip",
    meta: {
      resource: "rent roll",
      action: "view",
    },
  },
  {
    element: <ProductPayment />,
    path: "/dashboard/pos/point_of_sale/shop/PayementDetails",
    // meta: {
    //   layout: "blank",
    // },
    meta: {
      resource: "pos",
      action: "view",
    },
  },
  {
    element: <QrList />,
    path: "/dashboard/qr-code/qr-list",
  },
  {
    element: <EventPaymentList />,
    path: "dashboard/qr-code/event-list",
    meta: {
      resource: "event management",
      action: "view",
    },
  },
  {
    element: <QrPaymentFrom />,
    path: "dashboard/qr-code/paymentForm",
  },
  // {
  //   element :  <UserRoleManagement />,
  //   path: 'dashboard/crmSetting/userRoleManagement'
  // },
  {
    element: <QrPaymentFrom />,
    path: "dashboard/qr-code/paymentForm/:token",
    meta: {
      publicRoute: true,
      layout: "blank",
    },
  },

  {
    element: <SaleSummery />,
    path: "/sales/sale_summery",
    meta: {
      resource: "sales",
      action: "view",
    },
  },

  {
    element: <SalesTrends />,
    path: "/sales/sale_trends",
    meta: {
      resource: "sales",
      action: "view",
    },
  },

  {
    element: <Report />,
    path: "/accounting/reports",
    meta: {
      resource: "accounting",
      action: "view",
    },
  },

  {
    element: <Sales />,
    path: "/accounting/sales",
    meta: {
      resource: "accounting",
      action: "view",
    },
  },

  {
    element: <Ledger />,
    path: "/accounting/ledger",
    meta: {
      resource: "accounting",
      action: "view",
    },
  },

  {
    element: <Purchase />,
    path: "/accounting/purchase",
    meta: {
      resource: "accounting",
      action: "view",
    },
  },

  {
    path: "/marin/slip-management/switch-slip-payment",
    element: <SwitchSlipPaymentForm />,
    meta: {
      resource: "crm setting",
      action: "view",
    },
  },

  {
    element: <WaitingSlip />,
    path: "/slip-management/waiting_slip",
    meta: {
      resource: "crm setting",
      action: "view",
    },
  },

  {
    element: <ViewCustomer />,
    path: "/pos/customer-management/view",
    meta: {
      resource: "pos",
      action: "view",
    },
  },
  {
    element: <EnterWaitingSlipDetails />,
    path: "/slip-management/add_WaitingSlip",
  },
  {
    element: <EmailSMSsetting />,
    path: "/crm/email_sms_setting",
    meta: {
      resource: "crm setting",
      action: "view",
    },
  },

  {
    element: <EmailSMSIndex />,
    path: "/crm/index",
    meta: {
      resource: "crm setting",
      action: "view",
    },
  },

  {
    element: <Template />,
    path: "/crm/template/index",
    meta: {
      resource: "crm setting",
      action: "view",
    },
  },

  {
    element: <EmailSmsTemplate />,
    path: "/crm/template",
    meta: {
      resource: "crm setting",
      action: "view",
    },
  },

  // {
  //   element: <AddBranch />,
  //   path: "/branch/add_branch",
  //   meta: {
  //     resource: "sales",
  //     action: "view",
  //   },
  // },
  //  {
  //   element: <BranchIndex />,
  //   path: "/branch",
  //   meta: {
  //     resource: "sales",
  //     action: "view",
  //   },
  // },


  {
    element: <AutoPay />,
    path: "/autopaylist",
    meta: {
      resource: "slip management",
      action: "view",
    },
  },
];
