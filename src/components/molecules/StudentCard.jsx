import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const StudentCard = ({ student, grades = [], attendance = [] }) => {
  const navigate = useNavigate();

  const calculateGPA = () => {
    if (!grades.length) return "N/A";
    const total = grades.reduce((sum, grade) => sum + (grade.score || 0), 0);
    const percentage = total / grades.length;
    return (percentage / 100 * 4).toFixed(2);
  };

  const getAttendanceRate = () => {
    if (!attendance.length) return "N/A";
    const present = attendance.filter(record => record.status === "Present").length;
    return `${Math.round((present / attendance.length) * 100)}%`;
  };

  const handleViewDetails = () => {
    navigate(`/students/${student.Id}`);
  };

  return (
    <Card variant="interactive" className="p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={student.photo}
            alt={`${student.firstName} ${student.lastName}`}
            className="h-16 w-16 rounded-lg object-cover border-2 border-gray-200"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-gray-500 truncate">{student.email}</p>
              <p className="text-xs text-gray-400 mt-1">
                Enrolled: {format(new Date(student.enrollmentDate), "MMM d, yyyy")}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleViewDetails}
              className="flex items-center space-x-1"
            >
              <ApperIcon name="Eye" className="h-4 w-4" />
              <span>View</span>
            </Button>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">GPA</span>
                <Badge variant={calculateGPA() !== "N/A" && parseFloat(calculateGPA()) >= 3.0 ? "success" : "warning"}>
                  {calculateGPA()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Attendance</span>
                <Badge variant={getAttendanceRate() !== "N/A" && parseInt(getAttendanceRate()) >= 90 ? "success" : "warning"}>
                  {getAttendanceRate()}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Assignments</span>
                <span className="text-xs text-gray-900 font-medium">{grades.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Days Present</span>
                <span className="text-xs text-gray-900 font-medium">
                  {attendance.filter(record => record.status === "Present").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StudentCard;