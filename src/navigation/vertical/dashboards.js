// ** Icons Import
import { Home, Circle } from "react-feather";

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
    title: "dashboard",
    icon: <Circle size={12} />,
    navLink: "/dashbord",
  },
  {
    id: "Slip",
    title: "Slip",
    icon: <Circle size={12} />,
    navLink: "/Ship",
    badge: "light-warning",
    // badgeText: '2',
    children: [
      {
        id: "SlipList",
        title: "Slip Category List",
        icon: <Circle size={12} />,
        navLink: "slip_Management/sliplist",
      },
      {
        id: "SlipDetailList",
        title: "Slip Details List",
        icon: <Circle size={12} />,
        navLink: "/dashboard/slipdetail_list",
      },
      // {
      //   id: 'SlipMemberForm',
      //   title: 'Slip Member Form',
      //   icon: <Circle size={12} />,
      //   navLink: '/dashboard/SlipMemberForm'
      // },
      {
        id: "SlipMemberList",
        title: "Slip Member List",
        icon: <Circle size={12} />,
        navLink: "/dashboard/slipmember_list",
      },
    ],
  },
  {
    id: "Users Management",
    title: "Users Management",
    icon: <Circle size={12} />,
    // navLink: '/dashboard/create-user',
    badge: "light-warning",
    // badgeText: '2',
    children: [
      {
        id: "Create User",
        title: "Roles & Permissions",
        icon: <Circle size={12} />,
        navLink: "/dashboard/user_rolls/roles-permissions/roles",
      },
      {
        id: "permissions",
        title: "Users",
        icon: <Circle size={12} />,
        navLink: "/dashboard/user_rolls/roles-permissions/createuser",
      },
    ],
  },

  {
    id: "Invoice Management",
    title: "Invoice Management",
    icon: <Circle size={12} />,
    // navLink: '/dashboard/create-user',
    badge: "light-warning",
    // badgeText: '2',
    children: [
      {
        id: "Invoice",
        title: "Create Invoice",
        icon: <Circle size={12} />,
        navLink: "/dashboard/invoice_management/invoice",
      },
      {
        id: "Manage Invoice ",
        title: "Manage Invoice",
        icon: <Circle size={12} />,
        navLink: "/dashboard/invoice_management/manageInvoice",
      },
      {
        id: "Invoice Setting",
        title: "Invoice Setting",
        icon: <Circle size={12} />,
        navLink: "/dashboard/invoice_management/invoice_setting",
      },
      {
        id: "Recurring Invoice ",
        title: "Recurring Invoice ",
        icon: <Circle size={12} />,
        // navLink: '/dashboard/invoice_management/'
      },
    ],
  },

  {
    id: "POS",
    title: "POS",
    icon: <Circle size={12} />,
    // navLink: '/dashboard/create-user',
    badge: "light-warning",
    // badgeText: '2',
    children: [
      {
        id: "Vendor Manage",
        title: "Vendor Manage",
        icon: <Circle size={12} />,
        navLink: "/pos/VendorManage",
      },
      {
        id: "Product Manage",
        title: "Product Manage",
        icon: <Circle size={12} />,
        navLink: "/dashboard/pos/product_management",
      },
      {
        id: "Point Of Sale ",
        title: "Point Of Sale ",
        icon: <Circle size={12} />,
        navLink: "/dashboard/pos/point_of_sale/shop",
      },
      {
        id: "Cusstomer manage",
        title: "Customer Manage",
        icon: <Circle size={12} />,
        navLink: "/dashboard/pos/customer_management",
      },
      {
        id: "Virtual Terminal",
        title: "Virtual Terminal ",
        icon: <Circle size={12} />,
        navLink: '/dashboard/pos/point_of_sale/virtual-terminal'
      },

     
    ],
  },

  {
    id: "ui",
    title: "ui",
    icon: <Circle size={12} />,
    // navLink: '/dashboard/create-user',
    badge: "light-warning",
    // badgeText: '2',
    children: [
      {
        id: "ui1",
        title: "ui  1",
        icon: <Circle size={12} />,
        navLink: "/dashbord/ship/ui",
      },
      {
        id: "ui2",
        title: "ui 2",
        icon: <Circle size={12} />,
        navLink: "/dashbord/ship/ui",
      },
 
     
    ],
  },
];
