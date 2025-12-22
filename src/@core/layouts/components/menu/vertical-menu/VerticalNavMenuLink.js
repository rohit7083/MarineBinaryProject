// ** React Imports
import { NavLink, useLocation } from "react-router-dom";

// ** Third Party Components
import classnames from "classnames";
import { useTranslation } from "react-i18next";

// ** Reactstrap Imports
import { Badge } from "reactstrap";
// import LockModal from '../../../../../views/dashboard/upgrade/'
const VerticalNavMenuLink = ({ item, activeItem ,isPageLocked}) => {
  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? "a" : NavLink;

  // ** Hooks
  const { t } = useTranslation();
  const {pathname}=useLocation()

// ** Link Props
  // const linkProps = isPageLocked
  // ? {
  //     to: '/upgradeModules',
  //       // className: "d-flex align-items-center",
  //       state:{
  //         lastClickedNavlink:item.navLink,
  //         lastPath:pathname
  //       }
  //   }
  // : item.externalLink
  // ? {
  //     href: item.navLink || "/",
  //   }
  // : {
  //     to: item.navLink || "/",
  //     className: ({ isActive }) =>
  //       isActive && !item.disabled 
  //         ? "d-flex align-items-center active"
  //         : "d-flex align-items-center",
  //   };

    


  return (
    <li
      className={classnames({
        "nav-item": !item.children,
        disabled: item.disabled ,
        active: item.navLink === activeItem ,
      })}
    >
      <LinkTag
        className="d-flex align-items-center"
        target={item.newTab ? "_blank" : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
              href: item.navLink || "/",
            }
          : {
              to: item.navLink || "/",
              className: ({ isActive }) => {
                if (isActive && !item.disabled) {
                  return "d-flex align-items-center active";
                }
              },
            })}
        // {...linkProps}
        onClick={(e) => {
      
          
          if (
            item.navLink.length === 0 ||
            item.navLink === "#" ||
            item.disabled === true
          ) {
            e.preventDefault();
          }
        }}
      >
        {item.icon}
        <span className="menu-item text-truncate">{t(item.title)}</span>
{isPageLocked?' 🔒':null}
        {item.badge && item.badgeText ? (
          <Badge className="ms-auto me-1" color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  );
};

export default VerticalNavMenuLink;
