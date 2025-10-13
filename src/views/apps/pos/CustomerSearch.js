import useJwt from "@src/auth/jwt/useJwt";
import { selectThemeColors } from "@utils";
import { useEffect, useState } from "react";
import { Plus, Search } from "react-feather";
import Select from "react-select";

import { Button, Card, CardBody, CardTitle, Spinner } from "reactstrap";

import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import CreateCustomerModal from "./modal/CreateCustomerModal";
import SearchCustomerModal from "./modal/SearchCustomerModal";
import { checkCustomerSelected } from "./store";
import { handleAddCustomer } from "./store/cartSlice";

const CustomerSearch = () => {
  // ** State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [walkiLoading, setWalkinLoading] = useState(false);

  // ** Hook
  const dispatch = useDispatch();
  const { data, error, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await useJwt.getAllCustomers();
      return res?.data?.content?.result || [];
    },
  });

  const options =
    data?.map((c) => ({
      value: c.uid,
      label: `${c.firstName} ${c.lastName} (${c?.phoneNumber})`,
      // phoneNumber: c?.phoneNumber,
      emailId: c?.emailId,
    })) || [];

  useEffect(() => {
    if (selectedCustomer) {
      dispatch(checkCustomerSelected(true));
      dispatch(handleAddCustomer(selectedCustomer));
    } else {
      dispatch(checkCustomerSelected(false));
      dispatch(handleAddCustomer({}));
    }
  }, [selectedCustomer]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleModalSearch = () => {
    setSearchModal(!searchModal);
  };

  const handleWalkin = async () => {
    try {
      setWalkinLoading(true);
      const res = await useJwt.getWalkinCustomer();
      const walkinData = res?.data || null;
      if (walkinData) {
        setSelectedCustomer(walkinData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setWalkinLoading(false);
    }
  };

  // useEffect(()=>{

  //   console.log("selectedCustomer",selectedCustomer);
  // },[selectedCustomer])

  return (
    <>
      <Card>
        <CardBody>
          <div className="d-flex align-items-center gap-2">
            <div className="flex-grow-1">
              <Select
                isClearable={true}
                theme={selectThemeColors}
                name="cutomer"
                placeholder="Select Customer"
                className="react-select"
                classNamePrefix="select"
                options={options}
                onChange={(val) => {
                  setSelectedCustomer(val);
                }}
              />
            </div>

            {/* Buttons inline with Select */}
            <div className="d-flex gap-1">
              <Button.Ripple
                outline
                color="primary"
                className="btn-icon"
                onClick={toggleModal}
              >
                <Plus size={14} />{" "}
              </Button.Ripple>
              <Button.Ripple
                outline
                color="primary"
                className="btn-icon"
                onClick={toggleModalSearch}
              >
                <Search size={14} />
              </Button.Ripple>
            </div>
          </div>
          <Button
            className={"mt-2"}
            color={"primary"}
            onClick={(e) => handleWalkin()}
            size={"sm"}
            disabled={walkiLoading}
          >
            {walkiLoading ? (
              <>
                Loading... <Spinner size="sm" />
              </>
            ) : (
              " Walk-In Customer"
            )}
          </Button>

          <div className="">
            <small>
              <CardTitle className="mb-0 mt-1">
                Selected Customer Info:
              </CardTitle>

              <div className="">
                <strong>Customer Name:</strong>
                <br />
                <span>
                  {selectedCustomer?.firstName && selectedCustomer?.lastName
                    ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                    : selectedCustomer?.label}

                  {selectedCustomer
                    ? selectedCustomer.customerName
                      ? `(${selectedCustomer.customerName} : ${selectedCustomer.phoneNumber})`
                      : ` ${selectedCustomer.phoneNumber || ""}`
                    : ""}
                </span>
              </div>

              <div className="">
                <strong>Customer Email:</strong>
                <br />
                <span>{selectedCustomer?.emailId || "N/A"}</span>
              </div>
            </small>
          </div>
        </CardBody>
      </Card>
      <CreateCustomerModal
        toggleModal={toggleModal}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        showModal={showModal}
      />
      <SearchCustomerModal
        toggleModalSearch={toggleModalSearch}
        searchModal={searchModal}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        customerAPidata={data}
      />
    </>
  );
};

export default CustomerSearch;
