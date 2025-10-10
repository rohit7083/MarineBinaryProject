import useJwt from "@src/auth/jwt/useJwt";
import { useQuery } from "@tanstack/react-query";
import { selectThemeColors } from "@utils";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import {
  Button,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

const SearchCustomerModal = ({
  searchModal,
  toggleModalSearch,
  onSelectCustomer,
  selectedCustomer,
  setSelectedCustomer,
  customerAPidata,
}) => {
  const { control, handleSubmit, reset, watch } = useForm();
  const [formValues, setFormValues] = useState({});
  const [memName, setMemberName] = useState([]);
  // 🔍 API call
  const searchCustomers = async (filters) => {
    return await useJwt.SearchCustomer(filters); // must return array
  };

  const {
    data: results,
    isFetching,
    refetch,
    error,
  } = useQuery({
    queryKey: ["searchCustomers", formValues],
    queryFn: () => searchCustomers(formValues),
    enabled: false,
  });

  const onSubmit = (data) => {
    setFormValues(data);
    refetch();
  };

  const options = Array.isArray(customerAPidata)
    ? customerAPidata.map((c) => ({
        value: c.uid,
        label: `${c.phoneNumber}`,
        name: `${c.firstName} ${c.lastName}`,
        emailId: c?.emailId,
        type:"member",
      }))
    : []; 

  useEffect(() => {
    console.log('selectedCustomer',selectedCustomer);
  }, [watch("customerNumber"), options]);

  const fetchData = async () => {
    try {
      const response = await useJwt.getslip();

      const memberName = response.data.content.result
        .filter(
          (item) =>
            item.member && (item.member.firstName || item.member.lastName)
        )
        .map((item) => ({
          value: item.member?.uid,
          label: `${item.member?.firstName || ""} ${
            item.member?.lastName || ""
          } (${item.member?.countryCode || ""} ${
            item.member?.phoneNumber || ""
          })`.trim(),

          emailId: item.member?.emailId,
          details: item.member,
          ...item,
           type:"member",
        }));

      setMemberName(memberName);

    } catch (error) {
      console.error("Error fetching slip details:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error fetching member details. Please try again.",
        life: 4000,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const slipNames = memName?.map((x) => ({
    label: `${x?.slipName} `,
    value: x?.uid,
    customerName:`${x.member?.firstName}${x.member?.lastName}`,
    phoneNumber: `${x.member?.countryCode} ${x.member?.phoneNumber}`,
    emailId: x.member?.emailId,
     type:"slipMember",
  }));

  return (
    <Modal
      isOpen={searchModal}
      toggle={toggleModalSearch}
      className="modal-dialog-centered"
      size="lg"
    >
      <ModalHeader toggle={toggleModalSearch}>🔍 Search Customer</ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        {/* Search Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
          <Row className="gy-1 gx-2">
            <Col md={5}>
              <Label htmlFor="slipNumber">Slip Name</Label>
              <Controller
                name="slipNumber"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable
                    theme={selectThemeColors}
                    placeholder="Search Slip Name"
                    className="react-select"
                    classNamePrefix="select"
                    options={slipNames}
                    onChange={(val) => {
                      setSelectedCustomer(val);
                    }}
                  />
                )}
              />
            </Col>
            <Col md={5}>
              <Label htmlFor="customerNumber">Search Member</Label>
              <Controller
                name="customerNumber"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable
                    theme={selectThemeColors}
                    placeholder="Search Member Name"
                    className="react-select"
                    classNamePrefix="select"
                    options={memName}
                    onChange={(val) => {
                      setSelectedCustomer(val);
                    }}
                  />
                )}
              />
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button
                color="primary"
                type="submit"
                block
                onClick={toggleModalSearch}
              >
                select
              </Button>
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default SearchCustomerModal;
