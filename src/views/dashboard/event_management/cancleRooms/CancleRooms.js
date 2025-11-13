import useJwt from "@src/auth/jwt/useJwt";
import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import { Trash } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  CardText,
  CardTitle,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
  UncontrolledAlert,
} from "reactstrap";
import successAnimation from "../../../../assets/images/celebrate.json";
import successAnimations from "../../../../assets/images/Congratulations.json";

function CancelRooms({ show, setShow, datarow }) {
  const { handleSubmit, register, watch, setValue, control } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [refundModal, setRefundModal] = useState(false);
  console.log("selectedData", selectedData);
  console.log("datarow", datarow);
  const [errorMessage, setErrorMsz] = useState("");
  const toggle = () => setRefundModal(!refundModal);
  const [roomDataForCancleFiltered, setRoomDataForCancleFiltered] = useState(
    []
  );

  useEffect(() => {
    let roomDataForCancle = datarow?.roomBookings?.flatMap(
      (x) =>
        x?.roomSearch?.roomSearchUnit?.map((room) => ({
          uid: x?.uid,
          roomNumber: room?.roomUnit?.roomNumber,
          roomTypeName: room?.roomUnit?.roomType?.roomTypeName,
          available: room?.roomUnit?.available,
          fields: {
            serviceType: room?.serviceType,
            amount: room?.amount,
          },
        })) || []
    );
    let filterData = roomDataForCancle?.filter(
      (room) => room?.available === false
    );
    setRoomDataForCancleFiltered(filterData);
  }, [datarow]);

  const singleRooms = watch("room");
  console.log("singleRooms", singleRooms);

  // useEffect(() => {
  //   {{ }}
  //   if (singleRooms && singleRooms.length > 0) {
  //    const slectOrNot=singleRooms.filter((room)=>room === true);
  //     setSelectedData(slectOrNot);
  // }}, [singleRooms]);

  const grouped = {};

  selectedData?.forEach((item) => {
    if (!grouped[item.uid]) {
      grouped[item.uid] = {
        uid: item.uid,
        isAllSelected: false,
        roomNumbers: [],
      };
    }
    if (!grouped[item.uid].roomNumbers.includes(item.roomNumber)) {
      grouped[item.uid].roomNumbers.push(item.roomNumber);
    }
  });

  // Step 3: figure out "all rooms per uid" from datarow itself
  datarow?.roomBookings?.forEach((booking) => {
    const uid = booking?.uid;
    const allRoomsForUid =
      booking?.roomSearch?.roomSearchUnit?.map(
        (r) => r?.roomUnit?.roomNumber
      ) || [];

    if (
      grouped[uid] &&
      grouped[uid].roomNumbers.length === allRoomsForUid.length
    ) {
      grouped[uid].isAllSelected = true;
    }
  });

  const cancellationRequests = Object.values(grouped);
  const payload = {
    cancellationRequests,
  };
  const onSubmit = async (data) => {
    setErrorMsz("");
    if (cancellationRequests.length > 0) {
      setLoading(true);

      try {
        const res = await useJwt.cancleRooms(datarow?.uid, payload);
        console.log(res);
        if (res?.data?.refundIssued === true) {
          setRoomDataForCancleFiltered((prev) =>
            prev.filter(
              (r) =>
                !selectedData.some(
                  (s) => s.uid === r.uid && s.roomNumber === r.roomNumber
                )
            )
          );
          setRefundModal(true);
          setShow(false);
          setSelectedData([]);
        }
      } catch (error) {
        console.log(error);
        const errMsz =
          error?.response?.data?.content ||
          "An error occurred while processing your request.";
        setErrorMsz(errMsz);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsz("Please select at least one room to cancel.");
      return;
    }
    // setShow(false);
  };

  const handleOk = () => {
    toggle();
  };

  useEffect(() => {
    if (show === false) {
      setValue("room", []);
    }
  }, [show]);

  return (
    <>
      <Modal isOpen={refundModal} toggle={toggle} centered size="sm">
        <ModalHeader
          toggle={toggle}
          style={{
            borderBottom: "none",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "1.25rem",
          }}
        >
          🎉 Refund Initiated
        </ModalHeader>

        <ModalBody style={{ textAlign: "center", paddingTop: 0 }}>
          <div
            style={{
              position: "relative",
              width: 200,
              height: 200,
              margin: "0 auto",
            }}
          >
            <Lottie
              animationData={successAnimation}
              loop={true}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 200,
                height: 200,
              }}
            />
            <Lottie
              animationData={successAnimations}
              loop={true}
              style={{
                position: "absolute",
                top: "-25px",
                left: "-25px",
                width: 250,
                height: 250,
              }}
            />
          </div>
          <CardTitle tag="h5" style={{ marginTop: "10px", fontWeight: "800" }}>
            Your room has been successfully cancelled.
          </CardTitle>

          <CardText
            style={{ color: "#555", fontSize: "0.81rem", marginTop: "5px" }}
          >
            Your <strong>refund has been successfully initiated </strong> and
            will be credited to your account within{" "}
            <strong>1-2 working days</strong>.
          </CardText>
        </ModalBody>

        <ModalFooter style={{ borderTop: "none", justifyContent: "center" }}>
          <Button
            color="success"
            onClick={toggle}
            // onClick={handleOk}
            style={{ borderRadius: "8px", padding: "8px 20px" }}
          >
            OK
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered"
        size="lg"
      >
        <ModalHeader className="bg-transparent" toggle={() => setShow(!show)} />
        <Col sm="11" className="mx-auto">
          {errorMessage && (
            <React.Fragment>
              <UncontrolledAlert color="danger">
                <div className="alert-body">
                  <span className="text-danger fw-bold">
                    <strong>Error ! </strong>
                    {errorMessage}
                  </span>
                </div>
              </UncontrolledAlert>
            </React.Fragment>
          )}
        </Col>
        <ModalBody className="px-sm-2 mx-50 pb-5">
          <h1 className="text-center mb-1">Room Cancellation for Event</h1>
          <Row
            tag="form"
            // className="gy-1 gx-2 mt-75"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Col check className="mb-2">
              <Col className="d-flex justify-content-between">
                <CardTitle tag="h5" className="p-2 border-bottom mb-0">
                  Your Booked Rooms
                </CardTitle>

                <CardTitle tag="h5" className="p-2 border-bottom mb-0">
                  {/* <Controller
                    name="allSelected"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-2">
                        <Input
                          type="checkbox"
                          {...field}
                          checked={field.value}
                        />
                        <span>Select All</span>
                      </label>
                    )}
                  /> */}
                </CardTitle>
              </Col>
              <Table bordered responsive hover>
                <thead className="table-light">
                  <tr>
                    <th>Select</th>
                    <th>Id</th>
                    <th>Room No</th>
                    <th>Room Type</th>
                    <th>Service Package</th>
                    <th>Final Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {roomDataForCancleFiltered?.map((x, index) => (
                    <tr key={index}>
                      <td>
                        <div className="form-check form-check-inline">
                          <Controller
                            name={`room.${index}`}
                            control={control}
                            render={({ field }) => (
                              <label className="flex items-center gap-2">
                                <Input
                                  type="checkbox"
                                  checked={field.value || false}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    field.onChange(checked);
                                    if (checked) {
                                      console.log(
                                        "Row Selected Room Number:",
                                        x.roomNumber
                                      );

                                      setSelectedData((prev) => [...prev, x]);
                                    } else {
                                      console.log(
                                        "Row Unselected Room Number:",
                                        x.roomNumber
                                      );
                                      setSelectedData((prev) => [
                                        ...prev.filter(
                                          (item) =>
                                            item.roomNumber !== x.roomNumber
                                        ),
                                      ]);
                                    }
                                  }}
                                />
                              </label>
                            )}
                          />
                        </div>
                      </td>
                      <td>{index + 1}</td>
                      <td>{x.roomNumber}</td>
                      <td>{x?.roomTypeName}</td>
                      <td>{x?.fields?.serviceType}</td>
                      <td>${x?.fields?.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button
                color="danger"
                size="sm"
                type="submit"
                disabled={loading}
                className="mt-2"
              >
                {loading ? (
                  <>
                    {" "}
                    <Spinner size="sm" /> Loading...{" "}
                  </>
                ) : (
                  <>
                    Cancel Selected Rooms <Trash size={14} />
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  );
}

export default CancelRooms;
