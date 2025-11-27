// Convert eventStartDate + eventStartTime → ISO datetime
export function combineDateTime(date, time) {
  if (!date) return null;
  if (!time) return date; // fallback to allDay if needed
  return `${date}T${time}`;
}

// Convert your backend event to FullCalendar event
export function normalizeEvent(e) {
  return {
    id: e.id,
    title: e.eventName,
    start: combineDateTime(e.eventStartDate, e.eventStartTime),
    end: combineDateTime(e.eventEndDate, e.eventEndTime),
    // uid: e.uid,
    allDay: false,
    eventUID: e?.eventUID,
    calendarType: e?.calendarType,

    extendedProps: {
      calendar: "Business", // CHANGE THIS IF YOU HAVE ACTUAL EVENT TYPES
      description: e.eventDescription,
      paymentStatus: e.paymentStatus,
      totalAmount: e.totalAmount,
      guestCount: e.numberOfGuests,
      isRoomRequired: e.isRoomRequired,
      createdBy: e.createdBy?.name,
      updatedBy: e.updatedBy?.name,
    },
  };
}

export function normalizeRoomBooking(rb) {
  console.log("rb", rb);

  return {
    id: `room-${rb.id}`,
    title: `Room Booked: (${rb.numberOfGuests} guests)`,
    start: combineDateTime(rb.checkInDate, "00:00:00"),
    end: combineDateTime(rb.checkOutDate, "23:59:59"),
    eventUID: rb?.eventUID,
    uid: rb.uid,

    allDay: true,
    calendarType: rb?.calendarType,
    extendedProps: {
      calendar: "Holiday", // or "Rooms" — your choice
      paymentStatus: rb.paymentStatus,
      specialRequirement: rb.specialRequirement,
    },
  };
}

