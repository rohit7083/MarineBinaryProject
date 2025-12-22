// ** Vertical Menu Components
import { isPageLocked } from "../../../../../auth/utils";
import VerticalNavMenuGroup from "./VerticalNavMenuGroup";
import VerticalNavMenuLink from "./VerticalNavMenuLink";
import VerticalNavMenuSectionHeader from "./VerticalNavMenuSectionHeader";

// ** Utils
import {
  canViewMenuGroup,
  canViewMenuItem,
  resolveVerticalNavMenuItemComponent as resolveNavItemComponent,
} from "@layouts/utils";
// import { isPageLocked } from "@utils";


const VerticalMenuNavItems = (props) => {
  // ** Components Object
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader,
  };

  
  
  // ** Render Nav Menu Items
  const RenderNavItems = props.items.map((item, index) => {
    const TagName = Components[resolveNavItemComponent(item)];
    if (item.children) {
      return (
        canViewMenuGroup(item) && (
          <TagName item={item} index={index} key={item.id} {...props} isPageLocked={isPageLocked(item.resource)}/>
        )
      );
    }
    return (
      canViewMenuItem(item) && (
        <TagName key={item.id || item.header} item={item} {...props}  isPageLocked={isPageLocked(item.resource)} />
      )
    );
  });

  return RenderNavItems;
};

export default VerticalMenuNavItems;
