import useJwt from "@src/auth/jwt/useJwt";
import { useEffect, useState } from "react";
import { Plus, Search } from "react-feather";

import { Button, Card, CardBody } from "reactstrap";

import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import CreateCustomerModal from "./modal/CreateCustomerModal";
import SearchCustomerModal from "./modal/SearchCustomerModal";
import { checkCustomerSelected } from "./store";

const CustomerSearch = () => {
  // ** State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
        const [searchModal, setSearchModal] = useState(false);

  
  // ** Hook
  const dispatch = useDispatch();
  const { data, error, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await useJwt.getAllCustomers();
      return res?.data?.content?.result || [];
    },
  });

  useEffect(() => {
    if (data) {
      setSelectedCustomer(data);
    }
  }, [data]);

  const options =
    data?.map((c) => ({
      value: c.uid,
      label: `${c.firstName} ${c.lastName}`,
    })) || [];

  useEffect(() => {
    if (selectedCustomer) {
      dispatch(checkCustomerSelected(true));
    } else {
      dispatch(checkCustomerSelected(false));
    }
  }, [selectedCustomer]);
    const toggleModal = () => {
    setShowModal(!showModal);
    modalReset();
  };

   const toggleModalSearch = () => {
    setSearchModal(!searchModal);
    modalReset();
  };
  
  return (
    <>
      <Card>
        <CardBody className="d-flex align-items-center gap-2">
          {/* Select takes available space */}
          <div className="flex-grow-1">
            {/* <Select
              isClearable={false}
              theme={selectThemeColors}
              name="categories"
              placeholder="Select Customer"
              className="react-select"
              classNamePrefix="select"
              options={options}
              onChange={(val) => setSelectedCustomer(val)}
            /> */}

            
          </div>

          {/* Buttons inline with Select */}
          <div className="d-flex gap-1">
            <Button.Ripple outline color="primary" className="btn-icon"  onClick={toggleModal}>
              <Plus size={14} />
            </Button.Ripple>
            <Button.Ripple outline color="primary" className="btn-icon" onClick={toggleModalSearch}>
              <Search size={14} />
            </Button.Ripple>
          </div>
        </CardBody>
      </Card>
      <CreateCustomerModal toggleModal={toggleModal} showModal={showModal}  />
      <SearchCustomerModal toggleModalSearch ={toggleModalSearch}  searchModal={searchModal} />
    </>
  );
};

export default CustomerSearch;

/*
  <Row className="">
            <Col sm="6">
              <Label className="form-label">Search By Name</Label>

             
            </Col>

            <Col sm="6">
              {" "}
              <Label className="form-label">Search By Phone No</Label>
              <Select
                isClearable={false}
                isMulti
                theme={selectThemeColors}
                name="categories"
                // value={selectedCategories}
                // onChange={(val) => setSelectedCategories(val || [])}
                // options={categories}
                className="react-select"
                classNamePrefix="select"
              />
            </Col>
          </Row>

          <Row className="mt-2">
            <Col
              md="6"
              className="text-center"
            >
              
              <Button
                color="primary"
                size="sm"
                style={{ width: "150px" }}
               className="mt-1"
              >
                Add Customer
              </Button>
            </Col>
            <Col>
              <Button
                color="primary"
                size="sm"
                style={{ width: "150px" }}
                className="mt-1"
              >
                Walk-In Customer
              </Button>
            </Col>
          </Row>
*/
