import React, { Fragment, useEffect } from "react";

// ** Thirdparty Component
import InputNumber from "rc-input-number";

// ** Icon
import { Home, Users, Plus, Minus } from "react-feather";

// ** Form Controller
import { Controller } from "react-hook-form";

// ** Reactstrap
import {
  Badge,
  Button,
  Card,
  CardBody,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/input-number/input-number.scss";

const RoomCard = (props) => {
  const { fieldsDetail, control, index, watch, setValue, getValues,errors } = props;

  // ** Prices
  const {
    grandTotalPrice,
    totalNoOfDays,
    roomAndBreakFast,
    roomAndAllMeal,
    taxValue,
  } = fieldsDetail;



  const isBooked=watch(`roomUnit.${index}.fields.isBooked`)

  // ** Calculation
  const calculateTotal = (serviceAmout, noOfDays, tax) =>
    serviceAmout * noOfDays + serviceAmout / tax;



  // ** Handle Calculate
  useEffect(() => {
    const serviceSelected = watch(`roomUnit.${index}.fields.seviceType`);
    if (serviceSelected == "room-breakfast") {
      setValue(
        `roomUnit.${index}.fields.amount`,
        calculateTotal(roomAndBreakFast, totalNoOfDays, taxValue)
      );
    } else if (serviceSelected == "room-only") {
      setValue(
        `roomUnit.${index}.fields.amount`,
        calculateTotal(grandTotalPrice, totalNoOfDays, taxValue)
      );
    } else if (serviceSelected == "room-meals") {
      setValue(
        `roomUnit.${index}.fields.amount`,
        calculateTotal(roomAndAllMeal, totalNoOfDays, taxValue)
      );
    }
  }, [watch(`roomUnit.${index}.fields.seviceType`)]);

  return (
    <Card className={`shadow ${isBooked? 'border border-success' : ''}`}>

      <div className="d-flex mt-1 mx-1 justify-content-between align-items-center">
        <Badge color="primary" className="me-auto">
          Room
          {fieldsDetail?.label}
        </Badge>
        <Badge color="success" className="ms-auto">
          Available
        </Badge>
      </div>

      <CardBody>
        {/* Room Details */}
        <div className="d-flex align-items-center mb-1">
          <Home size={16} className="me-2 text-secondary" />
          <span>
            Room Type
            <strong>{fieldsDetail?.roomTypeName}</strong>
          </span>
        </div>
        <div className="d-flex align-items-center mb-2">
          <Users size={16} className="me-2 text-secondary" />
          <span>
            Up to
            {fieldsDetail?.peopleCapacity}
            people
          </span>
        </div>
        <h6 className="text-muted">Select Service Package:</h6>
        {errors?.roomUnit?.[index]?.fields?.seviceType && (
  <span className="text-danger">
    {errors.roomUnit[index].fields.seviceType.message}
  </span>
)}
        <FormGroup
          check
          className="d-flex justify-content-between align-items-center mb-1"
        >
          <Label check className="d-flex align-items-center">
            <Controller
              control={control}
              name={`roomUnit.${index}.fields.seviceType`}
              render={({ field, fieldState }) => (
                <Fragment>
                  <Input type="radio" {...field} value="room-only" />
                </Fragment>
              )}
            />

            <span className="ms-1 fs-6">Room-only</span>
          </Label>
          <span className="text-primary fw-semibold fs-6">
            $
            {parseInt(
              fieldsDetail?.grandTotalPrice / fieldsDetail?.totalNoOfDays
            )}
            /night
          </span>
        </FormGroup>
        <FormGroup
          check
          className="d-flex justify-content-between align-items-center mb-1"
        >
          <Label check className="d-flex align-items-center">
            <Controller
              control={control}
              name={`roomUnit.${index}.fields.seviceType`}
              render={({ field, fieldState }) => (
                <Fragment>
                  <Input type="radio" {...field} value="room-breakfast" />
                </Fragment>
              )}
            />
            <span className="ms-1 fs-6">Room-Breakfast</span>
          </Label>
          <span className="text-primary fw-semibold fs-6">
            $
            {parseInt(
              fieldsDetail?.roomAndBreakFast / fieldsDetail?.totalNoOfDays
            )}
            /night
          </span>
        </FormGroup>
        <FormGroup
          check
          className="d-flex justify-content-between align-items-center mb-1"
        >
          <Label check className="d-flex align-items-center">
            <Controller
              control={control}
              name={`roomUnit.${index}.fields.seviceType`}
              render={({ field, fieldState }) => (
                <Fragment>
                  <Input type="radio" {...field} value="room-meals" />
                </Fragment>
              )}
            />
            <span className="ms-1 fs-6">Room-Meals</span>
          </Label>
          <span className="text-primary fw-semibold fs-6">
            $
            {parseInt(
              fieldsDetail?.roomAndAllMeal / fieldsDetail?.totalNoOfDays
            )}
            /night
          </span>
        </FormGroup>
        {/* Extra People */}
        <div className="mt-2 d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <Controller
              control={control}
              name={`roomUnit.${index}.fields. isExtraPeople`}
              render={({ field, fieldState }) => (
                <Fragment>
                  <Input type="checkbox" {...field} className="me-1" />
                </Fragment>
              )}
            />
            <Label check className="mb-0">
              Extra People
            </Label>
          </div>
          {watch(`roomUnit.${index}.fields. isExtraPeople`) ? (
            <div className="item-quantity mt-1">
              <Controller
                control={control}
                name={`roomUnit.${index}.fields.noOfExtraPeople`}
                render={({ field, fieldState }) => (
                  <Fragment>
                    <InputNumber
                      {...field}
                      upHandler={<Plus />}
                      downHandler={<Minus />}
                    />
                  </Fragment>
                )}
              />
            </div>
          ) : null}
        </div>
        {/* Total Price */}
        <div className="mt-3">
          <div className="h4 text-primary mb-1">
            <strong>${watch(`roomUnit.${index}.fields.amount`)}</strong>
            <div className="text-muted small">
              (including taxes:
              {fieldsDetail?.taxValue}%)
            </div>
          </div>
        </div>
        {/* Book Button */}
        <div className="mt-2 text-end">
          <Button
            color={isBooked?'success':'primary'}
            size="sm"
            type="button"
            onClick={() =>
              setValue(
                `roomUnit.${index}.fields.isBooked`,
                !getValues(`roomUnit.${index}.fields.isBooked`)
              )
            }
          >
          {!isBooked?'Book':'Booked'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default RoomCard;
