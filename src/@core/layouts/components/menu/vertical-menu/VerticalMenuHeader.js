// ** React Imports
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

// ** Icons Imports
import { Circle, Disc, X } from "react-feather";

// ** Config
import themeConfig from "@configs/themeConfig";
// ** Utils
import { getHomeRouteForLoggedInUser, getUserData } from "@utils";
import { useSelector } from "react-redux";

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
  } = props;

  // ** Vars
  const user = getUserData();
  const companyDetails = useSelector((store) => store.auth.companyDetails);
  const companyLogo = useSelector((store) => store.auth.companyLogo);

    const appName = companyDetails ? companyDetails?.companyShortName : "";


  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      );
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      );
    }
  };

  
  const logoSrc =
    typeof companyLogo === "string" && companyLogo.trim().length > 0
      ? companyLogo
      : themeConfig.app.appLogoImage;
  return (
    <div className="navbar-header">
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item me-auto">
          <NavLink
            to={user ? getHomeRouteForLoggedInUser("admin") : "/"}
            className="navbar-brand"
          >
            <span className="brand-logo">
              <img
                // src={companyLogo.length >0 ? companyLogo :themeConfig.app.appLogoImage}
                src={logoSrc}
                style={{
                  height: themeConfig.app.appLogoSize.height,
                  width: themeConfig.app.appLogoSize.width,
                }}
                alt={"LOgo"}
              />
            </span>
            <h2
              className="brand-text mb-0"
              style={{
                marginLeft: "-10px",
              }}
            >
              {appName ? appName : themeConfig.app.appName}
            </h2>
          </NavLink>
        </li>
        <li className="nav-item nav-toggle">
          <div className="nav-link modern-nav-toggle cursor-pointer">
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default VerticalMenuHeader;
