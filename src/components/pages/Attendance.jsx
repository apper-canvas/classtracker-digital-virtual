import React, { useState, useEffect } from "react";
import { format, addMonths, subMonths } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import AttendanceCalendar from "@/components/molecules/AttendanceCalendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import attendanceService from "@/services/api/attendanceService";
import studentService from "@/services/api/studentService";

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [attendanceRecords, studentsData] = await Promise.all([
        attendanceService.getAll(),
        studentService.getAll()
      ]);
      
      setAttendanceData(attendanceRecords);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const getAttendanceForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendanceData.filter(record => record.date === dateStr);
  };

  const getAttendanceStats = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(record => record.status === "Present").length;
    const absent = attendanceData.filter(record => record.status === "Absent").length;
    const late = attendanceData.filter(record => record.status === "Late").length;
    
    return {
      total,
      present,
      absent,
      late,
      presentRate: total > 0 ? Math.round((present / total) * 100) : 0
    };
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={loadData} message={error} />;
  }

  const stats = getAttendanceStats();
  const selectedDateAttendance = selectedDate ? getAttendanceForDate(selectedDate) : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Track student attendance and participation</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card variant="gradient" className="p-4 text-center">
          <p className="text-2xl font-bold text-success-600">{stats.present}</p>
          <p className="text-sm text-gray-600">Present</p>
        </Card>
        <Card variant="gradient" className="p-4 text-center">
          <p className="text-2xl font-bold text-error-600">{stats.absent}</p>
          <p className="text-sm text-gray-600">Absent</p>
        </Card>
        <Card variant="gradient" className="p-4 text-center">
          <p className="text-2xl font-bold text-warning-600">{stats.late}</p>
          <p className="text-sm text-gray-600">Late</p>
        </Card>
        <Card variant="gradient" className="p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">{stats.presentRate}%</p>
          <p className="text-sm text-gray-600">Attendance Rate</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Attendance Calendar
              </h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handlePreviousMonth}>
                  <ApperIcon name="ChevronLeft" className="h-4 w-4" />
                </Button>
                <span className="font-medium text-gray-900 min-w-[120px] text-center">
                  {format(currentDate, "MMMM yyyy")}
                </span>
                <Button variant="ghost" size="sm" onClick={handleNextMonth}>
                  <ApperIcon name="ChevronRight" className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <AttendanceCalendar
              currentDate={currentDate}
              attendanceData={attendanceData}
              onDateClick={handleDateClick}
            />
          </Card>
        </div>

        {/* Daily Detail */}
        <div>
          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select a Date"}
            </h3>
            
            {selectedDate ? (
              <div className="space-y-4">
                {selectedDateAttendance.length > 0 ? (
                  selectedDateAttendance.map(record => {
                    const student = students.find(s => s.Id === record.studentId);
                    return (
                      <div key={record.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={student?.photo}
                            alt={`${student?.firstName} ${student?.lastName}`}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {student?.firstName} {student?.lastName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.status === "Present" ? "bg-success-100 text-success-800" :
                            record.status === "Absent" ? "bg-error-100 text-error-800" :
                            "bg-warning-100 text-warning-800"
                          }`}>
                            {record.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="Calendar" className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No attendance records for this date</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Click on a calendar date to view attendance details</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Attendance;