class StudentService {
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
          {"field": {"Name": "first_name_c"}}, 
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"Name": "parent_contact_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords('student_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}}, 
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"Name": "parent_contact_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('student_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Student not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      throw new Error("Student not found");
    }
  }

  async create(studentData) {
    try {
      const params = {
        records: [{
          Name: `${studentData.first_name_c} ${studentData.last_name_c}`,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          date_of_birth_c: studentData.date_of_birth_c,
          enrollment_date_c: new Date().toISOString().split('T')[0],
          photo_c: studentData.photo_c || "",
          parent_contact_c: studentData.parent_contact_c || "",
          address_c: studentData.address_c || "",
          emergency_contact_c: studentData.emergency_contact_c || ""
        }]
      };
      
      const response = await this.apperClient.createRecord('student_c', params);
      
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
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, studentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          date_of_birth_c: studentData.date_of_birth_c,
          photo_c: studentData.photo_c || "",
          parent_contact_c: studentData.parent_contact_c || "",
          address_c: studentData.address_c || "",
          emergency_contact_c: studentData.emergency_contact_c || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord('student_c', params);
      
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
      console.error(`Error updating student ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('student_c', params);
      
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
      console.error(`Error deleting student ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async search(query) {
    try {
      const lowerQuery = query.toLowerCase();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}}, 
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "photo_c"}},
          {"field": {"Name": "parent_contact_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "emergency_contact_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [lowerQuery]},
                {"fieldName": "last_name_c", "operator": "Contains", "values": [lowerQuery]},
                {"fieldName": "email_c", "operator": "Contains", "values": [lowerQuery]}
              ],
              "operator": "OR"
            }
          ]
        }]
      };
      
      const response = await this.apperClient.fetchRecords('student_c', params);
      
      return response.data || [];
    } catch (error) {
      console.error(`Error searching students with query "${query}":`, error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new StudentService();