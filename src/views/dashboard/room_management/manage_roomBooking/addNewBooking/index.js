// import React, { Fragment, useRef } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { Navigate, useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Toast } from "primereact/toast";
// import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
// import "flatpickr/dist/themes/airbnb.css";
// import Flatpickr from "react-flatpickr";
// import SearchRoom from "../addNewBooking/SearchRooms";
// import  formatDate  from "flatpickr";
// import "flatpickr/dist/themes/material_blue.css"; // or your preferred style

// import {
//   Card,
//   CardBody,
//   CardText,
//   CardTitle,
//   Col,
//   Label,
//   Input,
//   Button,
//   FormGroup,
//   Spinner,
//   FormFeedback,
//   CardHeader,
//   Row,
// } from "reactstrap";
// import useJwt from "@src/auth/jwt/useJwt";

// function AddVTypes() {
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const navigate = useNavigate();
//   const location = useLocation();
//   const rowData = location.state?.row;
//   const uid = rowData?.uid;
//   const toast = useRef(null);
//   const [loading, setLoading] = useState(false);

//   //   useEffect(() => {
//   //     if (uid) {
//   //       reset({
//   //         typeName: rowData.typeName || "",
//   //         description: rowData.description || "",
//   //       });
//   //     }
//   //   }, []);

//   const onSubmit = async (data) => {
//     {
//       {
//         debugger;
//       }
//     }
//     console.log(data);

//     try {
//       setLoading(true);
//       if (uid) {
//         const res = await useJwt.updateVendor(uid, data);
//         console.log("Updated:", res);
//         {
//           {
//             debugger;
//           }
//         }
//         if (res.status === 200) {
//           toast.current.show({
//             severity: "success",
//             summary: "Updated Successfully",
//             detail: "Vendor Type  updated Successfully.",
//             life: 2000,
//           });
//           setTimeout(() => {
//             navigate("/addNew_room_booking");
//           }, 2000);
//         }
//       } else {
//         const res = await useJwt.SearchRoom(data);
//         if (res.status === 201) {
//           toast.current.show({
//             severity: "success",
//             summary: "Created Successfully",
//             detail: "Vendor Type  created Successfully.",
//             life: 2000,
//           });
//           setTimeout(() => {
//             navigate("/addNew_room_booking");
//           }, 2000);
//         }
//         console.log("Created:", res);
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Fragment>
//       <Toast ref={toast} />

//       <Card>
//         <CardBody>
//           <CardTitle>
//             <CardText>Booking Room Details</CardText>
//           </CardTitle>

//           <form onSubmit={handleSubmit(onSubmit)}>
//             <FormGroup row>

// <Col sm="6" className="mb-1">
//   <Label htmlFor="checkInDate">Check In Date</Label>
//   <Controller
//     name="checkInDate"
//     control={control}
//     rules={{ required: "Check-in date is required" }}
//     render={({ field }) => (
//       <>
//        <Flatpickr
//   id="checkInDate"
//   className={`form-control ${errors.checkInDate ? "is-invalid" : ""}`}
//   options={{
//     altInput: true,
//     altFormat: "Y-m-d",
//     dateFormat: "Y-m-d",
//     minDate: "today",
//   }}
//   value={field.value}
//   onChange={(date) => {
//     const formatted = date?.[0]
//       ? formatDate(date[0], "Y-m-d")
//       : "";
//     field.onChange(formatted);
//   }}
// />
//         {errors.checkInDate && (
//           <FormFeedback>{errors.checkInDate.message}</FormFeedback>
//         )}
//       </>
//     )}
//   />
// </Col>

// <Col sm="6" className="mb-1">
//   <Label htmlFor="checkOutDate">Check Out Date</Label>
//   <Controller
//     name="checkOutDate"
//     control={control}
//     rules={{ required: "Check-out date is required" }}
//     render={({ field }) => (
//       <>
//         <Flatpickr
//           id="checkOutDate"
//           className={`form-control ${errors.checkOutDate ? "is-invalid" : ""}`}
//           options={{
//             altInput: true,
//             altFormat: "Y-m-d",
//             dateFormat: "Y-m-d",
//             minDate: "today", // Disable past dates
//           }}
//           value={field.value}
//   onChange={(date) => {
//     const formatted = date?.[0]
//       ? formatDate(date[0], "Y-m-d")
//       : "";
//     field.onChange(formatted);
//   }}
// />
//         {errors.checkOutDate && (
//           <FormFeedback>{errors.checkOutDate.message}</FormFeedback>
//         )}
//       </>
//     )}
//   />
// </Col>
//               <Col sm="12">
//                 <Label for="numberOfGuests">Number of guest</Label>

