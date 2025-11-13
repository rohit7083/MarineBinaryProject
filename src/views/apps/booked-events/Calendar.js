// ** React Import
import { memo, useEffect, useRef } from "react";


import '@fullcalendar/react/dist/vdom';



// ** Full Calendar & it's Plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import "@fullcalendar/react/dist/vdom";
import timeGridPlugin from "@fullcalendar/timegrid";

// ** Third Party Components
import { Menu } from "react-feather";
import toast from "react-hot-toast";
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
console.log("store",store);

  // ** UseEffect checks for CalendarAPI Update
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi());
    }
  }, [calendarApi]);


  const fakeEvents=[
    {
        "id": 1,
        "url": "",
        "title": "Design Review",
        "start": "2025-11-13T10:48:49.728Z",
        "end": "2025-11-14T10:48:49.728Z",
        "allDay": false,
        "extendedProps": {
            "calendar": "Business"
        }
    },
    {
        "id": 2,
        "url": "",
        "title": "Meeting With Client",
        "start": "2025-11-18T18:30:00.000Z",
        "end": "2025-11-19T18:30:00.000Z",
        "allDay": true,
        "extendedProps": {
            "calendar": "Business"
        }
    },
    {
        "id": 3,
        "url": "",
        "title": "Family Trip",
        "allDay": true,
        "start": "2025-11-20T18:30:00.000Z",
        "end": "2025-11-22T18:30:00.000Z",
        "extendedProps": {
            "calendar": "Holiday"
        }
    },
    {
        "id": 4,
        "url": "",
        "title": "Doctor's Appointment",
        "start": "2025-11-18T18:30:00.000Z",
        "end": "2025-11-19T18:30:00.000Z",
        "allDay": true,
        "extendedProps": {
            "calendar": "Personal"
        }
    },
    {
        "id": 5,
        "url": "",
        "title": "Dart Game?",
        "start": "2025-11-16T18:30:00.000Z",
        "end": "2025-11-17T18:30:00.000Z",
        "allDay": true,
        "extendedProps": {
            "calendar": "ETC"
        }
    },
    {
        "id": 6,
        "url": "",
        "title": "Meditation",
        "start": "2025-11-16T18:30:00.000Z",
        "end": "2025-11-17T18:30:00.000Z",
        "allDay": true,
        "extendedProps": {
            "calendar": "Personal"
        }
    },
    {
        "id": 7,
        "url": "",
        "title": "Dinner",
        "start": "2025-11-16T18:30:00.000Z",
        "end": "2025-11-20T18:30:00.000Z",
        "allDay": true,
        "extendedProps": {
            "calendar": "Family"
        }
    },
    {
        "id": 8,
        "url": "",
        "title": "Product Review",
        "start": "2025-11-16T18:30:00.000Z",
        "end": "2025-11-17T18:30:00.000Z",
        "allDay": true,
        "extendedProps": {
            "calendar": "Business"
        }
    },
    {
        "id": 9,
        "url": "",
        "title": "Monthly Meeting",
        "start": "2025-11-30T18:30:00.000Z",
        "end": "2025-11-30T18:30:00.000Z",
        "allDay": true,
        "extendedProps": {
            "calendar": "Business"
        }
    },
    {
        "id": 10,
        "url": "",
        "title": "Monthly Checkup",
        "start": "2025-09-30T18:30:00.000Z",
        "end": "2025-09-30T18:30:00.000Z",
        "allDay": true,
        "extendedProps": {
            "calendar": "Personal"
        }
    }
]

  // ** calendarOptions(Props)
  const calendarOptions = {
    // events: store.events.length ? store.events : [],
    // events:fakeEvents,
    events: store.events.length ? store.events : [],

    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      start: "sidebarToggle, prev,next, title",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: true,

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 2,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const colorName =
        calendarsColor[calendarEvent._def.extendedProps.calendar];

      return [
        // Background Color
        `bg-light-${colorName}`,
      ];
    },

    eventClick({ event: clickedEvent }) {
      dispatch(selectEvent(clickedEvent));
      handleAddEventSidebar();

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      // event.value = grabEventDataFromEventApi(clickedEvent)

      // eslint-disable-next-line no-use-before-define
      // isAddNewEventSidebarActive.value = true
    },

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
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent }) {
      dispatch(updateEvent(droppedEvent));
      toast.success("Event Updated");
    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }) {
      dispatch(updateEvent(resizedEvent));
      toast.success("Event Updated");
    },

    ref: calendarRef,

    // Get direction from app state (store)
    direction: isRtl ? "rtl" : "ltr",
  };
const navigate=useNavigate();
  return (
    <Card className="shadow-none border-0 mb-0 rounded-0">
      <CardBody className="pb-0">

        <Button size={'sm'}  color={'primary'} onClick={(e)=>navigate('/addNew_room_booking')}>Book Rooms</Button>
        <FullCalendar size='' {...calendarOptions} />{" "}
      </CardBody>
    </Card>
  );
};

export default memo(Calendar);



