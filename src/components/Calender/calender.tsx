"use client";
import React, { useState } from 'react';

interface CalenderComponentProps {
  onClose: () => void;
}
const Calendar: React.FC<CalenderComponentProps> = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '' });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get days in current month and first day of month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      firstDay: new Date(year, month, 1).getDay()
    };
  };

  const { daysInMonth, firstDay } = getDaysInMonth();

  // Check if a date is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Handle date selection
  const handleDateClick = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
    setSelectedDate(dateStr);
  };

  // Handle event addition
  const handleAddEvent = () => {
    if (selectedDate && newEvent.title) {
      setEvents(prev => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), newEvent]
      }));
      setNewEvent({ title: '', description: '' });
      setShowAddEvent(false);
    }
  };

  // Handle event deletion
  const handleDeleteEvent = (eventIndex) => {
    setEvents(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter((_, index) => index !== eventIndex)
    }));
  };

  return (
    <div  className="fixed  bottom-0 right-0 m-4 w-full max-w-sm transform translate-y-full animate-slide-in ">
      <div className="relative w-full max-w-sm mx-auto p-4 bg-gray-100 dark:bg-[#151b23] rounded-lg shadow-2xl ">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Calender Events</h1>
          <button className="text-red-500 hover:text-red-600" onClick={onClose}>Close</button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          >
            ←
          </button>

          <h2 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          >
            →
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-4 text-sm font-medium">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center ">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {[...Array(firstDay)].map((_, index) => (
            <div key={`empty-${index}`} className="p-3" />
          ))}

          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
            const hasEvents = events[dateStr]?.length > 0;
            const todayClass = isToday(day) ? ' ring-2 ring-blue-500 font-black' : '';

            return (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                className={`p-2 text-center cursor-pointer border rounded flex items-center justify-center bg-slate-50 dark:bg-[#212830]
                hover:bg-gray-50 dark:hover:bg-gray-700
                ${selectedDate === dateStr ? 'ring-2 ring-blue-300' : ''}
                ${hasEvents ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                ${todayClass}`}
              >
                {day}
                {hasEvents && <div className="text-blue-500 rounded-full mx-auto mt-1">*</div>}
              </div>

            );
          })}
        </div>



        {/* Add Event Section */}
        <div className="mt-4">
          {!showAddEvent && (
            <button
              onClick={() => setShowAddEvent(true)}
              className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Event
            </button>
          )}
          {showAddEvent && (
            < >
             
            </>
          )}

          {showAddEvent && (
            <div className="mt-4 space-y-2">
              <input
                type="text"
                placeholder="Event title"
                className="w-full p-2 border rounded-lg dark:bg-gray-700"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full p-2 border rounded-lg dark:bg-gray-700"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddEvent}
                  className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Save Event
                </button>
                <button
                  onClick={() => setShowAddEvent(!showAddEvent)}
                  className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Events List */}
        {selectedDate && events[selectedDate]?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Events for {selectedDate}</h3>
            <div className="">
              {events[selectedDate].map((event, index) => (
                <div key={index} className="p-6 justify-evenly w-full bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="pb-4  grid grid-rows-2 gap-2 items-center justify-between">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">{event.description}</p>
                  </div>
                  <div className=" grid grid-cols-2 gap-4 items-center justify-center mx-auto">
                    <p onClick={() => handleDeleteEvent(index)} className="bg-red-500 hover:bg-red-600 text-white flex p-2 justify-center items-center cursor-pointer">
                      Delete 🗑️
                    </p>
                    <p className="bg-green-500 hover:bg-green-600 text-white flex p-2 justify-center items-center cursor-pointer">
                      Edit ✏️
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;