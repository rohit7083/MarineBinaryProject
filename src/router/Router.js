3; // ** Router imports
import { lazy } from "react";

// ** Router imports
import { Navigate, useRoutes } from "react-router-dom";

// ** Layouts
import BlankLayout from "@layouts/BlankLayout";

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout";

// ** Utils
import { getHomeRouteForLoggedInUser, getUserData } from "../utility/Utils";

// ** GetRoutes
import { getRoutes } from "./routes";

// ** Components
const Error = lazy(() => import("../views/pages/misc/Error"));
// const Login = lazy(() => import('../views/pages/authentication/Login'))
const LoginEmail = lazy(() =>
  import("../views/pages/authentication/slip/LoginEmail")
);
const NotAuthorized = lazy(() => import("../views/pages/misc/NotAuthorized"));
const Email_Reset = lazy(() =>
  import("../views/pages/authentication/slip/Email_Reset")
);
const EmailOTP = lazy(() =>
  import("../views/pages/authentication/slip/EmailOTP")
);
const Mobile_OTP = lazy(() =>
  import("../views/pages/authentication/slip/Mobile_OTP")
);
const Forget_password = lazy(() =>
  import("../views/pages/authentication/slip/Forget_password")
);
const LoginPassword = lazy(() =>
  import("../views/pages/authentication/slip/LoginPassword")
);
const Router = () => {
  const { layout } = useLayout();

  const allRoutes = getRoutes(layout);
  const getHomeRoute = () => {
    const user = getUserData();
    if (user) {
      return getHomeRouteForLoggedInUser(
        user.isSubUser === false ? "" : user.role
      );
    } else {
      return "/login";
    }
  };

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate replace to={getHomeRoute()} />,
    },
    {
      path: "/login",
      element: <BlankLayout />,

      children: [{ path: "/login", element: <LoginEmail /> }],
    },
    {
      path: "/login_password",
      element: <BlankLayout />,
      children: [{ path: "/login_password", element: <LoginPassword /> }],
    },
    {
      path: "/Email_Reset",
      element: <BlankLayout />,
      children: [{ path: "/Email_Reset", element: <Email_Reset /> }],
    },
    {
      path: "/mobile_otp",
      element: <BlankLayout />,
      children: [{ path: "/mobile_otp", element: <Mobile_OTP /> }],
    },
    {
      path: "/EmailOTP",
      element: <BlankLayout />,
      children: [{ path: "/EmailOTP", element: <EmailOTP /> }],
    },

    {
      path: "/auth/not-auth",
      element: <BlankLayout />,
      children: [{ path: "/auth/not-auth", element: <NotAuthorized /> }],
    },
    {
      path: "*",
      element: <BlankLayout />,
      children: [{ path: "*", element: <Error /> }],
    },
    ...allRoutes,
  ]);

  return routes;
};

export default Router;
