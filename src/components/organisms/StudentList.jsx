import React, { useState, useEffect } from "react";
import StudentCard from "@/components/molecules/StudentCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [studentsData, gradesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      setGrades(gradesData);
      setAttendance(attendanceData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = students.filter(student =>
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  const getStudentGrades = (studentId) => {
    return grades.filter(grade => grade.studentId === studentId);
  };

  const getStudentAttendance = (studentId) => {
    return attendance.filter(record => record.studentId === studentId);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={loadData} message={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-600">Manage your class roster and student information</p>
        </div>
        <SearchBar
          placeholder="Search students..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:w-80"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <Empty
          title={searchQuery ? "No students found" : "No students yet"}
          message={searchQuery ? "Try adjusting your search terms." : "Start by adding students to your class roster."}
          icon="Users"
          actionLabel={!searchQuery ? "Add Student" : undefined}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.Id}
              student={student}
              grades={getStudentGrades(student.Id)}
              attendance={getStudentAttendance(student.Id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;