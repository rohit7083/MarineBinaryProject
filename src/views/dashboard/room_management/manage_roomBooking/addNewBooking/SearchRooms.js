// ** React Imports
import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { debounce } from "lodash";

import { Button, CardTitle, Col, Form, Input, Row, Spinner } from "reactstrap";
import RoomCard from "./RoomCard";
import useJwt from "@src/auth/jwt/useJwt";
import { useNavigate } from "react-router-dom";
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

      serviceType: x?.fields?.seviceType,
      roomOnlyPricePerNight: x?.grandTotalPrice,
      roomBreakfastPricePerNight: x?.roomAndBreakFast,
      roomMealPricePerNight: x?.roomAndAllMeal,
      maxRoomCapacity:x?.peopleCapacity,
      defaultPeopleCapacity:2,
      uid: x?.value,
    }));
    const totalAmount = Booked?.reduce((sum, item) => sum + item.amount, 0);
    console.log("roomUnit", totalAmount);
// {{debugger}}
    const payload = {
      checkInDate: bookedRoom["0"]?.checkInDate,
      checkOutDate: bookedRoom["0"]?.checkOutDate,
      numberOfDays: bookedRoom["0"]?.totalNoOfDays,
      numberOfGuests: bookedRoom["0"]?.numberOfGuests,
      roomSearchUnit: Booked,
      totalAmount: totalAmount,
     
    };


// {{debugger}}
    try {
      const res = await useJwt.submitBookedRooms(payload);
      console.log("submitBookedRooms", res);
      if (isRoomRequired) {
        // setEventRooms({bookedRoom , roomSearchUid:res?.data?.roomSearchUid});
        setEventRooms({
  bookedRoom,
  roomSearchUid: res?.data?.roomSearchUid
});


        setShowModal(!showModal);
      } else {
        navigate("/search-rooms/previewBooking", {
          state: {
            preBookingData: bookedRoom,
            alldata: payload,
            searchId: res?.data?.searchId,
            searchUid: res?.data?.roomSearchUid,
          },
        });
      }
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const [tableData, setTableData] = useState({
    count: roomsList?.length,
    results: [],
  });

  console.log("roomlst", roomsList);

  useEffect(() => {
    if (roomsList) {
      setTableData({
        count: roomsList.length,
        results: roomsList,
      });
    }
  }, [roomsList]);

  const debouncedFilter = debounce((value) => handleFilter(value), 300);

  const handleFilter = (value) => {
    if (value) {
      const filteredResults = roomsList.filter(
        (room) =>
          room.roomTypeName?.toLowerCase().includes(value.toLowerCase()) ||
          room?.fields?.seviceType
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          room.label?.toString().includes(value)
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

  const lastCardRef = useCallback(
    (node) => {
      if (isSubmitting) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        setIsLoadingMore(true);

        setTimeout(() => {
          if (
            entries[0].isIntersecting &&
            visibleCount < tableData.results.length
          ) {
            setVisibleCount((prev) => prev + 6);
            setIsLoadingMore(false);
          }
        }, 3000);
      });

      if (node) observer.current.observe(node);
    },
    [visibleCount, tableData.results.length, isSubmitting]
  );

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

            {/* {tableData?.results?.map((fields, index) => ( */}

            {tableData?.results?.slice(0, visibleCount).map((fields, index) => {
              const isLast = index === visibleCount - 1;

              return (
                <Col sm="12" md="6" lg="4" key={index}>
                  <div
                    ref={isLast ? lastCardRef : null}
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

            {isLoadingMore && (
              <Col sm="12" className="d-flex justify-content-center my-2">
                <Spinner
                  style={{ width: "5rem", height: "5rem" }}
                  color="primary"
                />
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
