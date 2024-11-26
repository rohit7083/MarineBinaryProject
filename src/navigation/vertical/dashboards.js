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
      {
        id: 'SlipCategory',
        title: 'SlipCategory',
        icon: <Circle size={12} />,
        navLink: '/dashboard/SlipCategory'
      },
      {
        id: 'SlipDetails',
        title: 'SlipDetails',
        icon: <Circle size={12} />,
        navLink: '/dashboard/SlipDetails'
      },
      // {
      //   id: 'SlipLogin',
      //   title: 'SlipLogin',
      //   icon: <Circle size={12} />,
      //   navLink: '/dashboard/SlipLogin'
      // },
    
    ]
  }
]

