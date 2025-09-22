import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";

const GradeForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  students = [],
  assignments = []
}) => {
  const [formData, setFormData] = useState({
    studentId: "",
    assignmentId: "",
    score: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.studentId || "",
        assignmentId: initialData.assignmentId || "",
        score: initialData.score || "",
        notes: initialData.notes || ""
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.assignmentId || !formData.score) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedAssignment = assignments.find(a => a.Id === parseInt(formData.assignmentId));
    const score = parseFloat(formData.score);
    
    if (isNaN(score) || score < 0 || score > (selectedAssignment?.totalPoints || 100)) {
      toast.error(`Score must be between 0 and ${selectedAssignment?.totalPoints || 100} points`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        studentId: parseInt(formData.studentId),
        assignmentId: parseInt(formData.assignmentId),
        score: score
      });
      
      if (!initialData) {
        setFormData({
          studentId: "",
          assignmentId: "",
          score: "",
          notes: ""
        });
      }
    } catch (error) {
      toast.error("Failed to save grade");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAssignment = assignments.find(a => a.Id === parseInt(formData.assignmentId));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Student"
          value={formData.studentId}
          onChange={(e) => handleChange("studentId", e.target.value)}
          required
        >
          <option value="">Select a student</option>
          {students.map(student => (
            <option key={student.Id} value={student.Id}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </Select>

        <Select
          label="Assignment"
          value={formData.assignmentId}
          onChange={(e) => handleChange("assignmentId", e.target.value)}
          required
        >
          <option value="">Select an assignment</option>
          {assignments.map(assignment => (
            <option key={assignment.Id} value={assignment.Id}>
              {assignment.title} ({assignment.totalPoints} pts)
            </option>
          ))}
        </Select>
      </div>

      <Input
        type="number"
        label={`Score ${selectedAssignment ? `(out of ${selectedAssignment.totalPoints} points)` : ""}`}
        value={formData.score}
        onChange={(e) => handleChange("score", e.target.value)}
        min="0"
        max={selectedAssignment?.totalPoints || "100"}
        step="0.1"
        required
      />

      <Textarea
        label="Notes"
        placeholder="Optional notes about the grade..."
        value={formData.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        rows={3}
      />

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Grade" : "Add Grade"}
        </Button>
      </div>
    </form>
  );
};

export default GradeForm;