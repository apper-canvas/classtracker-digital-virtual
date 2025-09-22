import React, { useState, useRef } from "react";
import DashboardStats from "@/components/organisms/DashboardStats";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import { toast } from "react-toastify";

const AddStudentModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    date_of_birth_c: "",
    photo_c: "",
    parent_contact_c: "",
    address_c: "",
    emergency_contact_c: "",
    Tags: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = "First name is required";
    }
    
    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = "Last name is required";
    }
    
    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email address";
    }
    
    if (!formData.date_of_birth_c) {
      newErrors.date_of_birth_c = "Date of birth is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await studentService.create(formData);
      toast.success("Student created successfully!");
      setFormData({
        first_name_c: "",
        last_name_c: "",
        email_c: "",
        date_of_birth_c: "",
        photo_c: "",
        parent_contact_c: "",
        address_c: "",
        emergency_contact_c: "",
        Tags: ""
      });
      setErrors({});
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error(error.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Student" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <Input
              name="first_name_c"
              value={formData.first_name_c}
              onChange={handleChange}
              placeholder="Enter first name"
              className={errors.first_name_c ? "border-red-500" : ""}
            />
            {errors.first_name_c && (
              <p className="text-red-500 text-xs mt-1">{errors.first_name_c}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <Input
              name="last_name_c"
              value={formData.last_name_c}
              onChange={handleChange}
              placeholder="Enter last name"
              className={errors.last_name_c ? "border-red-500" : ""}
            />
            {errors.last_name_c && (
              <p className="text-red-500 text-xs mt-1">{errors.last_name_c}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              name="email_c"
              type="email"
              value={formData.email_c}
              onChange={handleChange}
              placeholder="Enter email address"
              className={errors.email_c ? "border-red-500" : ""}
            />
            {errors.email_c && (
              <p className="text-red-500 text-xs mt-1">{errors.email_c}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <Input
              name="date_of_birth_c"
              type="date"
              value={formData.date_of_birth_c}
              onChange={handleChange}
              className={errors.date_of_birth_c ? "border-red-500" : ""}
            />
            {errors.date_of_birth_c && (
              <p className="text-red-500 text-xs mt-1">{errors.date_of_birth_c}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL
            </label>
            <Input
              name="photo_c"
              value={formData.photo_c}
              onChange={handleChange}
              placeholder="Enter photo URL (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Contact
            </label>
            <Input
              name="parent_contact_c"
              value={formData.parent_contact_c}
              onChange={handleChange}
              placeholder="Enter parent contact number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact
            </label>
            <Input
              name="emergency_contact_c"
              value={formData.emergency_contact_c}
              onChange={handleChange}
              placeholder="Enter emergency contact"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <Input
              name="Tags"
              value={formData.Tags}
              onChange={handleChange}
              placeholder="Enter tags (comma separated)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <Textarea
            name="address_c"
            value={formData.address_c}
            onChange={handleChange}
            placeholder="Enter student address"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Student"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const Dashboard = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const dashboardStatsRef = useRef();

  const handleAddStudent = () => {
    setShowAddModal(true);
  };

  const handleStudentAdded = () => {
    // Optionally refresh dashboard stats after adding student
    if (dashboardStatsRef.current && dashboardStatsRef.current.refreshStats) {
      dashboardStatsRef.current.refreshStats();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening in your classroom.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={handleAddStudent}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span>Add Student</span>
          </Button>
        </div>
      </div>
      
      <DashboardStats ref={dashboardStatsRef} />
      
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleStudentAdded}
      />
    </div>
  );
};

export default Dashboard;