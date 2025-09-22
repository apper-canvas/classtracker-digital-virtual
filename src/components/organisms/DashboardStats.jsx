import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import assignmentService from "@/services/api/assignmentService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [students, assignments, grades, attendance] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);

      // Calculate class average
      const totalScores = grades.reduce((sum, grade) => {
        const assignment = assignments.find(a => a.Id === grade.assignmentId);
        return sum + (grade.score / assignment.totalPoints) * 100;
      }, 0);
      const classAverage = grades.length > 0 ? totalScores / grades.length : 0;

      // Calculate attendance rate
      const totalAttendance = attendance.length;
      const presentCount = attendance.filter(record => record.status === "Present").length;
      const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

      // Recent activity
      const recentGrades = grades
        .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate))
        .slice(0, 5)
        .map(grade => {
          const student = students.find(s => s.Id === grade.studentId);
          const assignment = assignments.find(a => a.Id === grade.assignmentId);
          return { ...grade, student, assignment };
        });

      setStats({
        totalStudents: students.length,
        totalAssignments: assignments.length,
        classAverage: Math.round(classAverage),
        attendanceRate: Math.round(attendanceRate),
        recentGrades
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <Loading type="spinner" />;
  }

  if (error) {
    return <Error onRetry={loadStats} message={error} />;
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: "Users",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      title: "Assignments",
      value: stats.totalAssignments,
      icon: "FileText",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      title: "Class Average",
      value: `${stats.classAverage}%`,
      icon: "TrendingUp",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      icon: "Calendar",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="elevated" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.bgGradient}`}>
                  <ApperIcon 
                    name={stat.icon} 
                    className={`h-6 w-6 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card variant="elevated" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats.recentGrades.length > 0 ? (
            stats.recentGrades.map((grade, index) => (
              <motion.div
                key={grade.Id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={grade.student?.photo}
                    alt={`${grade.student?.firstName} ${grade.student?.lastName}`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {grade.student?.firstName} {grade.student?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{grade.assignment?.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {grade.score}/{grade.assignment?.totalPoints}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round((grade.score / grade.assignment?.totalPoints) * 100)}%
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent grades to display</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;