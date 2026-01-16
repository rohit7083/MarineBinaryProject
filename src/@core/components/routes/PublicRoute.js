// ** React Imports
import { Suspense } from "react";
import { Navigate } from "react-router-dom";

// ** Utils
import { getHomeRouteForLoggedInUser, getUserData } from "@utils";

const PublicRoute = ({ children, route }) => {

  if (route) {
    const user = getUserData();

    const restrictedRoute = route.meta && route.meta.restricted;

    if (user && restrictedRoute) {
      debugger;
      return <Navigate to={getHomeRouteForLoggedInUser(
       
        user.isSubUser === false ? "" : user.role
      )} />;
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>;
};

export default PublicRoute;

