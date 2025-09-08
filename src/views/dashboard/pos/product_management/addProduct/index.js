// ** React Imports
import { useEffect, useRef, useState } from "react";
import ProductAdd from "./ProductAdd";
// ** Custom Components
import Wizard from "@components/wizard";
import { useLocation } from "react-router-dom";
import Add_Specification from "./Add_Specification";
import Heading from "./Heading";
import ProductAdd_Table from "./ProductAdd_Table";

const AddProductIndex = () => {
  // ** Ref
  const ref = useRef(null);
  const [productData, setProductData] = useState({});

  useEffect(()=>{
console.log("product Data from index",productData);

  },[productData])
   const location = useLocation();
  const UpdateData = location?.state?.row;
  // ** State
  const [stepper, setStepper] = useState(null);
  const steps = [
    {
      id: "account-details",
      title: "Product Details",
      subtitle: "Enter Your Account Details.",
      content: (
        <>
          <ProductAdd
          UpdateData={UpdateData}
            setProductData={setProductData}
            stepper={stepper}
            type="wizard-vertical"
          />
        </>
      ),
    },
    {
      id: "personal-info",
      title: "Variation Details",
      subtitle: "Add Personal Info",
      content: (
        <ProductAdd_Table
        UpdateData={UpdateData}
          productData={productData}
          setProductData={setProductData}
          stepper={stepper}
          type="wizard-vertical"
        />
      ),
    },
    {
      id: "step-address",
      title: "Specification Details",
      subtitle: "Add Address",
      content: (
        <Add_Specification
        UpdateData={UpdateData}
          productData={productData}
          setProductData={setProductData}
          stepper={stepper}
          type="wizard-vertical"
        />
      ),
    },
  ];

  return (
    <div className="vertical-wizard">
      <Heading />
      <Wizard
        type="vertical"
        ref={ref}
        steps={steps}
        options={{
          linear: false,
        }}
        instance={(el) => setStepper(el)}
      />
    </div>
  );
};

export default AddProductIndex;
