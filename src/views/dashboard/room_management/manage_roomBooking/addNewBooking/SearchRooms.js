// ** React Imports
import { Fragment, useEffect, useRef, useState } from "react";

import useJwt from "@src/auth/jwt/useJwt";
import { debounce } from "lodash";
import "primeicons/primeicons.css";
import { Toast } from "primereact/toast";

import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, CardTitle, Col, Form, Input, Row, Spinner } from "reactstrap";
import RoomCard from "./RoomCard";
const defaultFields = {
  uid: "",
  noOfExtraPeople: 0,
  amount: 0,
  seviceType: null,
  isBooked: false,
  isExtraPeople: false,
  amtWithouttax: 0,
  taxvalue: 0,
};
const SearchRooms = ({
  isRoomRequired,
  setEventRooms,
  allRooms,
  searchField,
  setShowModal,
  showModal,
  extraRoomMode,
  uidOfEvent,
}) => {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
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
  const navigate = useNavigate();
  const { fields: roomsList } = useFieldArray({
    control,
    name: "roomUnit",
  });

  const [bookedRoom, setBookRooms] = useState({});
  console.log("bookedRoom", bookedRoom);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const toast = useRef(null);

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
    const { isBooked, amount, noOfExtraPeople, amtWithouttax, isExtraPeople } =
      fields;

    if (isBooked && !amount) {
      setError(`roomUnit.${index}.fields.seviceType`, {
        message: "Please select a service type.",
      });
      flagRef.hasError = true;
    }

    if (isBooked)
      return {
        uid: value,
        amount,
        noOfExtraPeople,
        isExtraPeople,
        amtWithouttax,
      };
  };
  const onSubmit = async (data) => {
    // {{ }}
    if (bookedRoom?.length >= 1) {
      const { roomUnit } = data;

      const flagRef = { hasError: false };

      data.roomUnit = roomUnit.filter((item, index) =>
        handleRoom(item, index, flagRef)
      );

      if (flagRef.hasError) {
        return;
      }

      const Booked = bookedRoom?.map((x) => ({
        amount: x?.fields?.amount,
        isExtraPeople: x?.fields?.isExtraPeople,

        ...(x?.fields?.isExtraPeople && {
          noOfExtraPeople: x?.fields?.noOfExtraPeople,
        }),

        serviceType: x?.fields?.serviceType,
        roomOnlyPricePerNight: x?.grandTotalPrice,
        roomBreakfastPricePerNight: x?.roomAndBreakFast,
        roomMealPricePerNight: x?.roomAndAllMeal,
        maxRoomCapacity: x?.peopleCapacity,
        defaultPeopleCapacity: 2,
        uid: x?.value,
      }));

      const totalAmount = Booked?.reduce((sum, item) => sum + item.amount, 0);

      const payload = {
        checkInDate: bookedRoom["0"]?.checkInDate,
        checkOutDate: bookedRoom["0"]?.checkOutDate,
        numberOfDays: bookedRoom["0"]?.totalNoOfDays,
        numberOfGuests: bookedRoom["0"]?.numberOfGuests,
        roomSearchUnit: Booked,
        totalAmount: totalAmount,
      };

      try {
        const res = await useJwt.submitBookedRooms(payload);
        if (isRoomRequired) {
          // setEventRooms({bookedRoom , roomSearchUid:res?.data?.roomSearchUid});
          setEventRooms({
            bookedRoom,
            roomSearchUid: res?.data?.roomSearchUid,
          });

          setShowModal(!showModal);
        } else {
          navigate("/search-rooms/previewBooking", {
            state: {
              preBookingData: bookedRoom,
              alldata: payload,
              searchId: res?.data?.searchId,
              searchUid: res?.data?.roomSearchUid,
              extraRoomMode,
              uidOfEvent,
            },
          });
        }
        reset();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("select room first ");
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please choose rooms first.",
        life: 3000,
      });
    }
  };

  const [tableData, setTableData] = useState({
    count: roomsList?.length,
    results: [],
  });

  // console.log("roomlst", roomsList);

  useEffect(() => {
    if (roomsList) {
      setTableData({
        count: roomsList.length,
        results: roomsList,
      });
    }
  }, [roomsList]);

  const debouncedFilter = debounce((value) => handleFilter(value), 300);
  // console.log(roomsList);

  const handleFilter = (value) => {
    if (value) {
      const filteredResults = roomsList.filter(
        (room) =>
          room.roomTypeName?.toLowerCase().includes(value.toLowerCase()) ||
          room?.fields?.seviceType
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          room.roomNumber?.toString().includes(value)
      );

      setTableData({
        count: filteredResults.length,
        results: filteredResults,
      });
    } else {
      setTableData({
        count: roomsList.length,
        results: roomsList,
      });
    }
  };

  const [visibleCount, setVisibleCount] = useState(6);

  const observer = useRef();

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        {roomsList.length ? (
          <Fragment>

            <Row className="align-items-center mb-3 mt-1">
              <Col className="d-flex align-items-center">
                {/* {isRoomRequired ? (
                  <>
                    <CardTitle className="fs-4 fw-bold mb-0">
                      Available Rooms ({roomsList.length})
                    </CardTitle>
                  </>
                ) : ( */}
                            <Toast ref={toast} />

                <CardTitle className="fs-2 fw-bold mb-0">
                  Available Rooms ({roomsList.length})
                </CardTitle>
                {/* )} */}
              </Col>
              <Col className="d-flex justify-content-end">
                <Input
                  className="dataTable-filter"
                  name="search"
                  placeholder="Search..."
                  type="text"
                  bsSize="sm"
                  id="search-input"
                  onChange={(e) => debouncedFilter(e.target.value)}
                />
              </Col>
            </Row>

          

            {tableData?.results?.slice(0, visibleCount).map((fields, index) => {
              const isLast = index === visibleCount - 1;

              return (
                <Col sm="12" md="6" lg="4" key={index}>
                  <div
                    // ref={isLast ? lastCardRef : null}
                    style={
                      isRoomRequired
                        ? {
                            border: "1px solid black",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#fff",
                            borderBottom: "2em", // note: this is probably a mistake (see below)
                          }
                        : {}
                    }
                  >
                    <RoomCard
                      roomsList={roomsList}
                      fieldsDetail={fields}
                      control={control}
                      index={index}
                      watch={watch}
                      setValue={setValue}
                      getValues={getValues}
                      errors={errors}
                      setBookRooms={setBookRooms}
                      isDisabled={false}
                    />
                  </div>
                </Col>
              );
            })}

          

            {visibleCount < tableData.results.length && (
              <Col sm="12" className="d-flex justify-content-center my-3">
                <Button
                  color="primary"
                  onClick={() => {
                    setIsLoadingMore(true);
                    setTimeout(() => {
                      setVisibleCount((prev) => prev + 6);
                      setIsLoadingMore(false);
                    }, 2000); // simulate loading
                  }}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Loading..." : "View More"}
                </Button>
              </Col>
            )}

          
            <Col sm="12" className={"d-flex justify-content-start"}>
              <Button color={"primary"} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    {" "}
                    <span>Loading.. </span>
                    <Spinner size="sm" />
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </Col>
          </Fragment>
        ) : null}
      </Row>
    </Form>
  );
};

export default SearchRooms;
