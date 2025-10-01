import useJwt from "@src/auth/jwt/useJwt";
import { useQuery } from "@tanstack/react-query";
import { selectThemeColors } from "@utils";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

import {
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row
} from "reactstrap";

const SearchCustomerModal = ({
  searchModal,
  toggleModalSearch,
  onSelectCustomer,
}) => {
  const { control, handleSubmit, reset } = useForm();
  const [formValues, setFormValues] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  const handleCustomerSelect = (e) => {
    const selectedId = e.target.value;
    const cust = results.find((c) => String(c.id) === selectedId);
    setSelectedCustomer(cust);
    if (onSelectCustomer) onSelectCustomer(cust); // callback to parent
  };

  return (
    <Modal
      isOpen={searchModal}
      toggle={toggleModalSearch}
      className="modal-dialog-centered"
      size="lg"
    >
      <ModalHeader toggle={toggleModalSearch}>Search Customer</ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        {/* Search Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="gy-1 gx-2 mt-75">
            <Col md={4}>
              <Label htmlFor="slipNumber">Slip Number</Label>
              <Controller
                name="slipNumber"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable={false}
                    theme={selectThemeColors}
                    placeholder="Select Customer"
                    className="react-select"
                    classNamePrefix="select"
                    // options={options}
                    onChange={(val) => field.onChange(val)} // keeps hook-form in sync
                  />
                )}
              />
            </Col>
            <Col md={4}>
              <Label htmlFor="customerNumber">Customer Number</Label>
              <Controller
                name="customerNumber"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable={false}
                    theme={selectThemeColors}
                    placeholder="Select Customer"
                    className="react-select"
                    classNamePrefix="select"
                    // options={options}
                    onChange={(val) => field.onChange(val)} // keeps hook-form in sync
                  />
                )}
              />
            </Col>
            <Col md={4}>
              <Label htmlFor="customerName">Customer Name</Label>
              <Controller
                name="customerName"
                control={control}
                render={({ field }) => (
                    <Select
                    {...field}
                    isClearable={false}
                    theme={selectThemeColors}
                    placeholder="Select Customer"
                    className="react-select"
                    classNamePrefix="select"
                    // options={options}
                    onChange={(val) => field.onChange(val)} // keeps hook-form in sync
                  />
                )}
              />
            </Col>

          </Row>
        </form>

        {/* Results Dropdown */}
        <div className="mt-3">
          {isFetching && <p>Loading results...</p>}
          {error && (
            <p className="text-danger">Error: {error.message || "Failed"}</p>
          )}
          {results && results.length > 0 && (
            <>
              <Label for="customerSelect">Select Customer</Label>
              <Input
                type="select"
                id="customerSelect"
                onChange={handleCustomerSelect}
                value={selectedCustomer?.id || ""}
              >
                <option value="">-- Select --</option>
                {results.map((cust) => (
                  <option key={cust.id} value={cust.id}>
                    {cust.customerNumber} - {cust.customerName} (Slip:{" "}
                    {cust.slipNumber})
                  </option>
                ))}
              </Input>
            </>
          )}
          {results && results.length === 0 && !isFetching && (
            <p>No results found</p>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default SearchCustomerModal;
