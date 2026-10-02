import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function FullCalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const calendarCells = [];

  // Empty slots for previous month padding
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday
    
    const isToday = 
      day === new Date().getDate() && 
      month === new Date().getMonth() && 
      year === new Date().getFullYear();

    const isSunday = dayOfWeek === 0;

    calendarCells.push(
      <div 
        key={`day-${day}`} 
        className={`calendar-day ${isToday ? 'today' : ''} ${isSunday ? 'sunday' : ''}`}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="card calendar-card">
      <div className="calendar-header">
        <h3>{monthNames[month]} {year}</h3>
        <div className="calendar-nav-btns">
          <button onClick={prevMonth} className="cal-nav-btn"><FiChevronLeft /></button>
          <button onClick={nextMonth} className="cal-nav-btn"><FiChevronRight /></button>
        </div>
      </div>
      
      <div className="calendar-weekdays">
        <span className="sunday-label">Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="calendar-grid">
        {calendarCells}
      </div>
    </div>
  );
}