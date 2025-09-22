class GradeService {
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
          {"field": {"Name": "student_id_c"}}, 
          {"field": {"Name": "assignment_id_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "submitted_date_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords('grade_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}}, 
          {"field": {"Name": "assignment_id_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "submitted_date_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('grade_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Grade not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      throw new Error("Grade not found");
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}}, 
          {"field": {"Name": "assignment_id_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "submitted_date_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "student_id_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}]
      };
      
      const response = await this.apperClient.fetchRecords('grade_c', params);
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching grades for student ${studentId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async getByAssignmentId(assignmentId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}}, 
          {"field": {"Name": "assignment_id_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "submitted_date_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "assignment_id_c", "Operator": "EqualTo", "Values": [parseInt(assignmentId)]}]
      };
      
      const response = await this.apperClient.fetchRecords('grade_c', params);
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching grades for assignment ${assignmentId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async create(gradeData) {
    try {
      const params = {
        records: [{
          Name: `Grade-${Date.now()}`,
          student_id_c: parseInt(gradeData.student_id_c),
          assignment_id_c: parseInt(gradeData.assignment_id_c),
          score_c: parseFloat(gradeData.score_c),
          submitted_date_c: new Date().toISOString().split('T')[0],
          notes_c: gradeData.notes_c || ""
        }]
      };
      
      const response = await this.apperClient.createRecord('grade_c', params);
      
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
      console.error("Error creating grade:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, gradeData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          student_id_c: parseInt(gradeData.student_id_c),
          assignment_id_c: parseInt(gradeData.assignment_id_c),
          score_c: parseFloat(gradeData.score_c),
          notes_c: gradeData.notes_c || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord('grade_c', params);
      
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
      console.error(`Error updating grade ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('grade_c', params);
      
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
      console.error(`Error deleting grade ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new GradeService();