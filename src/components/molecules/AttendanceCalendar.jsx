import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const AttendanceCalendar = ({ 
  currentDate, 
  attendanceData = [], 
  onDateClick 
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

const getAttendanceForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendanceData.filter(record => record.date_c === dateStr);
  };

const getStatusSummary = (attendance) => {
    const present = attendance.filter(a => a.status_c === "Present").length;
    const absent = attendance.filter(a => a.status_c === "Absent").length;
    const late = attendance.filter(a => a.status_c === "Late").length;
    
    return { present, absent, late, total: attendance.length };
  };

  const handleDateClick = (date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentDate, "MMMM yyyy")}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center">
            <span className="text-xs font-medium text-gray-700">{day}</span>
          </div>
        ))}

        {/* Calendar days */}
        {days.map(day => {
          const dayAttendance = getAttendanceForDate(day);
          const summary = getStatusSummary(dayAttendance);
          const hasData = summary.total > 0;
          
          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={cn(
                "bg-white p-2 min-h-[80px] cursor-pointer transition-all duration-200 hover:bg-gray-50",
                !isSameMonth(day, currentDate) && "bg-gray-50 text-gray-400",
                isToday(day) && "ring-2 ring-primary-500 ring-inset"
              )}
            >
              <div className="flex flex-col h-full">
                <span className={cn(
                  "text-sm font-medium mb-1",
                  !isSameMonth(day, currentDate) ? "text-gray-400" : "text-gray-900",
                  isToday(day) && "text-primary-600 font-bold"
                )}>
                  {format(day, "d")}
                </span>
                
                {hasData && (
                  <div className="flex flex-col space-y-1 text-xs">
                    {summary.present > 0 && (
                      <Badge variant="success" className="text-xs px-1.5 py-0.5">
                        P: {summary.present}
                      </Badge>
                    )}
                    {summary.absent > 0 && (
                      <Badge variant="error" className="text-xs px-1.5 py-0.5">
                        A: {summary.absent}
                      </Badge>
                    )}
                    {summary.late > 0 && (
                      <Badge variant="warning" className="text-xs px-1.5 py-0.5">
                        L: {summary.late}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center space-x-1">
          <Badge variant="success" className="text-xs px-2 py-1">P</Badge>
          <span className="text-gray-600">Present</span>
        </div>
        <div className="flex items-center space-x-1">
          <Badge variant="error" className="text-xs px-2 py-1">A</Badge>
          <span className="text-gray-600">Absent</span>
        </div>
        <div className="flex items-center space-x-1">
          <Badge variant="warning" className="text-xs px-2 py-1">L</Badge>
          <span className="text-gray-600">Late</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;