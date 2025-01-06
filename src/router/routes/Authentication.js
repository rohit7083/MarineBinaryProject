// ** React Imports
import { lazy } from 'react'

const SlipLogin = lazy(() => import('../../views/pages/authentication/SlipLogin'))
const LoginBasic = lazy(() => import('../../views/pages/authentication/LoginBasic'))
const LoginCover = lazy(() => import('../../views/pages/authentication/LoginCover'))

const Register = lazy(() => import('../../views/pages/authentication/Register'))
const RegisterBasic = lazy(() => import('../../views/pages/authentication/RegisterBasic'))
// const RegisterCover = lazy(() => import('../../views/pages/authentication/RegisterCover'))
const RegisterMultiSteps = lazy(() => import('../../views/pages/authentication/register-multi-steps'))

const ForgotPassword = lazy(() => import('../../views/pages/authentication/ForgotPassword'))
const ForgotPasswordBasic = lazy(() => import('../../views/pages/authentication/ForgotPasswordBasic'))
const ForgotPasswordCover = lazy(() => import('../../views/pages/authentication/ForgotPasswordCover'))

// const ResetPasswordBasic = lazy(() => import('../../views/pages/authentication/ResetPasswordBasic'))
const ResetPasswordCover = lazy(() => import('../../views/pages/authentication/ResetPasswordCover'))

// const VerifyEmailBasic = lazy(() => import('../../views/pages/authentication/VerifyEmailBasic'))
const VerifyEmailCover = lazy(() => import('../../views/pages/authentication/VerifyEmailCover'))

// const TwoStepsBasic = lazy(() => import('../../views/pages/authentication/TwoStepsBasic'))
const TwoStepsCover = lazy(() => import('../../views/pages/authentication/TwoStepsCover'))
const SlipEmailForReset = lazy(()=> import('../../views/pages/authentication/SlipEmailForReset'))
const SlipEmailOTP = lazy(()=> import('../../views/pages/authentication/SlipEmailOTP'))
const SlipForgetPassword = lazy(()=> import('../../views/pages/authentication/SlipForgetPassword'))
const SlipRegister = lazy(()=> import('../../views/pages/authentication/SlipRegister'))
const AuthenticationRoutes = [
  {
    path: '/SlipLogin',
    element: <SlipLogin />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/SlipEmailForReset',
    element: <SlipEmailForReset />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/SlipEmailOTP',
    element: <SlipEmailOTP />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/SlipForgetPassword',
    element: <SlipForgetPassword />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/SlipRegister',
    element: <SlipRegister />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/pages/login-basic',
    element: <LoginBasic />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/pages/login-cover',
    element: <LoginCover />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/register',
    element: <Register />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/pages/register-basic',
    element: <RegisterBasic />,
    meta: {
      layout: 'blank'
    }
  },
  // {
  //   path: '/pages/register-cover',
  //   element: <RegisterCover />,
  //   meta: {
  //     layout: 'blank'
  //   }
  // },
  {
    path: '/pages/register-multi-steps',
    element: <RegisterMultiSteps />,
    meta: {
      layout: 'blank'
    }
  },

  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    layout: 'BlankLayout',
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/pages/forgot-password-basic',
    element: <ForgotPasswordBasic />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/pages/forgot-password-cover',
    element: <ForgotPasswordCover />,
    meta: {
      layout: 'blank'
    }
  },
  // {
  //   path: '/pages/reset-password-basic',
  //   element: <ResetPasswordBasic />,
  //   meta: {
  //     layout: 'blank'
  //   }
  // },
  {
    path: '/pages/reset-password-cover',
    element: <ResetPasswordCover />,
    meta: {
      layout: 'blank'
    }
  },
  // {
  //   path: '/pages/verify-email-basic',
  //   element: <VerifyEmailBasic />,
  //   meta: {
  //     layout: 'blank'
  //   }
  // },
  {
    path: '/pages/verify-email-cover',
    element: <VerifyEmailCover />,
    meta: {
      layout: 'blank'
    }
  },
  // {
  //   path: '/pages/two-steps-basic',
  //   element: <TwoStepsBasic />,
  //   meta: {
  //     layout: 'blank'
  //   }
  // },
  {
    path: '/pages/two-steps-cover',
    element: <TwoStepsCover />,
    meta: {
      layout: 'blank'
    }
  }
]

export default AuthenticationRoutes
