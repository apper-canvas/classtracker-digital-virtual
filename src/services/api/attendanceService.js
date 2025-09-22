class AttendanceService {
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords('attendance_c', params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}}, 
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('attendance_c', parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Attendance record not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance ${id}:`, error?.response?.data?.message || error);
      throw new Error("Attendance record not found");
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}}, 
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "student_id_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}]
      };
      
      const response = await this.apperClient.fetchRecords('attendance_c', params);
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching attendance for student ${studentId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async getByDate(date) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}}, 
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "date_c", "Operator": "EqualTo", "Values": [date]}]
      };
      
      const response = await this.apperClient.fetchRecords('attendance_c', params);
      
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching attendance for date ${date}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          Name: `Attendance-${attendanceData.date_c}-${attendanceData.student_id_c}`,
          student_id_c: parseInt(attendanceData.student_id_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c || ""
        }]
      };
      
      const response = await this.apperClient.createRecord('attendance_c', params);
      
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
      console.error("Error creating attendance:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, attendanceData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          student_id_c: parseInt(attendanceData.student_id_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord('attendance_c', params);
      
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
      console.error(`Error updating attendance ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('attendance_c', params);
      
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
      console.error(`Error deleting attendance ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new AttendanceService();