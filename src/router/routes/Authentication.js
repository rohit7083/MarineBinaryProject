// ** React Imports
import { lazy } from 'react'

const loginEmail = lazy(() => import('../../views/pages/authentication/slip/LoginEmail'))
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
const Email_Reset = lazy(()=> import('../../views/pages/authentication/slip/Email_Reset'))
const EmailOTP = lazy(()=> import('../../views/pages/authentication/slip/EmailOTP'))
const Mobile_OTP = lazy(()=> import('../../views/pages/authentication/slip/Mobile_OTP'))
const LoginPassword= lazy(()=> import('../../views/pages/authentication/slip/LoginPassword'))
// const Forget_password = lazy(()=> import('../../views/pages/authentication/Forget_password'))
const SlipRegister = lazy(()=> import('../../views/pages/authentication/SlipRegister'))
// const ForgotPassword = lazy(()=> import('../../views/pages/authentication/ForgotPassword'))
const Forget_password = lazy(()=> import('../../views/pages/authentication/slip/Forget_password'))
// const twoStep_auth=lazy(()=>import('../../views/pages/authentication/slip/twoStep_auth'))
const AuthenticationRoutes = [
  {
    path: '/login',
    element: <loginEmail />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },


  {
    path: '/login_password',
    element: <LoginPassword/>,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/reset_password/:token',
    element: <Forget_password />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      // restricted: true
    }
  },
  
  {
    path: '/Email_Reset',
    element: <Email_Reset />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  // {
  //   path: '/verify_account/:token',
  //   element: <EmailOTP />,
  //   meta: {
  //     layout: 'blank',
  //     publicRoute: true,
  //     restricted: true
  //   }
  // },
  {
    path: '/email_Otp',
    element: <EmailOTP />,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
  {
    path: '/Mobile_OTP',
    element: <Mobile_OTP/>,
    meta: {
      layout: 'blank',
      publicRoute: true,
      restricted: true
    }
  },
 
  {
    path: '/forget-password',
    element: <Forget_password />,
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
  // {
  //   path: '/twoStep_auth',
  //   element: <twoStep_auth />,
  //   meta: {
  //     layout: 'blank',
  //     publicRoute: true,
  //     restricted: true
  //   }
  // },
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
