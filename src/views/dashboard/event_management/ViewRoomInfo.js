// RoomInfoSection.jsx
import { CardTitle, Col, Row } from "reactstrap";
import RoomCard from "../../dashboard/room_management/manage_roomBooking/addNewBooking/RoomCard";

const RoomInfoSection = ({ roomUnits, control, watch }) => {
  if (!roomUnits || roomUnits.length === 0) return null;

  return (
    <Col md="12" className="mt-2">
      <CardTitle tag="h5">Room Information</CardTitle>
     <Row className="mt-2">
            {roomUnits &&
              roomUnits.map((fields, index) => (
                <Col sm="12" md="6" lg="4" key={fields.id ?? index}>
                  <div>
                    <RoomCard
                      roomsList={[]}
                      fieldsDetail={fields}
                      control={control}
                      index={index}
                      watch={watch}
                      setValue={() => null}
                      getValues={() => null}
                      errors={{}}
                      setBookRooms={() => null}
                      isDisabled={true}
                    />
                  </div>
                </Col>
              ))}
          </Row>
    </Col>
  );
};

export default RoomInfoSection;