export const mockCalendarData = {
  events: {
    code: 200,
    content: {
      events: [
        {
          id: 101,
          uid: "e1-evt-001",
          createdAt: "2025-10-10T09:00:00",
          updatedAt: "2025-10-10T09:00:00",
          createdBy: { uid: "u1", name: "admin" },
          updatedBy: { uid: "u1", name: "admin" },

          eventName: "Corporate Annual Meeting",
          eventDescription: "Full-day conference with lunch buffet",
          eventStartDate: "2025-12-18",
          eventEndDate: "2025-12-18",
          eventStartTime: "09:30:00",
          eventEndTime: "18:00:00",

          amount: 12500,
          isExtraStaff: true,
          extraNoOfStaff: 3,
          extraNoOfStaffAmount: 1200,
          totalAmount: 13700,

          isRecurringEvent: false,
          recurrencePattern: null,

          isAdvancesPaymnet: true,
          advancePaymentAmout: 5000,
          remainingAmount: 8700,

          isDiscountApply: false,
          discountType: null,
          discountAmount: null,

          isRoomRequired: true,
          numberOfGuests: 40,

          paymentStatus: "Partial",
          eventType: "Business",
          active: true,
        },

        {
          id: 102,
          uid: "e1-evt-002",
          createdAt: "2025-10-11T11:15:00",
          updatedAt: "2025-10-11T11:15:00",
          createdBy: { uid: "u1", name: "admin" },
          updatedBy: { uid: "u1", name: "admin" },

          eventName: "Wedding Reception",
          eventDescription: "Full-day reception with catering and bar",
          eventStartDate: "2025-12-20",
          eventEndDate: "2025-12-20",
          eventStartTime: "17:00:00",
          eventEndTime: "23:00:00",

          amount: 48000,
          isExtraStaff: false,
          extraNoOfStaff: 0,
          extraNoOfStaffAmount: 0,
          totalAmount: 48000,

          isRecurringEvent: false,

          isAdvancesPaymnet: true,
          advancePaymentAmout: 25000,
          remainingAmount: 23000,

          isDiscountApply: true,
          discountType: "Percentage",
          discountAmount: 10,
          discountedFinalAmount: 43200,

          isRoomRequired: true,
          numberOfGuests: 120,

          paymentStatus: "Pending",
          eventType: "Family",
          active: true,
        },
      ],

      roomBookings: [
        // Group 1 — Event 101 — SAME DATES, 3 ROOMS
        {
          id: 201,
          uid: "rm-201",
          createdAt: "2025-11-01T10:00:00",
          updatedAt: "2025-11-01T10:00:00",
          createdBy: { uid: "u1", name: "admin" },
          updatedBy: { uid: "u1", name: "admin" },

          checkInDate: "2025-12-18",
          checkOutDate: "2025-12-19",
          numberOfGuests: 2,
          numberOfDays: 1,
          subtotal: 3500,
          finalAmount: 3500,
          specialRequirement: "Near conference hall",
          paymentStatus: "Pending",

          isAdvancesPaymnet: false,
          isCancel: false,
          active: true,
        },
        {
          id: 202,
          uid: "rm-202",
          createdAt: "2025-11-01T10:10:00",
          updatedAt: "2025-11-01T10:10:00",
          createdBy: { uid: "u1", name: "admin" },
          updatedBy: { uid: "u1", name: "admin" },

          checkInDate: "2025-12-18",
          checkOutDate: "2025-12-19",
          numberOfGuests: 1,
          numberOfDays: 1,
          subtotal: 2800,
          finalAmount: 2800,
          specialRequirement: "",
          paymentStatus: "Success",

          isAdvancesPaymnet: true,
          advancePaymentAmout: 2800,
          remainingAmount: 0,
          isCancel: false,
          active: true,
        },
        {
          id: 203,
          uid: "rm-203",
          createdAt: "2025-11-01T10:30:00",
          updatedAt: "2025-11-01T10:30:00",
          createdBy: { uid: "u1", name: "admin" },
          updatedBy: { uid: "u1", name: "admin" },

          checkInDate: "2025-12-18",
          checkOutDate: "2025-12-19",
          numberOfGuests: 3,
          numberOfDays: 1,
          subtotal: 4200,
          finalAmount: 4200,
          specialRequirement: "Extra bedding",
          paymentStatus: "Pending",

          isAdvancesPaymnet: false,
          isCancel: false,
          active: true,
        },

        // Group 2 — Event 102 — 2 Rooms
        {
          id: 204,
          uid: "rm-204",
          checkInDate: "2025-12-20",
          checkOutDate: "2025-12-21",
          numberOfGuests: 4,
          numberOfDays: 1,
          subtotal: 6000,
          finalAmount: 6000,
          specialRequirement: "Bride side family",
          paymentStatus: "Pending",
          isAdvancesPaymnet: true,
          advancePaymentAmout: 3000,
          remainingAmount: 3000,
          isCancel: false,
          active: true,
        },
        {
          id: 205,
          uid: "rm-205",
          checkInDate: "2025-12-20",
          checkOutDate: "2025-12-21",
          numberOfGuests: 2,
          numberOfDays: 1,
          subtotal: 3500,
          finalAmount: 3500,
          specialRequirement: "",
          paymentStatus: "Success",
          isAdvancesPaymnet: true,
          advancePaymentAmout: 3500,
          remainingAmount: 0,
          isCancel: false,
          active: true,
        },
      ],
    },
  },
};

// Build final event array

// export function normalizeCalendarResponse(api) {
//   console.log(api);

// //   const events = api.content.events.map(normalizeEvent);
//   const events =api?.content?.events.content.events.map(normalizeEvent);
//   const rooms = api?.content?.roomBookings.map(normalizeRoomBooking);
// //   const rooms = api.content.roomBookings.map(normalizeRoomBooking);
//   return [...[...events,...events], ...rooms];

// }

export function normalizeCalendarResponse(api) {
  if (!api || !api.content) return [];

  const events = (api.content.events || []).map(normalizeEvent);
  const rooms = (api.content.roomBookings || []).map(normalizeRoomBooking);

  return [ ...rooms];
}
