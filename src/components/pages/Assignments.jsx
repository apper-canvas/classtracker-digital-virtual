import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import Modal from "@/components/molecules/Modal";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import assignmentService from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    totalPoints: "",
    dueDate: ""
  });

  const categories = [
    "Quiz", "Test", "Essay", "Project", "Lab", "Homework", "Portfolio", "Assessment"
  ];

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assignmentService.getAll();
      setAssignments(data);
      setFilteredAssignments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = assignments.filter(assignment =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAssignments(filtered);
    } else {
      setFilteredAssignments(assignments);
    }
  }, [searchQuery, assignments]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      totalPoints: "",
      dueDate: ""
    });
    setEditingAssignment(null);
  };

  const handleShowForm = (assignment = null) => {
    if (assignment) {
      setFormData({
        title: assignment.title,
        description: assignment.description,
        category: assignment.category,
        totalPoints: assignment.totalPoints.toString(),
        dueDate: assignment.dueDate
      });
      setEditingAssignment(assignment);
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.totalPoints || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const assignmentData = {
        ...formData,
        totalPoints: parseInt(formData.totalPoints)
      };

      if (editingAssignment) {
        const updatedAssignment = await assignmentService.update(editingAssignment.Id, assignmentData);
        setAssignments(prev => prev.map(a => a.Id === editingAssignment.Id ? updatedAssignment : a));
        toast.success("Assignment updated successfully");
      } else {
        const newAssignment = await assignmentService.create(assignmentData);
        setAssignments(prev => [...prev, newAssignment]);
        toast.success("Assignment created successfully");
      }
      
      handleCloseForm();
    } catch (error) {
      toast.error("Failed to save assignment");
    }
  };

  const handleDelete = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    
    try {
      await assignmentService.delete(assignmentId);
      setAssignments(prev => prev.filter(a => a.Id !== assignmentId));
      toast.success("Assignment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete assignment");
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Quiz": "primary",
      "Test": "error",
      "Essay": "info",
      "Project": "success",
      "Lab": "warning",
      "Homework": "default",
      "Portfolio": "primary",
      "Assessment": "error"
    };
    return colors[category] || "default";
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={loadAssignments} message={error} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Create and manage class assignments</p>
        </div>
        <div className="flex items-center space-x-3">
          <SearchBar
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full sm:w-80"
          />
          <Button onClick={() => handleShowForm()}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Assignment
          </Button>
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <Empty
          title={searchQuery ? "No assignments found" : "No assignments yet"}
          message={searchQuery ? "Try adjusting your search terms." : "Start by creating your first assignment."}
          icon="FileText"
          actionLabel={!searchQuery ? "Create Assignment" : undefined}
          onAction={!searchQuery ? () => handleShowForm() : undefined}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssignments.map((assignment, index) => (
            <motion.div
              key={assignment.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card variant="interactive" className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Badge variant={getCategoryColor(assignment.category)} className="mb-2">
                      {assignment.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {assignment.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleShowForm(assignment)}
                    >
                      <ApperIcon name="Edit" className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(assignment.Id)}
                      className="text-error-600 hover:text-error-700"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-gray-600">Points</p>
                        <p className="font-semibold text-gray-900">{assignment.totalPoints}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Due Date</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(assignment.dueDate), "MMM d")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        title={editingAssignment ? "Edit Assignment" : "Create Assignment"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Assignment Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter assignment title"
              required
            />
            
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          </div>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe the assignment requirements..."
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Total Points"
              value={formData.totalPoints}
              onChange={(e) => handleChange("totalPoints", e.target.value)}
              placeholder="100"
              min="1"
              required
            />
            
            <Input
              type="date"
              label="Due Date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={handleCloseForm}>
              Cancel
            </Button>
            <Button type="submit">
              {editingAssignment ? "Update Assignment" : "Create Assignment"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Assignments;