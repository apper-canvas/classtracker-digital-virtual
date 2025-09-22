import React, { useState, useEffect } from "react";
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

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeReport, setActiveReport] = useState("overview");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [studentsData, gradesData, attendanceData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll(),
        assignmentService.getAll()
      ]);
      
      setStudents(studentsData);
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
    loadData();
  }, []);

const generateStudentReport = () => {
    return students.map(student => {
      const studentGrades = grades.filter(g => g.student_id_c === student.Id);
      const studentAttendance = attendance.filter(a => a.student_id_c === student.Id);
      
      const totalScore = studentGrades.reduce((sum, grade) => {
        const assignment = assignments.find(a => a.Id === grade.assignment_id_c);
        return sum + (grade.score_c / assignment.total_points_c) * 100;
      }, 0);
      
      const average = studentGrades.length > 0 ? totalScore / studentGrades.length : 0;
      const presentCount = studentAttendance.filter(a => a.status_c === "Present").length;
      const attendanceRate = studentAttendance.length > 0 ? (presentCount / studentAttendance.length) * 100 : 0;
      
      return {
        student,
        average: Math.round(average),
        attendanceRate: Math.round(attendanceRate),
        assignmentsCompleted: studentGrades.length,
        totalAttendanceRecords: studentAttendance.length
      };
    });
  };

  const generateGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    const studentReports = generateStudentReport();
    
    studentReports.forEach(report => {
      if (report.average >= 90) distribution.A++;
      else if (report.average >= 80) distribution.B++;
      else if (report.average >= 70) distribution.C++;
      else if (report.average >= 60) distribution.D++;
      else distribution.F++;
    });
    
    return distribution;
  };

const generateAssignmentStats = () => {
    return assignments.map(assignment => {
      const assignmentGrades = grades.filter(g => g.assignment_id_c === assignment.Id);
      const totalScore = assignmentGrades.reduce((sum, g) => sum + g.score_c, 0);
      const average = assignmentGrades.length > 0 ? totalScore / assignmentGrades.length : 0;
      const percentage = (average / assignment.total_points_c) * 100;
      
      return {
        assignment,
        studentsGraded: assignmentGrades.length,
        average: Math.round(average * 10) / 10,
        percentage: Math.round(percentage)
      };
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={loadData} message={error} />;
  }

  const studentReports = generateStudentReport();
  const gradeDistribution = generateGradeDistribution();
  const assignmentStats = generateAssignmentStats();

  const reportTabs = [
    { id: "overview", name: "Overview", icon: "BarChart3" },
    { id: "students", name: "Student Performance", icon: "Users" },
    { id: "assignments", name: "Assignment Analysis", icon: "FileText" },
    { id: "grades", name: "Grade Distribution", icon: "TrendingUp" }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analyze student performance and class statistics</p>
        </div>
        <Button variant="outline">
          <ApperIcon name="Download" className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Report Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {reportTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                activeReport === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Report */}
      {activeReport === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="gradient" className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-3">
                <ApperIcon name="Users" className="h-6 w-6 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              <p className="text-sm text-gray-600">Total Students</p>
            </Card>

            <Card variant="gradient" className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-lg mb-3">
                <ApperIcon name="FileText" className="h-6 w-6 text-success-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              <p className="text-sm text-gray-600">Assignments</p>
            </Card>

            <Card variant="gradient" className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-warning-100 to-warning-200 rounded-lg mb-3">
                <ApperIcon name="BookOpen" className="h-6 w-6 text-warning-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
              <p className="text-sm text-gray-600">Grades Recorded</p>
            </Card>

            <Card variant="gradient" className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-info-100 to-info-200 rounded-lg mb-3">
                <ApperIcon name="Calendar" className="h-6 w-6 text-info-600" />
              </div>
<p className="text-2xl font-bold text-gray-900">
                {Math.round((attendance.filter(a => a.status_c === "Present").length / attendance.length) * 100) || 0}%
              </p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </Card>
          </div>
        </div>
      )}

      {/* Student Performance Report */}
      {activeReport === "students" && (
        <Card variant="elevated" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Student Performance Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Average</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Rate</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentReports.map(report => (
                  <tr key={report.student.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center">
                        <img
                          src={report.student.photo_c}
                          alt={`${report.student.first_name_c} ${report.student.last_name_c}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {report.student.first_name_c} {report.student.last_name_c}
                          </div>
                          <div className="text-sm text-gray-500">{report.student.email_c}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge variant={
                        report.average >= 90 ? "success" :
                        report.average >= 80 ? "primary" :
                        report.average >= 70 ? "warning" : "error"
                      }>
                        {report.average}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge variant={report.attendanceRate >= 90 ? "success" : "warning"}>
                        {report.attendanceRate}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {report.assignmentsCompleted}/{assignments.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Assignment Analysis Report */}
      {activeReport === "assignments" && (
        <Card variant="elevated" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Assignment Performance Analysis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Students Graded</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Average %</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignmentStats.map(stat => (
                  <tr key={stat.assignment.Id} className="hover:bg-gray-50">
<td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{stat.assignment.title_c}</div>
                        <div className="text-sm text-gray-500">{stat.assignment.category_c} • {stat.assignment.total_points_c} pts</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {stat.studentsGraded}/{students.length}
                    </td>
<td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {stat.average}/{stat.assignment.total_points_c}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge variant={
                        stat.percentage >= 90 ? "success" :
                        stat.percentage >= 80 ? "primary" :
                        stat.percentage >= 70 ? "warning" : "error"
                      }>
                        {stat.percentage}%
                      </Badge>
                    </td>
<td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {format(new Date(stat.assignment.due_date_c), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Grade Distribution Report */}
      {activeReport === "grades" && (
        <div className="space-y-6">
          <Card variant="elevated" className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Grade Distribution</h3>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${
                    grade === "A" ? "bg-gradient-to-br from-success-100 to-success-200 text-success-700" :
                    grade === "B" ? "bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700" :
                    grade === "C" ? "bg-gradient-to-br from-warning-100 to-warning-200 text-warning-700" :
                    grade === "D" ? "bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700" :
                    "bg-gradient-to-br from-error-100 to-error-200 text-error-700"
                  }`}>
                    {count}
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-2">Grade {grade}</p>
                  <p className="text-xs text-gray-500">
                    {students.length > 0 ? Math.round((count / students.length) * 100) : 0}%
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Reports;