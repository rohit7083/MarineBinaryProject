// ** React Import
import { memo, useEffect, useRef, useState } from "react";

import "@fullcalendar/react/dist/vdom";
import useJwt from "@src/auth/jwt/useJwt";
import { Toast } from "primereact/toast";

// ** Full Calendar & it's Plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import "@fullcalendar/react/dist/vdom";
import timeGridPlugin from "@fullcalendar/timegrid";
// ** Third Party Components
import { Menu } from "react-feather";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody } from "reactstrap";

const Calendar = (props) => {
  // ** Refs
  const calendarRef = useRef(null);

  // ** Props
  const {
    store,
    isRtl,
    dispatch,
    calendarsColor,
    calendarApi,
    setCalendarApi,
    handleAddEventSidebar,
    blankEvent,
    toggleSidebar,
    selectEvent,
    updateEvent,
  } = props;
  console.log("store", store);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);
  const toggleModal = () => setModalOpen(!modalOpen);
  const [clickedEvent, setClickedEvent] = useState(null);
  const toast = useRef(null);
  const [] = useState(false);
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi());
    }
  }, [calendarApi]);
  const navigate = useNavigate();

  const fakeEvents = [
    {
      id: 1,
      url: "",
      title: "Design Review",
      start: "2025-11-13T10:48:49.728Z",
      end: "2025-11-14T10:48:49.728Z",
      allDay: false,
      extendedProps: {
        calendar: "Business",
      },
    },
    {
      id: 2,
      url: "",
      title: "Meeting With Client",
      start: "2025-11-18T18:30:00.000Z",
      end: "2025-11-19T18:30:00.000Z",
      allDay: true,
      extendedProps: {
        calendar: "Business",
      },
    },
    {
      id: 3,
      url: "",
      title: "Family Trip",
      allDay: true,
      start: "2025-11-20T18:30:00.000Z",
      end: "2025-11-22T18:30:00.000Z",
      extendedProps: {
        calendar: "Holiday",
      },
    },
    {
      id: 4,
      url: "",
      title: "Doctor's Appointment",
      start: "2025-11-18T18:30:00.000Z",
      end: "2025-11-19T18:30:00.000Z",
      allDay: true,
      extendedProps: {
        calendar: "Personal",
      },
    },
    {
      id: 5,
      url: "",
      title: "Dart Game?",
      start: "2025-11-16T18:30:00.000Z",
      end: "2025-11-17T18:30:00.000Z",
      allDay: true,
      extendedProps: {
        calendar: "ETC",
      },
    },
    {
      id: 6,
      url: "",
      title: "Meditation",
      start: "2025-11-16T18:30:00.000Z",
      end: "2025-11-17T18:30:00.000Z",
      allDay: true,
      extendedProps: {
        calendar: "Personal",
      },
    },
    {
      id: 7,
      url: "",
      title: "Dinner",
      start: "2025-11-16T18:30:00.000Z",
      end: "2025-11-20T18:30:00.000Z",
      allDay: true,
      extendedProps: {
        calendar: "Family",
      },
    },
    {
      id: 8,
      url: "",
      title: "Product Review",
      start: "2025-11-16T18:30:00.000Z",
      end: "2025-11-17T18:30:00.000Z",
      allDay: true,
      extendedProps: {
        calendar: "Business",
      },
    },
    {
      id: 9,
      url: "",
      title: "Monthly Meeting",
      start: "2025-11-30T18:30:00.000Z",
      end: "2025-11-30T18:30:00.000Z",
      allDay: true,
      extendedProps: {
        calendar: "Business",
      },
    },
    {
      id: 10,
      url: "",
      title: "Monthly Checkup",
      start: "2025-09-30T18:30:00.000Z",
      end: "2025-09-30T18:30:00.000Z",
      allDay: true,
      extendedProps: {
        calendar: "Personal",
      },
    },
  ];

  const calendarOptions = {
    events: store.events.length ? store.events : [],

    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      start: "sidebarToggle, prev,next, title",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },

    editable: false,

    eventResizableFromStart: true,

    dragScroll: true,

    dayMaxEvents: 1,

    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const colorName =
        calendarsColor[calendarEvent._def.extendedProps.calendar];

      return [`bg-light-${colorName}`];
    },

    eventClick({ event: clickedEvent }) {
      dispatch(selectEvent(clickedEvent));
      handleAddEventSidebar();
      console.log("clickedEvent", clickedEvent?._def);
      setClickedEvent(clickedEvent); // store event to trigger useEffect
    },

    // eventClick({ event }) {
    //   console.log('Event clicked:', event);

    //   dispatch(selectEvent(event));
    //   handleAddEventSidebar();
    // },

    customButtons: {
      sidebarToggle: {
        text: <Menu className="d-xl-none d-block" />,
        click() {
          toggleSidebar(true);
        },
      },
    },

    dateClick(info) {
      const ev = blankEvent;
      ev.start = info.date;
      ev.end = info.date;
      dispatch(selectEvent(ev));
      handleAddEventSidebar();
      console.log("cllick on date ");
    },

    ref: calendarRef,

    direction: isRtl ? "rtl" : "ltr",
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!clickedEvent) return;
      const checkType = clickedEvent._def.extendedProps?.calendarType;
      const eventUID = clickedEvent._def.extendedProps?.eventUID;
      const roomUid = clickedEvent._def.extendedProps?.uid;
      try {
        const res =
          checkType === "event" && checkType === "event" && eventUID
            ? await useJwt.retriveEvent(eventUID)
            : await useJwt.retriveRoom(roomUid);

        let info = res?.data;

        setSelectedEventData(info);

        if (checkType === "roombooking" && res?.status === 200) {
          navigate("/booking_listing/view", { state: { info } });
        } else {
          navigate("/PaymentHistory", { state: { info } });
        }

        console.log(selectedEventData);
      } catch (error) {
        console.error(error);
        if (error.response) {
          toast.current.show({
            severity: "error",
            summary: "Failed",
            detail: `${error.response?.data?.content}`,
            life: 2000,
          });
        }
      }
    };

    fetchEventDetails();
  }, [clickedEvent]);

  return (
    <Card className="shadow-none border-0 ">
      <CardBody className="">
        <Toast ref={toast} />
        <Button
          size={"sm"}
          color={"primary"}
          onClick={(e) => navigate("/addNew_room_booking")}
        >
          
          Book Rooms
        </Button>
        <FullCalendar {...calendarOptions} />{" "}
      </CardBody>
    </Card>
  );
};

export default memo(Calendar);
