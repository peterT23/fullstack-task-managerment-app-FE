import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarStyles.css"; // Import the custom styles

function CalendarComponent() {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div>
      <Calendar onChange={onChange} value={date} />
      <p>Selected date: {date.toDateString()}</p>
    </div>
  );
}

export default CalendarComponent;
