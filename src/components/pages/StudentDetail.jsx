import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";
import assignmentService from "@/services/api/assignmentService";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [studentData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getById(id),
        gradeService.getByStudentId(parseInt(id)),
        attendanceService.getByStudentId(parseInt(id)),
        assignmentService.getAll()
      ]);
      
      setStudent(studentData);
      setGrades(gradesData);
      setAttendance(attendanceData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={loadStudentData} message={error} />;
  }

  if (!student) {
    return <Error title="Student not found" message="The student you're looking for doesn't exist." />;
  }

  const calculateGPA = () => {
    if (!grades.length) return 0;
    const total = grades.reduce((sum, grade) => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      return sum + (grade.score / assignment.totalPoints) * 100;
    }, 0);
    return ((total / grades.length) / 100 * 4);
  };

  const getAttendanceRate = () => {
    if (!attendance.length) return 0;
    const present = attendance.filter(record => record.status === "Present").length;
    return (present / attendance.length) * 100;
  };

  const getGradeStatus = (score, totalPoints) => {
    const percentage = (score / totalPoints) * 100;
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "primary";
    if (percentage >= 70) return "warning";
    return "error";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/students")}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          <span>Back to Students</span>
        </Button>
      </div>

      {/* Student Profile */}
      <Card variant="elevated" className="p-6">
        <div className="flex items-start space-x-6">
          <img
            src={student.photo}
            alt={`${student.firstName} ${student.lastName}`}
            className="h-24 w-24 rounded-xl object-cover border-2 border-gray-200"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 mt-1">{student.email}</p>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                <p className="text-gray-900">{format(new Date(student.dateOfBirth), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Enrollment Date</p>
                <p className="text-gray-900">{format(new Date(student.enrollmentDate), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Parent Contact</p>
                <p className="text-gray-900">{student.parentContact}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="gradient" className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-3">
            <ApperIcon name="TrendingUp" className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{calculateGPA().toFixed(2)}</p>
          <p className="text-sm text-gray-600">Current GPA</p>
        </Card>

        <Card variant="gradient" className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-lg mb-3">
            <ApperIcon name="Calendar" className="h-6 w-6 text-success-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(getAttendanceRate())}%</p>
          <p className="text-sm text-gray-600">Attendance Rate</p>
        </Card>

        <Card variant="gradient" className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-warning-100 to-warning-200 rounded-lg mb-3">
            <ApperIcon name="FileText" className="h-6 w-6 text-warning-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
          <p className="text-sm text-gray-600">Assignments Graded</p>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
        <div className="space-y-3">
          {grades.length > 0 ? (
            grades
              .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
              .slice(0, 5)
              .map(grade => {
                const assignment = assignments.find(a => a.Id === grade.assignmentId);
                const percentage = Math.round((grade.score / assignment.totalPoints) * 100);
                
                return (
                  <div key={grade.Id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-sm text-gray-500">
                        Submitted: {format(new Date(grade.submittedDate), "MMM d, yyyy")}
                      </p>
                      {grade.notes && (
                        <p className="text-sm text-gray-600 mt-1">{grade.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getGradeStatus(grade.score, assignment.totalPoints)}>
                        {grade.score}/{assignment.totalPoints} ({percentage}%)
                      </Badge>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-gray-500 text-center py-8">No grades recorded yet</p>
          )}
        </div>
      </Card>

      {/* Contact Information */}
      <Card variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Address</p>
            <p className="text-gray-900">{student.address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Emergency Contact</p>
            <p className="text-gray-900">{student.emergencyContact}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentDetail;