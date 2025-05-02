// ** Structure List Acording To Form;
export const structurePermissionList = (list) => {
  
    const indexes = {
      CREATE: 0,
      VIEW: 1,
      UPDATE: 2,
      DELETE: 3,
    };
  

    // const data=(Object.groupBy(list, "moduleName"));


    const hash = new Map();
  
    for (let i = 0; i < list.length; i++) {
      const { moduleName: key } = list[i];
      if (hash.has(key)) {
        insertData(key, list[i]);
      } else {
        hash.set(key, []);
        insertData(key, list[i]);
      }
    }
  
    function insertData(key, moduleObject) {
      const { action, uid, id } = moduleObject;
      const list = hash.get(key)
  ;
      const data = {
        action,
        uid,
        isSelected: false,
        id,
      };
      list[indexes[action]] = data;
  
      hash.set(key, list);
    }
  
    return Object.fromEntries(hash);
  };
  
  export const extractUIDFromPermissionList = (data) => {
    const { roleName } = data;
    delete data.roleName;
  
    // const permission = Object.keys(data)
    //   .reduce((arr, category) => {
    //     if (category == "uid") return arr;
    //     const selectAction = data[category]
    //       ? data[category]
    //           .filter((action) => action.isSelected)
    //           .map((action) => action.uid)
    //       : [];
    //     if (selectAction.length) arr.push([...selectAction]);
    //     return arr;
    //   }, [])
    //   .flat();
    const permission = Object.keys(data)
    .reduce((arr, category) => {
      if (category === "uid") return arr;
      const selectAction = data[category]
        ? data[category]
            .filter((action) => action && action.isSelected) // <-- SAFE FILTER
            .map((action) => action.uid)
        : [];
      if (selectAction.length) arr.push([...selectAction]);
      return arr;
    }, [])
    .flat();
  
    console.log({ permission });
    return {
      roleName,
     
      permissionIds: permission.filter((item) => item),
    };
  };
  
  export const handleUpdatePermissionList = (

    permissionIds = [],
    permissionList = []
  ) => {
    
    if (!permissionIds || !permissionList) return [];
  
    const permissionIdsUpdated = permissionIds.reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {});
  
    const updatedList = { ...permissionList };
    Object.keys(updatedList).forEach((key) => {
      updatedList[key] = updatedList[key].map((obj) => {
        if (permissionIdsUpdated?.[obj.id]) {
          obj.isSelected = true;
          return obj;
        } else {
          return obj;
        }
      });
    });

  

    for (const key in updatedList) {
       for(let i=0;i<4;i++){
        if(!updatedList[key][i])
          updatedList[key][i] =null;
       }
    }
// {{debugger}}


    return updatedList;
    // console.log({ permissionIdsUpdated, permissionList });
  };
  
  // **
  /*
  {
      "roleName":"invoiceee",
      "permissionIds":["2feb47e0-90ed-47f2-aacb-b4b08091afcf","f72be25f-c7cf-471c-8d25-66e8b9526c35"]
  }
  */
  /*
  
  {permissionsData[category].map(({ action, uid }) => (
                          <div key={uid}>
                              <Controller
                                  name={`${category}.${action}.isSelected`}
                                  control={control}
                                  render={({ field }) => (
                                      <label>
                                          <input
                                              type="checkbox"
                                              checked={field.value}
                                              onChange={(e) => field.onChange(e.target.checked)}
                                          />
                                          {action}
                                      </label>
                                  )}
                              />
                          </div>
                      ))}
  
  */