import React, { useState, useEffect } from 'react';
import './Calendar.css';

const CalendarApp = ({ selectedDate, setSelectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [months] = useState([
    "January", "February", "March", "April",
    "May", "June", "July", "August", "September",
    "October", "November", "December"
  ]);

  useEffect(() => {
    showCalendar(currentMonth, currentYear);
  }, [currentMonth, currentYear]);

  const showCalendar = (month, year) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const today = new Date();
    const tbl = document.getElementById("calendar-body");
    tbl.innerHTML = "";
    const monthAndYear = document.getElementById("monthAndYear");
    monthAndYear.innerHTML = months[month] + " " + year;

    let date = 1; // Moved date initialization here
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        let firstDay = new Date(year, month, 1).getDay(); // Redefined firstDay inside the loop
        if (i === 0 && j < firstDay) {
          const cell = document.createElement("td");
          const cellText = document.createTextNode("");
          cell.appendChild(cellText);
          row.appendChild(cell);
        } else if (date > daysInMonth(month, year)) {
          break;
        } else {
          const cell = document.createElement("td");
          cell.setAttribute("data-date", date);
          cell.setAttribute("data-month", month + 1);
          cell.setAttribute("data-year", year);
          cell.setAttribute("data-month_name", months[month]);
          cell.className = "date-picker";
          cell.innerHTML = "<span>" + date + "</span>";

          if (
            date === today.getDate() &&
            year === today.getFullYear() &&
            month === today.getMonth()
          ) {
            cell.className = "date-picker selected";
          }

          row.appendChild(cell);
          date++;
        }
      }
      tbl.appendChild(row);
    }
};


  const daysInMonth = (iMonth, iYear) => {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  };

  const next = () => {
    setCurrentYear(currentMonth === 11 ? currentYear + 1 : currentYear);
    setCurrentMonth((currentMonth + 1) % 12);
  };

  const previous = () => {
    setCurrentYear(currentMonth === 0 ? currentYear - 1 : currentYear);
    setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
  };

  return (
    <div className="wrapper">
      <div className="container-calendar">
        <div id="right">
          <h3 id="monthAndYear">{`${months[currentMonth]} ${currentYear}`}</h3>
          <div className="button-container-calendar">
            <button id="previous" onClick={previous}>‹</button>
            <button id="next" onClick={next}>›</button>
          </div>
          <table className="table-calendar" id="calendar" data-lang="en">
            <thead id="thead-month"></thead>
            <tbody id="calendar-body">
              {/* Calendar content goes here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;
