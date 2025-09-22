import gradesData from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    await this.delay(200);
    return [...this.grades];
  }

  async getById(id) {
    await this.delay(150);
    const grade = this.grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  }

  async getByStudentId(studentId) {
    await this.delay(250);
    return this.grades.filter(g => g.studentId === parseInt(studentId));
  }

  async getByAssignmentId(assignmentId) {
    await this.delay(250);
    return this.grades.filter(g => g.assignmentId === parseInt(assignmentId));
  }

  async create(gradeData) {
    await this.delay(300);
    const newId = Math.max(...this.grades.map(g => g.Id), 0) + 1;
    const newGrade = {
      Id: newId,
      ...gradeData,
      submittedDate: new Date().toISOString().split('T')[0]
    };
    this.grades.push(newGrade);
    return { ...newGrade };
  }

  async update(id, gradeData) {
    await this.delay(300);
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    this.grades[index] = { ...this.grades[index], ...gradeData };
    return { ...this.grades[index] };
  }

  async delete(id) {
    await this.delay(200);
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    this.grades.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new GradeService();