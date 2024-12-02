// ** React Imports
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Facebook, Twitter, Mail, GitHub, HelpCircle, Coffee, X } from 'react-feather'

// ** Actions
import { handleLogin } from '@store/authentication'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
  UncontrolledTooltip
} from 'reactstrap'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/login-v2.svg'
import illustrationsDark from '@src/assets/images/pages/login-v2-dark.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'

const ToastContent = ({ t, name, role }) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>{name}</h6>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
        <span>You have successfully logged in as an {role} user to Vuexy. Now you can start to explore. Enjoy!</span>
      </div>
    </div>
  )
}

const defaultValues = {
  password: 'sneha@123',
  loginEmail: 'sneha@binarysoftech.co.in'
}

const Login = () => {
  // ** Hooks
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const ability = useContext(AbilityContext)
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight

  const onSubmit = (data) => {
    if (Object.values(data).every(field => field.length > 0)) {
      useJwt
        .login({ emailId: data.loginEmail, password: data.password })
        .then(res => {
          // debugger
          const data = { ...{...res.data.content.profile,ability:[
            {
              action: 'manage',
              subject: 'all'
            }
          ]}, accessToken: res.data.content.access, refreshToken: res.data.content.refresh }
          dispatch(handleLogin(data))
          ability.update(  [
            {
              action: 'manage',
              subject: 'all'
            }
          ])
          // navigate(getHomeRouteForLoggedInUser(data.role))
          navigate('/dashboard/SlipList'); 
                   toast(t => (
            <ToastContent t={t} role={data.role || 'admin'} name={data.fullName || data.username || 'John Doe'} />
          ))
        })
        .catch(err => setError('loginEmail', {
            type: 'manual',
            message: err.response.data.error
          })
        )
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

/*
  const onSubmit = (data) => {
        if (Object.values(data).every(field => field.length > 0)) {
          fetch('http://192.168.29.190:8001/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              emailId: data.loginEmail,
              password: data.password,
            }),
          })
            .then(response => {
              if (response.ok) {
                return response.json();  // Parse the successful response
              } else {
                throw new Error('Invalid credentials');  // If the API returns an error status
              }
            })
            .then(data => {
              // If login is successful, print success message
    
              const {content}=data
              const {access,refresh,profile}=content
    
    
              console.log('Login successful:', data);  // You can log the user data or just success message
              localStorage.setItem("keyName",JSON.stringify("name"))
              localStorage.setItem("accessToken", JSON.stringify(data.content.access))
              localStorage.setItem("refresh", JSON.stringify(data.content.refresh))
              localStorage.setItem("Profile", JSON.stringify(data.content.profile  ))
    
              // Redirect to another page after successful login
              navigate('/dashboard/ecommerce');  // Change '/dashboard' to the route you want to redirect to
            })
            .catch(error => {
              // Handle errors during login (Invalid credentials or server error)
              console.error('Error during login:', error);
              setError('loginEmail', {
                type: 'manual',
                message: 'Invalid email or password',  // Set error message for email
              });
              setError('password', {
                type: 'manual',
                message: 'Invalid email or password',  // Set error message for password
              });
            });
        } else {
          // Handle form validation errors if fields are empty
          for (const key in data) {
            if (data[key].length === 0) {
              setError(key, {
                type: 'manual',
              });
            }
          }
        }
      }
*/

  return (
    <div className='auth-wrapper auth-cover'>
    <Row className='auth-inner m-0'>
      <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
        <svg viewBox='0 0 139 95' version='1.1' height='28'>
          {/* SVG Logo here */}
        </svg>
        <h2 className='brand-text text-primary ms-1'>Slip Login</h2>
      </Link>
      <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
        <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
          <CardTitle tag='h2' className='fw-bold mb-1'>
            Login 👋
          </CardTitle>
          <CardText className='mb-2'></CardText>
          <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-1'>
              <Label className='form-label' for='login-email'>
                Email
              </Label>
              <Controller
                id='loginEmail'
                name='loginEmail'
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                    message: 'Invalid email address',
                  }
                }}
                render={({ field }) => (
                  <Input
                    autoFocus
                    type='email'
                    placeholder='john@example.com'
                    invalid={errors.loginEmail && true}
                    {...field}
                  />
                )}
              />
              {errors.loginEmail && <FormFeedback>{errors.loginEmail.message}</FormFeedback>}
            </div>
            <div className='mb-1'>
              <div className='d-flex justify-content-between'>
                <Label className='form-label' for='login-password'>
                  Password
                </Label>
                <Link to='/forgot-password'>
                  <small>Forgot Password?</small>
                </Link>
              </div>
              <Controller
                id='password'
                name='password'
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  }
                }}
                render={({ field }) => (
                  <InputPasswordToggle
                    className='input-group-merge'
                    invalid={errors.password && true}
                    {...field}
                  />
                )}
              />
              {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
            </div>
            <div className='form-check mb-1'>
              <Input type='checkbox' id='remember-me' />
              <Label className='form-check-label' for='remember-me'>
                Remember Me
              </Label>
            </div>
            <Button type='submit' color='primary' block>
              Sign in
            </Button>
          </Form>
          <p className='text-center mt-2'>
            <span className='me-25'>New on our platform?</span>
            <Link to='/register'>
              <span>Create an account</span>
            </Link>
          </p>
        </Col>
      </Col>
    </Row>
  </div>
  )
}

export default Login

