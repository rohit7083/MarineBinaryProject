import React, { Fragment, useEffect, useState } from "react";

// ** Thirdparty Component
import InputNumber from "rc-input-number";

// ** Icon
import { Home, Users, Plus, Minus, Book, BookOpen } from "react-feather";

// ** Form Controller
import { Controller } from "react-hook-form";

// ** Reactstrap
import {
  Badge,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

// ** Styles
import "@styles/react/libs/input-number/input-number.scss";

const RoomCard = (props) => {
  const {
    fieldsDetail,
    roomsList,
    setBookRooms,
    control,
    index,
    watch,
    setValue,
    getValues,
    errors,
    isDisabled
  } = props;

  const {
    grandTotalPrice,
    totalNoOfDays,
    roomAndBreakFast,
    roomAndAllMeal,
    taxValue,
  } = fieldsDetail;

  const isBooked = watch(`roomUnit.${index}.fields.isBooked`);
  // console.log("roomsList", roomsList);

  // const calculateTotal = (serviceAmout, tax) =>
  //   serviceAmout + serviceAmout / tax;

  const calculateTotal = (amount, tax) => {
    if (!tax || tax === 0) return amount;
    const total = amount + (amount * tax) / 100;
    return Math.round(total * 100) / 100; // Rounds to 2 decimal places
  };

  // useEffect(() => {
  //   const serviceSelected = watch(`roomUnit.${index}.fields.seviceType`);
  //   let basePrice = 0;

  //   if (serviceSelected === "room-breakfast") {
  //     basePrice = calculateTotal(roomAndBreakFast, taxValue);
  //   } else if (serviceSelected === "room-only") {
  //     basePrice = calculateTotal(grandTotalPrice, taxValue);
  //   } else if (serviceSelected === "room-meals") {
  //     basePrice = calculateTotal(roomAndAllMeal, taxValue);
  //   }

  //   setValue(`roomUnit.${index}.fields.baseAmount`, basePrice);
  //   setValue(`roomUnit.${index}.fields.amount`, basePrice);
  // }, [watch(`roomUnit.${index}.fields.seviceType`)]);

  //this is only for Extra people
  useEffect(() => {
    const serviceSelected = watch(`roomUnit.${index}.fields.seviceType`);
    let basePrice = 0;

    if (serviceSelected === "room-breakfast") {
      basePrice = calculateTotal(roomAndBreakFast, taxValue);
    } else if (serviceSelected === "room-only") {
      basePrice = calculateTotal(grandTotalPrice, taxValue);
    } else if (serviceSelected === "room-meals") {
      basePrice = calculateTotal(roomAndAllMeal, taxValue);
    }

    if (!taxValue || taxValue === 0) {
      basePrice = Math.round(
        serviceSelected === "room-breakfast"
          ? roomAndBreakFast
          : serviceSelected === "room-only"
          ? grandTotalPrice
          : roomAndAllMeal
      );
    }

    // ✅ Round to 2 decimal places (or integer)
    const roundedPrice = Math.round(basePrice * 100) / 100;

    setValue(`roomUnit.${index}.fields.baseAmount`, roundedPrice);
    setValue(`roomUnit.${index}.fields.amount`, roundedPrice);
  }, [watch(`roomUnit.${index}.fields.seviceType`), taxValue]);

  const noOfPeople = watch(`roomUnit.${index}.fields.noOfExtraPeople`);

  useEffect(() => {
    let weekPrice = 0;
    let weekendPrice = 0;
    let totalExtraAmt = 0;

    weekPrice =
      fieldsDetail?.weekdayCount *
      fieldsDetail?.additionalPersonRoomOnlyWeekdays;
    weekendPrice =
      fieldsDetail?.weekendCount *
      fieldsDetail?.additionalPersonRoomOnlyWeekend;

    const baseAmount = getValues(`roomUnit.${index}.fields.baseAmount`) || 0;
    if (
      fieldsDetail?.fields?.seviceType === "room-only" &&
      fieldsDetail?.fields?.isExtraPeople
    ) {
      totalExtraAmt = noOfPeople * (weekPrice + weekendPrice);

      console.log(totalExtraAmt);
    } else if (
      fieldsDetail?.fields?.seviceType === "room-breakfast" &&
      fieldsDetail?.fields?.isExtraPeople
    ) {
      totalExtraAmt =
        noOfPeople *
        (weekPrice +
          weekendPrice +
          fieldsDetail?.additionalPersonBreakfast *
            fieldsDetail?.totalNoOfDays);
    } else if (
      fieldsDetail?.fields?.seviceType === "room-meals" &&
      fieldsDetail?.fields?.isExtraPeople
    ) {
      totalExtraAmt =
        noOfPeople *
        (weekPrice +
          weekendPrice +
          fieldsDetail?.additionalPersonAllMeal * fieldsDetail?.totalNoOfDays);
    }

    totalExtraAmt = totalExtraAmt + totalExtraAmt / taxValue;

    const newTotal = baseAmount + totalExtraAmt;
    setValue(`roomUnit.${index}.fields.amount`, newTotal);
  }, [
    fieldsDetail?.fields?.isExtraPeople,
    watch(`roomUnit.${index}.fields.noOfExtraPeople`),
    watch(`roomUnit.${index}.fields.seviceType`),
  ]);

  useEffect(() => {
    const bookedRooms = roomsList.filter(
      (room) => room?.fields?.isBooked === true
    );
    setBookRooms(bookedRooms);
  
  }, [
    fieldsDetail?.fields?.isBooked,
    watch(`roomUnit.${index}.fields.seviceType`),
    watch(`roomUnit.${index}.fields.isBooked`),
    noOfPeople,
  ]);

  return (
    <Card className={`shadow ${isBooked ? "border border-success" : ""}`}>
      <div className="d-flex mt-1 mx-1 justify-content-between align-items-center">
        <Badge color="primary" className="me-auto">
          Room {" "}
          {fieldsDetail?.roomNumber}
        </Badge>

        {fieldsDetail?.fields?.isBooked ? (
          <Badge color="danger" className="ms-auto">
            Booked
          </Badge>
        ) : (
          <Badge color="success" className="ms-auto">
            Available
          </Badge>
        )}
      </div>

      <CardBody>
        {/* <Form onSubmit={handleSubmit(onSubmit)}> */}
        <div className="d-flex align-items-center mb-1">
          <Home size={16} className="me-2 text-secondary" />
          <span>
            Room Type
            <strong> {fieldsDetail?.roomTypeName}</strong>
          </span>
        </div>
        <div className="d-flex align-items-center mb-2">
          <Users size={16} className="me-2 text-secondary" />
          <span>Up to {fieldsDetail?.peopleCapacity} people</span>
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
              render={({ field }) => (
                <Fragment>
                  <Input type="radio" {...field} value="room-only" disabled={isDisabled}/>
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
              render={({ field }) => (
                <Fragment>
                  <Input type="radio" {...field} value="room-breakfast" disabled={isDisabled}/>
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
              render={({ field }) => (
                <Fragment>
                  <Input type="radio" {...field} value="room-meals" disabled={isDisabled}/>
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
              name={`roomUnit.${index}.fields.isExtraPeople`}
              render={({ field }) => (
                <Fragment>
                  <Input type="checkbox" {...field} className="me-1" disabled={isDisabled} />
                </Fragment>
              )}
            />
            <Label check className="mb-0">
              Extra People
            </Label>
          </div>
          {watch(`roomUnit.${index}.fields.isExtraPeople`) ? (
            <div className="item-quantity mt-1">
              <Controller
                control={control}
                name={`roomUnit.${index}.fields.noOfExtraPeople`}
                render={({ field }) => (
                  <Fragment>
                    <InputNumber
                      {...field}
                      min={0}
                      max={fieldsDetail?.peopleCapacity - 2}
                      upHandler={<Plus />}
                      onChange={(value) => field.onChange(value)}
                      downHandler={<Minus />}
                      disabled={isDisabled}
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
            <span className="text-muted small">
              {" "}
              ( including tax {fieldsDetail?.taxValue}%)
            </span>
          </div>
        </div>

        {fieldsDetail?.fields?.seviceType ? (
          <>
            <div className="text-muted small">
              {/* ${fieldsDetail.totalNoOfDays || 0}/night •{" "} */}
              {fieldsDetail?.fields?.seviceType} <br />
              {fieldsDetail?.fields?.seviceType && (
                <>
                  {" "}
                  {`2 People • ${
                    fieldsDetail?.totalNoOfDays === 1
                      ? "1 night"
                      : `${fieldsDetail?.totalNoOfDays} nights `
                  } • $
                       ${(
                    fieldsDetail?.fields?.baseAmount /
                    (1 + fieldsDetail?.taxValue / 100)
                  ).toFixed(2)} + $${(
                    fieldsDetail?.fields?.baseAmount -
                    fieldsDetail?.fields?.baseAmount /
                      (1 + fieldsDetail?.taxValue / 100)
                  ).toFixed(2)} (Tax Value)
                  `}{" "}
                </>
              )}
              <br />
              {fieldsDetail?.fields?.isExtraPeople === true &&
                `${
                  fieldsDetail?.fields?.noOfExtraPeople || 0
                }${" "}Extra People • $${
                  fieldsDetail?.fields?.amount -
                  fieldsDetail?.fields?.baseAmount
                }`}
            </div>
          </>
        ) : null}
        {/* Book Button */}
        <div className="mt-2 text-end">
          <Button
            color={isBooked ? "success" : "primary"}
            size="sm"
            type="button"
            disabled={isDisabled}
            onClick={() =>
              setValue(
                `roomUnit.${index}.fields.isBooked`,
                !getValues(`roomUnit.${index}.fields.isBooked`)
              )
            }
          >
            {!isBooked ? "Book" : "Booked"}
          </Button>
        </div>
        {/* </Form> */}
      </CardBody>
    </Card>
  );
};

export default RoomCard;
