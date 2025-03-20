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
    navLink: "/dashboard/dash",
  },
  {
    id: "Slip",
    title: "Slip",
    icon: <Circle size={12} />,
    navLink: "/dashboard/Ship",
    badge: "light-warning",
    // badgeText: '2',
    children: [
      {
        id: "SlipList",
        title: "Slip Category List",
        icon: <Circle size={12} />,
        navLink: "/dashboard/SlipList",
      },
      {
        id: "SlipDetailList",
        title: "Slip List",
        icon: <Circle size={12} />,
        navLink: "/dashboard/SlipDetailList",
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
        navLink: "/dashboard/SlipMemberList",
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
        // navLink: '/dashboard/invoice_management/'
      },

      {
        id: "Ecomm",
        title: "Ecomm ",
        icon: <Circle size={12} />,
        navLink: '/dashboard/pos/point_of_sale/ecommerce/shop'
      },
    ],
  },
];
