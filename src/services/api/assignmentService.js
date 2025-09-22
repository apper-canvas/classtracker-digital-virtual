class AssignmentService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}}, 
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "total_points_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_date_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords('assignment_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}}, 
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "total_points_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_date_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('assignment_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Assignment not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      throw new Error("Assignment not found");
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [{
          Name: assignmentData.title,
          title_c: assignmentData.title,
          description_c: assignmentData.description,
          category_c: assignmentData.category,
          total_points_c: parseInt(assignmentData.totalPoints),
          due_date_c: assignmentData.dueDate,
          created_date_c: new Date().toISOString().split('T')[0]
        }]
      };
      
      const response = await this.apperClient.createRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, assignmentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          title_c: assignmentData.title,
          description_c: assignmentData.description,
          category_c: assignmentData.category,
          total_points_c: parseInt(assignmentData.totalPoints),
          due_date_c: assignmentData.dueDate
        }]
      };
      
      const response = await this.apperClient.updateRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error(`Error updating assignment ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('assignment_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error(`Error deleting assignment ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new AssignmentService();
export default new AssignmentService();