//                 <Controller
//                   name="numberOfGuests"
//                   control={control}
//                   defaultValue=""
//                   rules={{ required: "Number of guest is required" }}
//                   render={({ field }) => (
//                     <Input
//                       id="numberOfGuests"
//                       type="number"
//                       rows="4"
//                       placeholder="Enter Number of guest"
//                       invalid={!!errors.numberOfGuests}
//                       {...field}
//                     />
//                   )}
//                 />
//                 {errors.numberOfGuests && (
//                   <FormFeedback>{errors.numberOfGuests.message}</FormFeedback>
//                 )}
//               </Col>
//             </FormGroup>
//             <div className="d-flex justify-content-center ">
//               <Button type="submit" disabled={loading} color="primary">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 26 26"
//                   width="1em"
//                   height="1em"
//                   className="me-1"
//                 >
//                   <path
//                     fill="currentColor"
//                     d="M10 .188A9.81 9.81 0 0 0 .187 10A9.81 9.81 0 0 0 10 19.813c2.29 0 4.393-.811 6.063-2.125l.875.875a1.845 1.845 0 0 0 .343 2.156l4.594 4.625c.713.714 1.88.714 2.594 0l.875-.875a1.84 1.84 0 0 0 0-2.594l-4.625-4.594a1.82 1.82 0 0 0-2.157-.312l-.875-.875A9.812 9.812 0 0 0 10 .188M10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16M4.937 7.469a5.45 5.45 0 0 0-.812 2.875a5.46 5.46 0 0 0 5.469 5.469a5.5 5.5 0 0 0 3.156-1a7 7 0 0 1-.75.03a7.045 7.045 0 0 1-7.063-7.062c0-.104-.005-.208 0-.312"
//                   ></path>
//                 </svg>
//                 {loading ? (
//                   <>
//                     <span>Searching.. </span>
//                     <Spinner size="sm" />{" "}
//                   </>
//                 ) : (
//                   "Search"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </CardBody>
//       </Card>

//       <SearchRoom />
//     </Fragment>
//   );
// }

// export default AddVTypes;

import React, { Fragment, useRef, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "flatpickr/dist/themes/airbnb.css";
import "flatpickr/dist/themes/material_blue.css";

import Flatpickr from "react-flatpickr";

import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Label,
  Input,
  Button,
  FormGroup,
  Spinner,
  FormFeedback,
} from "reactstrap";

import useJwt from "@src/auth/jwt/useJwt";
import SearchRoom from "../addNewBooking/SearchRooms";

