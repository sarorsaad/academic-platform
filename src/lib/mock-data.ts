export const mockStudents = [
  {
    id: "1",
    name: "John Smith",
    grade: 10,
    courses: [
      {
        id: "c1",
        title: "Advanced Mathematics",
        progress: 75,
        grade: 88,
        attendance: 95,
        lastActive: new Date("2024-01-15"),
      },
      {
        id: "c2",
        title: "Physics",
        progress: 60,
        grade: 92,
        attendance: 88,
        lastActive: new Date("2024-01-16"),
      },
      {
        id: "c3",
        title: "Computer Science",
        progress: 85,
        grade: 95,
        attendance: 92,
        lastActive: new Date("2024-01-17"),
      },
    ],
  },
  {
    id: "2",
    name: "Emma Johnson",
    grade: 11,
    courses: [
      {
        id: "c4",
        title: "Literature",
        progress: 90,
        grade: 94,
        attendance: 98,
        lastActive: new Date("2024-01-15"),
      },
      {
        id: "c5",
        title: "Biology",
        progress: 70,
        grade: 86,
        attendance: 90,
        lastActive: new Date("2024-01-16"),
      },
      {
        id: "c6",
        title: "Chemistry",
        progress: 80,
        grade: 89,
        attendance: 93,
        lastActive: new Date("2024-01-17"),
      },
    ],
  },
]

export const mockCourses = [
  {
    id: "c1",
    title: "Advanced Mathematics",
    description: "Advanced topics in algebra, calculus, and geometry",
    instructor: "Dr. Sarah Wilson",
    enrolledStudents: 25,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-06-30"),
    schedule: "Mon, Wed 10:00 AM",
    materials: [
      { id: "m1", title: "Week 1 Notes", type: "pdf" },
      { id: "m2", title: "Practice Problems", type: "doc" },
    ],
  },
  {
    id: "c2",
    title: "Physics",
    description: "Fundamentals of mechanics and thermodynamics",
    instructor: "Prof. James Brown",
    enrolledStudents: 20,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-06-30"),
    schedule: "Tue, Thu 11:00 AM",
    materials: [
      { id: "m3", title: "Lab Manual", type: "pdf" },
      { id: "m4", title: "Lecture Slides", type: "ppt" },
    ],
  },
]

export const mockAssignments = [
  {
    id: "a1",
    courseId: "c1",
    title: "Calculus Quiz 1",
    dueDate: new Date("2024-01-20"),
    totalPoints: 100,
    type: "quiz",
    status: "pending",
  },
  {
    id: "a2",
    courseId: "c1",
    title: "Algebra Project",
    dueDate: new Date("2024-01-25"),
    totalPoints: 150,
    type: "project",
    status: "submitted",
  },
]

export const mockGrades = {
  a1: {
    score: 85,
    feedback: "Good work on derivatives, review integration",
    submittedAt: new Date("2024-01-19"),
  },
  a2: {
    score: 92,
    feedback: "Excellent project presentation",
    submittedAt: new Date("2024-01-24"),
  },
}

export const mockAnnouncements = [
  {
    id: "an1",
    courseId: "c1",
    title: "Midterm Date Change",
    content: "The midterm exam has been moved to next week",
    createdAt: new Date("2024-01-10"),
    author: "Dr. Sarah Wilson",
  },
  {
    id: "an2",
    courseId: "c2",
    title: "Lab Equipment Update",
    content: "New physics lab equipment has arrived",
    createdAt: new Date("2024-01-12"),
    author: "Prof. James Brown",
  },
]
