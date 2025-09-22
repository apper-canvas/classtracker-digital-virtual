import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Textarea from "@/components/atoms/Textarea";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const GradeForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = null,
  students = [],
  assignments = []
}) => {
const [formData, setFormData] = useState({
    student_id_c: "",
    assignment_id_c: "",
    score_c: "",
    notes_c: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
if (initialData) {
      setFormData({
        student_id_c: initialData.student_id_c || "",
        assignment_id_c: initialData.assignment_id_c || "",
        score_c: initialData.score_c || "",
        notes_c: initialData.notes_c || ""
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
    
if (!formData.student_id_c || !formData.assignment_id_c || !formData.score_c) {
      toast.error("Please fill in all required fields");
      return;
    }

const selectedAssignment = assignments.find(a => a.Id === parseInt(formData.assignment_id_c));
    const score = parseFloat(formData.score_c);
    
    if (isNaN(score) || score < 0 || score > (selectedAssignment?.total_points_c || 100)) {
      toast.error(`Score must be between 0 and ${selectedAssignment?.total_points_c || 100} points`);
      return;
    }

    setIsSubmitting(true);
    try {
await onSubmit({
        ...formData,
        student_id_c: parseInt(formData.student_id_c),
        assignment_id_c: parseInt(formData.assignment_id_c),
        score_c: score
      });
      
      if (!initialData) {
setFormData({
          student_id_c: "",
          assignment_id_c: "",
          score_c: "",
          notes_c: ""
        });
      }
    } catch (error) {
      toast.error("Failed to save grade");
    } finally {
      setIsSubmitting(false);
    }
  };

const selectedAssignment = assignments.find(a => a.Id === parseInt(formData.assignment_id_c));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
value={formData.student_id_c}
          onChange={(e) => handleChange("student_id_c", e.target.value)}
          required
        >
          <option value="">Select a student</option>
          {students.map(student => (
            <option key={student.Id} value={student.Id}>
              {student.first_name_c} {student.last_name_c}
            </option>
          ))}
        </Select>

        <Select
value={formData.assignment_id_c}
          onChange={(e) => handleChange("assignment_id_c", e.target.value)}
          required
        >
          <option value="">Select an assignment</option>
          {assignments.map(assignment => (
            <option key={assignment.Id} value={assignment.Id}>
              {assignment.title_c} ({assignment.total_points_c} pts)
            </option>
          ))}
</Select>
      </div>

      <Input
        label={`Score ${selectedAssignment ? `(out of ${selectedAssignment.total_points_c} points)` : ""}`}
        value={formData.score_c}
        onChange={(e) => handleChange("score_c", e.target.value)}
        min="0"
        max={selectedAssignment?.total_points_c || "100"}
        step="0.1"
        required
      />

      <Textarea
        label="Notes"
placeholder="Optional notes about the grade..."
        value={formData.notes_c}
        onChange={(e) => handleChange("notes_c", e.target.value)}
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