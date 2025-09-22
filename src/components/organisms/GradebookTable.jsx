import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/molecules/Modal";
import GradeForm from "@/components/molecules/GradeForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import assignmentService from "@/services/api/assignmentService";
import gradeService from "@/services/api/gradeService";
import { toast } from "react-toastify";

const GradebookTable = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [studentsData, assignmentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getGradeForStudentAssignment = (studentId, assignmentId) => {
    return grades.find(grade => 
      grade.studentId === studentId && grade.assignmentId === assignmentId
    );
  };

  const calculatePercentage = (score, totalPoints) => {
    return Math.round((score / totalPoints) * 100);
  };

  const getGradeStatus = (percentage) => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "primary";
    if (percentage >= 70) return "warning";
    return "error";
  };

  const handleAddGrade = async (gradeData) => {
    try {
      const newGrade = await gradeService.create(gradeData);
      setGrades(prev => [...prev, newGrade]);
      setShowGradeForm(false);
      toast.success("Grade added successfully");
    } catch (error) {
      toast.error("Failed to add grade");
    }
  };

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setShowGradeForm(true);
  };

  const handleUpdateGrade = async (gradeData) => {
    try {
      const updatedGrade = await gradeService.update(editingGrade.Id, gradeData);
      setGrades(prev => prev.map(g => g.Id === editingGrade.Id ? updatedGrade : g));
      setShowGradeForm(false);
      setEditingGrade(null);
      toast.success("Grade updated successfully");
    } catch (error) {
      toast.error("Failed to update grade");
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) return;
    
    try {
      await gradeService.delete(gradeId);
      setGrades(prev => prev.filter(g => g.Id !== gradeId));
      toast.success("Grade deleted successfully");
    } catch (error) {
      toast.error("Failed to delete grade");
    }
  };

  const handleCloseForm = () => {
    setShowGradeForm(false);
    setEditingGrade(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={loadData} message={error} />;
  }

  if (students.length === 0 || assignments.length === 0) {
    return (
      <Empty
        title="Gradebook Not Ready"
        message="You need both students and assignments before you can start grading."
        icon="BookOpen"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gradebook</h2>
          <p className="text-gray-600">Manage student grades and assignments</p>
        </div>
        <Button onClick={() => setShowGradeForm(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Grade
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Student
                </th>
                {assignments.map(assignment => (
                  <th key={assignment.Id} className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    <div>
                      <div className="font-semibold">{assignment.title}</div>
                      <div className="text-xs text-gray-400">{assignment.totalPoints} pts</div>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => {
                const studentGrades = grades.filter(g => g.studentId === student.Id);
                const totalScore = studentGrades.reduce((sum, g) => {
                  const assignment = assignments.find(a => a.Id === g.assignmentId);
                  return sum + (g.score / assignment.totalPoints) * 100;
                }, 0);
                const average = studentGrades.length > 0 ? totalScore / studentGrades.length : 0;
                
                return (
                  <motion.tr
                    key={student.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-200">
                      <div className="flex items-center">
                        <img
                          src={student.photo}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {assignments.map(assignment => {
                      const grade = getGradeForStudentAssignment(student.Id, assignment.Id);
                      const percentage = grade ? calculatePercentage(grade.score, assignment.totalPoints) : null;
                      
                      return (
                        <td key={assignment.Id} className="px-4 py-4 text-center">
                          {grade ? (
                            <div className="space-y-1">
                              <Badge 
                                variant={getGradeStatus(percentage)}
                                className="cursor-pointer"
                                onClick={() => handleEditGrade(grade)}
                              >
                                {grade.score}/{assignment.totalPoints}
                              </Badge>
                              <div className="text-xs text-gray-500">{percentage}%</div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingGrade({
                                  studentId: student.Id,
                                  assignmentId: assignment.Id
                                });
                                setShowGradeForm(true);
                              }}
                              className="text-xs"
                            >
                              Add
                            </Button>
                          )}
                        </td>
                      );
                    })}
                    
                    <td className="px-6 py-4 text-center">
                      {average > 0 ? (
                        <Badge variant={getGradeStatus(average)}>
                          {Math.round(average)}%
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showGradeForm}
        onClose={handleCloseForm}
        title={editingGrade?.Id ? "Edit Grade" : "Add Grade"}
        size="lg"
      >
        <GradeForm
          initialData={editingGrade}
          students={students}
          assignments={assignments}
          onSubmit={editingGrade?.Id ? handleUpdateGrade : handleAddGrade}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  );
};

export default GradebookTable;