// ** Icons Import
import {
  BookCopy,
  GitBranch,
  HomeIcon,
  QrCode,
  Settings,
  UserRoundSearch
} from "lucide-react";
import { BarChart2, Calendar, Circle, FileText, Square } from "react-feather";

export default [

  
  // {
  //   id: 'dashboards',
  //   title: 'Dashboards',
  //   icon: <Home size={20} />,
  //   badge: 'light-warning',
  //   badgeText: '2',
  //   children: [
  //     {
  //       id: 'analyticsDash',
  //       title: 'Analytics',
  //       icon: <Circle size={12} />,
  //       navLink: '/dashboard/analytics'
  //     },
  //     {
  //       id: 'eCommerceDash',
  //       title: 'eCommerce',
  //       icon: <Circle size={12} />,
  //       navLink: '/dashboard/ecommerce'
  //     }
  //   ]
  // }
  // ,
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Circle size={12} />,
    navLink: "/dashbord",
    action: "view",
    resource: "dashboard",
  },
  {
    id: "slip",
    title: "Slip Management",
    icon: <FileText size={12} />,
    navLink: "/Ship",
    badge: "light-warning",
    action: "view",
    resource: "slip management",
    // badgeText: '2',
    children: [
      {
        id: "SlipList",
        title: "Slip Category ",
        icon: <Circle size={12} />,
        navLink: "slip_Management/sliplist",
        action: "view",
        resource: "slip management",
      },
      {
        id: "SlipDetailList",
        title: "Slip Details ",
        icon: <Circle size={12} />,
        navLink: "/dashboard/slipdetail_list",
        action: "view",
        resource: "slip management",
      },
      // {
      //   id: 'SlipMemberForm',
      //   title: 'Slip Member Form',
      //   icon: <Circle size={12} />,
      //   navLink: '/dashboard/SlipMemberForm'
      // },
      {
        id: "SlipMemberList",
        title: "Slip Member ",
        icon: <Circle size={12} />,
        navLink: "/dashboard/slipmember_list",
        action: "view",
        resource: "slip management",
      },

      {
        id: "WaitingSlip",
        title: "Waiting Slip ",
        icon: <Circle size={12} />,
        navLink: "/slip-management/waiting_slip",
        action: "view",
        resource: "slip management",
      },
      {
        id: "Auto payment List",
        title: "Auto payment List ",
        icon: <Circle size={12} />,
        navLink: "/autopaylist",
        action: "view",
        resource: "slip management",
      },
    ],
  },
  {
    id: "Users Management",
    title: "Users Management",
    icon: (
      <img
        width="22"
        height="22"
        className="me-1"
        src="https://img.icons8.com/ios/50/user--v1.png"
        alt="user--v1"
      />
    ),

    // navLink: '/dashboard/create-user',
    badge: "light-warning",
    action: "view",
    resource: "user management",
    // badgeText: '2',
    children: [
      {
        id: "Create User",
        title: "Roles-Permissions",
        icon: <Circle size={12} />,
        navLink: "/dashboard/user_rolls/roles-permissions/roles",
        action: "view",
        resource: "user management",
      },
      {
        id: "permissions",
        title: "Users List",
        icon: <Circle size={12} />,
        navLink: "/dashboard/user_rolls/roles-permissions/createuser",
        action: "view",
        resource: "user management",
      },
    ],
  },

  {
    id: "Invoice Management",
    title: "Invoice Management",
    icon: <img width="20" className="me-1" height="20" src="https://img.icons8.com/ios/50/check--v1.png" alt="check--v1"/>,
    // navLink: '/dashboard/create-user',
    badge: "light-warning",
     action: "view",
        resource: "user management",
    // badgeText: '2',
    children: [
    
  // {
  //   id: "Manage Invoice ",
  //   title: "Manage Invoice",
  //   icon: <Circle size={12} />,
  //   navLink: "/dashboard/invoice_management/manageInvoice",
  //    action: "view",
  //   resource: "user management",
  // },
  {
    id: "Invoice Setting",
    title: "Invoice Setting",
    icon: <Circle size={12} />,
    navLink: "/dashboard/invoice_management/invoice_setting",
     action: "view",
    resource: "user management",
  },
    {
        id: "Invoice",
        title: "Generate Invoice",
        icon: <Circle size={12} />,
        navLink: "/dashboard/invoice_management/invoice/add",
         action: "view",
        resource: "user management",
      },
  // {
  //   id: "Recurring Invoice ",
  //   title: "Recurring Invoice ",
  //   icon: <Circle size={12} />,
  //   // navLink: '/dashboard/invoice_management/'
  //    action: "view",
  //   resource: "user management",
  // },
    ],
  },

  {
    id: "pos",
    title: "POS",
    icon: (
      <img
        width="26"
        height="26"
        className="me-1"
        src="https://img.icons8.com/dotty/80/receipt-terminal.png"
        alt="transaction-declined"
      />
    ),
    // navLink: '/dashboard/create-user',
    badge: "light-warning",
    action: "view",
    resource: "pos",
    // badgeText: '2',
    children: [
      // {
      //   id: "Vendor Manage",
      //   title: "Vendor Manage",
      //   icon: <Circle size={12} />,
      //   navLink: "/pos/VendorManage",
      // },
      {
        id: "Product Manage",
        title: "Product Setup",
        icon: <Circle size={12} />,
        navLink: "/dashboard/pos/product_management",
        action: "view",
        resource: "pos",
      },
      {
        id: "Point Of Sale ",
        title: "Point Of Sale ",
        icon: <Circle size={12} />,
        navLink: "/dashboard/pos/point_of_sale/shop/PayementDetails",
        action: "view",
        resource: "pos",
        // meta: {
        //   layout: "blank",
        // },
      },
      // {
      //   id: "Virtual Terminal",
      //   title: "Virtual Terminal",
      //   icon: <Circle size={12} />,
      //   navLink: "/dashboard/pos/virtualTerminal",
      // },
      {
        id: "Cusstomer manage",
        title: "Client Hub",
        icon: <Circle size={12} />,
        navLink: "/dashboard/pos/customer_management",
        action: "view",
        resource: "pos",
      },
    ],
  },

  // {
  //   id: "Parking Pass",
  //   title: "Parking Pass",
  //   icon: <Square size={12} />,
  //   navLink: "/parking_pass",
  //   badge: "light-warning",
  //   // badgeText: '2',
  //   action: "view",
  //   resource: "parking pass",
  //    isLocked: true ,
  // },

  {
    id: "parkingpass",
    title: "Parking Pass",
    icon: <Square size={12} />,
    navLink: "/parking_pass",
    badge: "light-warning",
    isLocked: "🔒",
    action: "view",
    resource: "parking pass",
    // disabled: true,
  },
  {
    id: "event",
    title: "Event Management",
    icon: <Calendar size={12} />,
    navLink: "/event_index",
    badge: "light-warning",
    // badgeText: '2',
    action: "view",
    resource: "event management",
    children: [
      {
        id: "Index",
        title: "Event List",
        icon: <Circle size={12} />,
        navLink: "/event_index",
        action: "view",
        resource: "event management",
      },

      // {
      //   id: "client",
      //   title: "Vendor Types",
      //   icon: <Circle size={12} />,
      //   navLink: "/Client_info",
      // },
      //   {
      //   id: "/event_info",
      //   title: "event_info",
      //   icon: <Circle size={12} />,
      //   navLink: "/event_info",
      // },
      {
        id: "/add_EventType",
        title: "Event Types",
        icon: <Circle size={12} />,
        navLink: "/addEvent_type",
        action: "view",
        resource: "event management",
      },
      {
        id: "/CreateVenue",
        title: "Venue ",
        icon: <Circle size={12} />,
        navLink: "/VenueList",
        action: "view",
        resource: "event management",
      },
    ],
  },

  {
    id: "roombooking",
    title: "Room Management",
    icon: <HomeIcon size={12} />,
    navLink: "/room_management",
    badge: "light-warning",
    // badgeText: '2',
    action: "view",
    resource: "room management",
    children: [
      {
        id: "Index",
        title: "Room types",
        icon: <Circle size={12} />,
        navLink: "/manage_room_types",
        action: "view",
        resource: "room management",
      },
      //     {
      //   id: "chout",
      //   title: "Review Booking",
      //   icon: <Circle size={12} />,
      //   navLink: "/search-rooms/previewBooking",
      // },

      {
        id: "Rooms Details",
        title: "Rooms Details",
        icon: <Circle size={12} />,
        navLink: "/room_details",
        action: "view",
        resource: "room management",
      },
      {
        id: "manage_roomBooking",
        title: "Room Booking",
        icon: <Circle size={12} />,
        navLink: "/manage_roomBooking",
        action: "view",
        resource: "room management",
      },

      {
        id: "bookingListing",
        title: "Booking List",
        icon: <Circle size={12} />,
        navLink: "/bookingListing",
        action: "view",
        resource: "room management",
      },
    ],
  },
  {
    id: "Rent Roll",
    title: "Rent Roll",
    icon: <BookCopy size={12} />,
    navLink: "/rent_roll",
    badge: "light-warning",
    action: "view",
    resource: "rent roll",
    children: [
      {
        id: "View Slip",
        title: "View  Rent Roll",
        icon: <Circle size={12} />,
        navLink: "/dashboard/rentroll/view_slip",
        action: "view",
        resource: "rent roll",
      },
      {
        id: "Inverse Slip",
        title: "Inverse Rent Roll",
        icon: <Circle size={12} />,
        navLink: "/dashboard/rentroll/inverse_slip",
        action: "view",
        resource: "rent roll",
      },
    ],
  },

  {
    id: "qrcode",
    title: "Generate QR Code",
    icon: <QrCode size={12} />,
    navLink: "/qr-code",
    badge: "light-warning",
    action: "view",
    resource: "qr code generator",
    children: [
      {
        id: "Qr Code",
        title: "Qr Code",
        icon: <Circle size={12} />,
        navLink: "/dashboard/qr-code/qr-list",
        action: "view",
        resource: "qr code generator",
      },
      {
        id: "Event List",
        title: "Event Payment list ",
        icon: <Circle size={12} />,
        navLink: "/dashboard/qr-code/event-list",
        action: "view",
        resource: "qr code generator",
      },
    ],
  },

  {
    id: "Sales",
    title: "Sales",
    icon: <BarChart2 size={12} />,
    // navLink: "/sales",
    badge: "light-warning",
    action: "view",
    resource: "sales",
    children: [
      {
        id: "Sales Summary",
        title: "Sales Summary",
        icon: <Circle size={12} />,
        navLink: "/sales/sale_summery",
        action: "view",
        resource: "sales",
      },
      {
        id: "Sales Trends",
        title: "Sales Trends",
        icon: <Circle size={12} />,
        navLink: "/sales/sale_trends",
        action: "view",
        resource: "sales",
      },
    ],
  },

  {
    id: "Accounting",
    title: "Accounting",
    icon: <UserRoundSearch size={12} />,
    // navLink: "/sales",
    badge: "light-warning",
    action: "view",
    resource: "accounting",
    children: [
      {
        id: "Reports",
        title: "Reports",
        icon: <Circle size={12} />,
        navLink: "/accounting/reports",
        action: "view",
        resource: "accounting",
      },
      {
        id: "Sales",
        title: "Sales",
        icon: <Circle size={12} />,
        navLink: "/accounting/sales",
        action: "view",
        resource: "accounting",
      },
      {
        id: "Ledger",
        title: "Ledger",
        icon: <Circle size={12} />,
        navLink: "/accounting/Ledger",
        action: "view",
        resource: "accounting",
      },
      // {
      //   id: "Purchase ",
      //   title: "Purchase ",
      //   icon: <Circle size={12} />,
      //   navLink: "/accounting/purchase",
      //   action: "view",
      //   resource: "accounting",
      // },
    ],
  },

  {
    id: "CRM Setting",
    title: "CRM Setting",
    icon: <Settings size={12} />,
    // navLink: "/sales",
    badge: "light-warning",
    action: "view",
    resource: "crm setting",
    children: [
      {
        id: "es",
        title: "Email-Sms Settings",
        icon: <Circle size={12} />,
        navLink: "/crm/index",
        action: "view",
        resource: "crm setting",
      },
      {
        id: "ps",
        title: "Template",
        icon: <Circle size={12} />,
        navLink: "/crm/template/index",
        action: "view",
        resource: "crm setting",
      },
    ],
  },

  //   {
  //   id: "manualEmail",
  //   title: "Manual  Email",
  //   icon: <Inbox size={12} />,
  //   navLink: "/manual_email",
  //   badge: "light-warning",
  //   isLocked: "🔒",
  //   action: "view",
  //   resource: "slip management",
  //   // disabled: true,
  // },

  {
    id: "branch",
    title: "Manage Branch",
    icon: <GitBranch size={12} />,
    navLink: "/branch",
    badge: "light-warning",
    action: "view",
    resource: "branch management",
    children: [
      {
        id: "addbranch",
        title: "Add Branch",
        icon: <Circle size={12} />,
        navLink: "/branch",
        action: "view",
        resource: "branch management",
      },
    ],
  },
];
