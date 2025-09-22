import studentsData from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.students = [...studentsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.students];
  }

  async getById(id) {
    await this.delay(200);
    const student = this.students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  }

  async create(studentData) {
    await this.delay(400);
    const newId = Math.max(...this.students.map(s => s.Id), 0) + 1;
    const newStudent = {
      Id: newId,
      ...studentData,
      enrollmentDate: new Date().toISOString().split('T')[0]
    };
    this.students.push(newStudent);
    return { ...newStudent };
  }

  async update(id, studentData) {
    await this.delay(350);
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students[index] = { ...this.students[index], ...studentData };
    return { ...this.students[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students.splice(index, 1);
    return true;
  }

  async search(query) {
    await this.delay(200);
    const lowerQuery = query.toLowerCase();
    return this.students.filter(student => 
      student.firstName.toLowerCase().includes(lowerQuery) ||
      student.lastName.toLowerCase().includes(lowerQuery) ||
      student.email.toLowerCase().includes(lowerQuery)
    );
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new StudentService();