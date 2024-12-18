// ** Icons Import
import { Home, Circle } from 'react-feather'

export default [
  {
    id: 'dashboards',
    title: 'Dashboards',
    icon: <Home size={20} />,
    badge: 'light-warning',
    badgeText: '2',
    children: [
      {
        id: 'analyticsDash',
        title: 'Analytics',
        icon: <Circle size={12} />,
        navLink: '/dashboard/analytics'
      },
      {
        id: 'eCommerceDash',
        title: 'eCommerce',
        icon: <Circle size={12} />,
        navLink: '/dashboard/ecommerce'
      }
    ]
  }
,
  {
    id: 'Slip',
    title: 'Slip',
    icon: <Circle size={12} />,
    navLink: '/dashboard/Ship',
    badge: 'light-warning',
    badgeText: '2',
    children: [
      // {
      //   id: 'SlipCategory',
      //   title: 'SlipCategory',
      //   icon: <Circle size={12} />,
      //   navLink: '/dashboard/SlipCategory'
      // },
      {
        id: 'SlipList',
        title: 'SlipList',
        icon: <Circle size={12} />,
        navLink: '/dashboard/SlipList'
      },
      {
        id: 'SlipDetailList',
        title: 'SlipDetailList',
        icon: <Circle size={12} />,
        navLink: '/dashboard/SlipDetailList'
      },
      {
        id: 'SlipMemberForm',
        title: 'SlipMemberForm',
        icon: <Circle size={12} />,
        navLink: '/dashboard/SlipMemberForm'
      },
      {
        id: 'UI',
        title: 'UI',
        icon: <Circle size={12} />,
        navLink: '/dashboard/UI'
      },
     
      
    ]
  }
]