function AddVTypes() {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const rowData = location.state?.row;
  const uid = rowData?.uid;
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const [searchedValue,setSearcedValue]=useState(null)

  const [allRooms, setAllrooms] = useState([]);
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");


  useEffect(() => {
    if (uid && rowData) {
      reset({
        checkInDate: rowData.checkInDate || "",
        checkOutDate: rowData.checkOutDate || "",
        numberOfGuests: rowData.numberOfGuests || "",
      });
    }
  }, [uid, rowData, reset]);

  // When checkInDate changes, update checkOutDate min and default if needed
  useEffect(() => {
    if (!checkInDate) return;

    // Parse checkInDate string to Date object
    const [year, month, day] = checkInDate.split("-").map(Number);
    const inDate = new Date(year, month - 1, day);

    // Add one day for minimum checkout
    const outDateMin = new Date(inDate);
    outDateMin.setDate(inDate.getDate() + 1);

    // Format as YYYY-MM-DD string
    const formattedOutMin = `${outDateMin.getFullYear()}-${String(
      outDateMin.getMonth() + 1
    ).padStart(2, "0")}-${String(outDateMin.getDate()).padStart(2, "0")}`;

    // If checkOutDate is empty or less/equal than checkInDate, set it to minimum
    if (!checkOutDate || checkOutDate <= checkInDate) {
      setValue("checkOutDate", formattedOutMin);
    }
  }, [checkInDate, checkOutDate, setValue]);

  const onSubmit = async (data) => {

    try {
      setLoading(true);
      if (uid) {
        const res = await useJwt.updateVendor(uid, data);
        setSearcedValue(data)
        if (res.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Updated Successfully",
            detail: "Vendor Type updated successfully.",
            life: 2000,
          });
          setTimeout(() => navigate("/addNew_room_booking"), 2000);
        }
      } else {
        
        const res = await useJwt.SearchRoom(data);
        console.log("result", res?.data);

        // const AllroomUnits=res?.data?.map((x)=>(return{
        //  lable:x?.roomUnits?.roomNumber,
        //  value:x?.roomUnits?.uid,
        //  available:x?.roomUnits?.available,
        // }))

        // const AllroomUnits = res?.data?.map((x) => {
        //   const {roomNumber,uid,available}=x?.roomUnits
        //   return ( {

        //   label: roomNumber,
        //   value: uid,
        //   available: available,
        // })
        // // });

        const AllroomUnits = res?.data?.flatMap(
          (x) =>
            x?.roomUnits?.map(({ roomNumber, uid, available }) => ({
              label: roomNumber,
              value: uid,
              available: available,

              additionalPersonAllMeal: x?.additionalPersonAllMeal,
              additionalPersonBreakfast: x?.additionalPersonBreakfast,
              additionalPersonRoomOnlyWeekdays:
                x?.additionalPersonRoomOnlyWeekdays,
              additionalPersonRoomOnlyWeekend:
                x?.additionalPersonRoomOnlyWeekend,
              onlyRoomWeekdaysPrice: x?.onlyRoomWeekdaysPrice,
              onlyRoomWeekendPrice: x?.onlyRoomWeekendPrice,
              twoPeopleAllMealPrice: x?.twoPeopleAllMealPrice,
              twoPeopleBreakfastPrice: x?.twoPeopleBreakfastPrice,
              grandTotalPrice: x?.grandTotalPrice,
              totalNoOfDays: x?.totalNoOfDays,
              roomAndBreakFast: x?.roomAndBreakFast,
              roomAndAllMeal: x?.roomAndAllMeal,
              peopleCapacity: x?.roomType?.peopleCapacity,
              roomTypeName: x?.roomType?.roomTypeName,
              taxValue:x?.roomType?.taxValue,
              grandTotalTaxAmount:x?.grandTotalTaxAmount,
              roomAndBreakFastTaxAmount:x?.roomAndBreakFastTaxAmount,
              roomAndAllMealTaxAmount:x?.roomAndAllMealTaxAmount,

              weekdayCount:x?.weekdayCount,
              weekendCount:x?.weekendCount,
              specialDays:x?.specialDays?.price,
            })) || []

        );

        console.log("available", AllroomUnits);

        setAllrooms(AllroomUnits);

        if (res.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Created Successfully",
            detail: "Vendor Type created successfully.",
            life: 2000,
          });
          setTimeout(() => navigate("/addNew_room_booking"), 2000);
        }
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong. Please try again.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date for Flatpickr
  const formatDate = (date) =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`
      : "";

  // Get minDate for checkOutDate picker
  const getCheckOutMinDate = () => {
    if (!checkInDate) return "today";

    const [year, month, day] = checkInDate.split("-").map(Number);
    const inDate = new Date(year, month - 1, day);
    inDate.setDate(inDate.getDate() + 1);
    return formatDate(inDate);
  };

  const rawProductsList = [
    {
      id: 1,
      productName: "Deluxe Room",
    },
    {
      id: 2,
      productName: "Suite Room",
    },
    {
      id: 3,
      productName: "Family Room",
    },
    {
      id: 4,
      productName: "Standard Room",
    },
    {
      id: 5,
      productName: "Presidential Suite",
    },
  ];

  // useEffect(()=>{

  // },[])
  return (
    <Fragment>
      <Toast ref={toast} />
      <Card>
        <CardBody>
          <CardTitle>
            <CardText>Booking Room Details</CardText>
          </CardTitle>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="6" className="mb-1">
                <Label htmlFor="checkInDate">Check In Date</Label>
                <Controller
                  name="checkInDate"
                  control={control}
                  rules={{ required: "Check-in date is required" }}
                  render={({ field }) => (
                    <>
                      <Flatpickr
                        id="checkInDate"
                        className={`form-control ${
                          errors.checkInDate ? "is-invalid" : ""
                        }`}
                        options={{
                          altInput: true,
                          altFormat: "Y-m-d",
                          dateFormat: "Y-m-d",
                          minDate: "today",
                        }}
                        value={field.value}
                        onChange={(date) => {
                          const formatted = date?.[0]
                            ? `${date[0].getFullYear()}-${String(
                                date[0].getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date[0].getDate()
                              ).padStart(2, "0")}`
                            : "";
                          field.onChange(formatted);
                        }}
                      />
                      {errors.checkInDate && (
                        <FormFeedback>
                          {errors.checkInDate.message}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>

              <Col sm="6" className="mb-1">
                <Label htmlFor="checkOutDate">Check Out Date</Label>
                <Controller
                  name="checkOutDate"
                  control={control}
                  rules={{ required: "Check-out date is required" }}
                  render={({ field }) => (
                    <>
                      <Flatpickr
                        id="checkOutDate"
                        className={`form-control ${
                          errors.checkOutDate ? "is-invalid" : ""
                        }`}
                        options={{
                          altInput: true,
                          altFormat: "Y-m-d",
                          dateFormat: "Y-m-d",
                          minDate: getCheckOutMinDate(),
                        }}
                        value={field.value}
                        onChange={(date) => {
                          const formatted = date?.[0]
                            ? `${date[0].getFullYear()}-${String(
                                date[0].getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date[0].getDate()
                              ).padStart(2, "0")}`
                            : "";
                          field.onChange(formatted);
                        }}
                      />
                      {errors.checkOutDate && (
                        <FormFeedback>
                          {errors.checkOutDate.message}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>

              <Col sm="12">
                <Label htmlFor="numberOfGuests">Number of Guests</Label>
                <Controller
                  name="numberOfGuests"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Number of guests is required" }}
                  render={({ field }) => (
                    <Input
                      id="numberOfGuests"
                      type="number"
                      placeholder="Enter Number of guests"
                      invalid={!!errors.numberOfGuests}
                      {...field}
                      min={1}
                    />
                  )}
                />
                {errors.numberOfGuests && (
                  <FormFeedback>{errors.numberOfGuests.message}</FormFeedback>
                )}
              </Col>
            </FormGroup>

            <div className="d-flex justify-content-center">
              <Button type="submit" disabled={loading} color="primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 26 26"
                  width="1em"
                  height="1em"
                  className="me-1"
                >
                  <path
                    fill="currentColor"
                    d="M10 .188A9.81 9.81 0 0 0 .187 10A9.81 9.81 0 0 0 10 19.813c2.29 0 4.393-.811 6.063-2.125l.875.875a1.845 1.845 0 0 0 .343 2.156l4.594 4.625c.713.714 1.88.714 2.594 0l.875-.875a1.84 1.84 0 0 0 0-2.594l-4.625-4.594a1.82 1.82 0 0 0-2.157-.312l-.875-.875A9.812 9.812 0 0 0 10 .188M10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16M4.937 7.469a5.45 5.45 0 0 0-.812 2.875a5.46 5.46 0 0 0 5.469 5.469a5.5 5.5 0 0 0 3.156-1a7 7 0 0 1-.75.03a7.045 7.045 0 0 1-7.063-7.062c0-.104-.005-.208 0-.312"
                  ></path>
                </svg>
                {loading ? (
                  <>
                    <span>Searching.. </span>
                    <Spinner size="sm" />{" "}
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <SearchRoom allRooms={allRooms} searchField={searchedValue} />
    </Fragment>
  );
}

export default AddVTypes;
