// ** React Imports
import React, { Fragment, useEffect } from "react";

import { useFieldArray, useForm } from "react-hook-form";

import { Button, Col, Form, Row } from "reactstrap";
import RoomCard from "./RoomCard";

const defaultFields = {
  uid: "",

  noOfExtraPeople: 0,
  amount: 0,
  seviceType: null,
  isBooked: false,
  isExtraPeople: false,
};

const SearchRooms = ({ allRooms, searchField }) => {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      checkInDate: "",
      checkOutDate: "",
      numberOfDays: 0,
      numberOfGuests: 0,
      roomUnit: [],
    },
  });

  const { fields: roomsList } = useFieldArray({
    control,
    name: "roomUnit",
  });

  useEffect(() => {
    if (allRooms && allRooms.length) {
      const updatedList = allRooms.map((r) => ({
        ...r,
        fields: defaultFields,
      }));
      reset({
        ...searchField,
        roomUnit: updatedList,
      });
    }
    return () => reset();
  }, [reset, allRooms]);

  const handleRoom = (data, index, flagRef) => {
    const { fields, value, totalNoOfDays } = data;
    const { isBooked, amount, noOfExtraPeople, isExtraPeople } = fields;

    if (isBooked && !amount) {
      setError(`roomUnit.${index}.fields.seviceType`, {
        message: "Please select a service type.",
      });
      flagRef.hasError = true;
    }

if(isBooked)

    return {
      uid: value,
      amount,
      noOfExtraPeople,
      isExtraPeople,
    };
  };

  const onSubmit = (data) => {
    {{debugger}}
   
    const { roomUnit } = data;

    const flagRef = { hasError: false };

 data.roomUnit= roomUnit.filter((item, index) => handleRoom(item, index, flagRef));

    if (flagRef.hasError) {
      return; // Prevent submission
    }

    // send data as it is.

  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        {roomsList.length ? (
          <Fragment>
              <Row className="align-items-center mb-3 mt-1">
            <Col className="d-flex align-items-center">
              <CardTitle className="fs-2 fw-bold mb-0">
                Available Rooms ({roomsList.length})
              </CardTitle>
            </Col>
            <Col className="d-flex justify-content-end">
              <Input
                className="dataTable-filter"
                name="search"
                placeholder="Search..."
                type="text"
                bsSize="sm"
                id="search-input"
                // onChange={(e) => debouncedFilter(e.target.value)}
              />
            </Col>
          </Row>


            {roomsList.map((fields, index) => (
              <Col sm="12" md="6" lg="4" key={index}>
                <RoomCard
                  fieldsDetail={fields}
                  control={control}
                  index={index}
                  watch={watch}
                  setValue={setValue}
                  getValues={getValues}
                  errors={errors}
                />
              </Col>
            ))}
            <Col sm="12" className={"d-flex justify-content-end"}>
              <Button color={"primary"}>submit</Button>
            </Col>
          </Fragment>
        ) : null}
      </Row>
    </Form>
  );
};

export default SearchRooms;
