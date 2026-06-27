import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Plus,
  Trash2,
} from 'lucide-react'
import './App.css'

type Course = {
  id: number
  year: number
  semester: string
  code: string
  title: string
  level: number
  credits: number
  score: number
  grade: string
  category: 'Programming' | 'Web' | 'Database' | 'Analysis' | 'Management' | 'UX' | 'Game'
}

const gradePoints: Record<string, number> = {
  'A+': 9,
  A: 8,
  'A-': 7,
  'B+': 6,
  B: 5,
  'B-': 4,
  'C+': 3,
  C: 2,
  'C-': 1,
}

const initialCourses: Course[] = [
  {
    id: 1,
    year: 2023,
    semester: 'Semester One',
    code: '159101',
    title: 'Applied Programming',
    level: 100,
    credits: 15,
    score: 78,
    grade: 'B+',
    category: 'Programming',
  },
  {
    id: 2,
    year: 2023,
    semester: 'Semester Two',
    code: '159102',
    title: 'Computer Science and Programming',
    level: 100,
    credits: 15,
    score: 93,
    grade: 'A+',
    category: 'Programming',
  },
  {
    id: 3,
    year: 2024,
    semester: 'Semester One',
    code: '159201',
    title: 'Algorithms and Data Structures',
    level: 200,
    credits: 15,
    score: 80,
    grade: 'A-',
    category: 'Programming',
  },
  {
    id: 4,
    year: 2024,
    semester: 'Semester One',
    code: '159234',
    title: 'Object-Oriented Programming',
    level: 200,
    credits: 15,
    score: 88,
    grade: 'A',
    category: 'Programming',
  },
  {
    id: 5,
    year: 2024,
    semester: 'Semester Two',
    code: '158258',
    title: 'Web Development',
    level: 200,
    credits: 15,
    score: 77,
    grade: 'B+',
    category: 'Web',
  },
  {
    id: 6,
    year: 2024,
    semester: 'Semester Two',
    code: '159251',
    title: 'Software Engineering Design and Construction',
    level: 200,
    credits: 15,
    score: 84,
    grade: 'A-',
    category: 'Analysis',
  },
  {
    id: 7,
    year: 2025,
    semester: 'Semester One',
    code: '158225',
    title: 'Systems Analysis and Modelling',
    level: 200,
    credits: 15,
    score: 73,
    grade: 'B',
    category: 'Analysis',
  },
  {
    id: 8,
    year: 2025,
    semester: 'Semester One',
    code: '159261',
    title: 'Games Programming',
    level: 200,
    credits: 15,
    score: 91,
    grade: 'A+',
    category: 'Game',
  },
  {
    id: 9,
    year: 2025,
    semester: 'Semester Two',
    code: '158337',
    title: 'Database Development',
    level: 300,
    credits: 15,
    score: 78,
    grade: 'B+',
    category: 'Database',
  },
  {
    id: 10,
    year: 2025,
    semester: 'Semester Two',
    code: '158359',
    title: 'User Experience Design',
    level: 300,
    credits: 15,
    score: 76,
    grade: 'B+',
    category: 'UX',
  },
  {
    id: 11,
    year: 2025,
    semester: 'Semester Two',
    code: '157394',
    title: 'Managing Technology Projects and Programmes',
    level: 300,
    credits: 15,
    score: 75,
    grade: 'B+',
    category: 'Management',
  },
  {
    id: 12,
    year: 2026,
    semester: 'Semester One',
    code: '157340',
    title: 'Organisational Knowledge Management',
    level: 300,
    credits: 15,
    score: 77,
    grade: 'B+',
    category: 'Management',
  },
]

const categories: Course['category'][] = [
  'Programming',
  'Web',
  'Database',
  'Analysis',
  'Management',
  'UX',
  'Game',
]

const grades = Object.keys(gradePoints)

function scoreToGrade(score: number) {
  if (score >= 90) return 'A+'
  if (score >= 85) return 'A'
  if (score >= 80) return 'A-'
  if (score >= 75) return 'B+'
  if (score >= 70) return 'B'
  if (score >= 65) return 'B-'
  if (score >= 60) return 'C+'
  if (score >= 55) return 'C'
  return 'C-'
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-NZ', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value)
}

function App() {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [form, setForm] = useState({
    code: '',
    title: '',
    year: '2026',
    semester: 'Semester Two',
    level: '300',
    credits: '15',
    score: '85',
    grade: 'A',
    category: 'Programming' as Course['category'],
  })

  const stats = useMemo(() => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
    const weightedScore =
      courses.reduce((sum, course) => sum + course.score * course.credits, 0) /
      totalCredits
    const gpa =
      courses.reduce((sum, course) => sum + gradePoints[course.grade] * course.credits, 0) /
      totalCredits
    const highGrades = courses.filter((course) => gradePoints[course.grade] >= 7).length

    return {
      totalCredits,
      weightedScore,
      gpa,
      highGrades,
      courseCount: courses.length,
    }
  }, [courses])

  const chartData = useMemo(() => {
    return Object.values(
      courses.reduce<Record<string, { term: string; score: number; count: number }>>(
        (acc, course) => {
          const term = `${course.year} ${course.semester.replace('Semester ', 'S')}`
          if (!acc[term]) acc[term] = { term, score: 0, count: 0 }
          acc[term].score += course.score
          acc[term].count += 1
          return acc
        },
        {},
      ),
    ).map((entry) => ({
      term: entry.term,
      average: Number((entry.score / entry.count).toFixed(1)),
    }))
  }, [courses])

  const categoryData = useMemo(() => {
    return categories.map((category) => {
      const matched = courses.filter((course) => course.category === category)
      const average =
        matched.length === 0
          ? 0
          : matched.reduce((sum, course) => sum + course.score, 0) / matched.length
      return { category, average, count: matched.length }
    })
  }, [courses])

  function addCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextScore = Number(form.score)
    const nextCourse: Course = {
      id: Date.now(),
      year: Number(form.year),
      semester: form.semester,
      code: form.code.trim() || 'NEW101',
      title: form.title.trim() || 'New Course',
      level: Number(form.level),
      credits: Number(form.credits),
      score: nextScore,
      grade: form.grade || scoreToGrade(nextScore),
      category: form.category,
    }

    setCourses((current) => [...current, nextCourse])
    setForm((current) => ({
      ...current,
      code: '',
      title: '',
      score: '85',
      grade: 'A',
    }))
  }

  function removeCourse(id: number) {
    setCourses((current) => current.filter((course) => course.id !== id))
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Portfolio project</p>
          <h1>Student Performance Tracker</h1>
          <p className="summary">
            A course, GPA, trend, and QA-ready dashboard built from a real software
            engineering transcript.
          </p>
        </div>
        <div className="role-strip" aria-label="Target roles">
          <span>QA Automation</span>
          <span>Junior Software</span>
          <span>Technical BA</span>
        </div>
      </header>

      <section className="metrics-grid" aria-label="Performance summary">
        <article className="metric">
          <GraduationCap aria-hidden="true" />
          <span>Total credits</span>
          <strong>{stats.totalCredits}</strong>
        </article>
        <article className="metric">
          <BarChart3 aria-hidden="true" />
          <span>Weighted average</span>
          <strong data-testid="weighted-average">{formatNumber(stats.weightedScore)}</strong>
        </article>
        <article className="metric">
          <BookOpen aria-hidden="true" />
          <span>GPA estimate</span>
          <strong data-testid="gpa-value">{formatNumber(stats.gpa)}</strong>
        </article>
        <article className="metric">
          <CheckCircle2 aria-hidden="true" />
          <span>A range courses</span>
          <strong>{stats.highGrades}/{stats.courseCount}</strong>
        </article>
      </section>

      <section className="workspace">
        <div className="panel trend-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Academic trend</p>
              <h2>Average score by term</h2>
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ left: -12, right: 12, top: 12, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="term" tickLine={false} axisLine={false} tickMargin={12} />
                <YAxis domain={[65, 95]} tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="average"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#scoreFill)"
                  name="Average score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <form className="panel course-form" onSubmit={addCourse} aria-label="Add course form">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Add evidence</p>
              <h2>New course result</h2>
            </div>
            <button className="icon-button" type="submit" aria-label="Add course">
              <Plus size={18} />
            </button>
          </div>
          <label>
            Course code
            <input
              value={form.code}
              onChange={(event) => setForm({ ...form, code: event.target.value })}
              placeholder="158337"
            />
          </label>
          <label>
            Course title
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Database Development"
            />
          </label>
          <div className="form-row">
            <label>
              Score
              <input
                data-testid="score-input"
                type="number"
                min="0"
                max="100"
                value={form.score}
                onChange={(event) => {
                  const nextScore = Number(event.target.value)
                  setForm({
                    ...form,
                    score: event.target.value,
                    grade: scoreToGrade(nextScore),
                  })
                }}
              />
            </label>
            <label>
              Grade
              <select
                value={form.grade}
                onChange={(event) => setForm({ ...form, grade: event.target.value })}
              >
                {grades.map((grade) => (
                  <option key={grade}>{grade}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Year
              <input
                type="number"
                value={form.year}
                onChange={(event) => setForm({ ...form, year: event.target.value })}
              />
            </label>
            <label>
              Category
              <select
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value as Course['category'] })
                }
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
        </form>
      </section>

      <section className="workspace secondary">
        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Skill profile</p>
              <h2>Category strength</h2>
            </div>
          </div>
          <div className="category-list">
            {categoryData.map((item) => (
              <div className="category-row" key={item.category}>
                <div>
                  <strong>{item.category}</strong>
                  <span>{item.count} courses</span>
                </div>
                <meter min="0" max="100" value={item.average} />
                <b>{item.average ? item.average.toFixed(1) : '-'}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="panel qa-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">QA automation scope</p>
              <h2>Test cases included</h2>
            </div>
            <ClipboardCheck aria-hidden="true" />
          </div>
          <ul className="checklist">
            <li>Dashboard renders GPA and weighted average.</li>
            <li>Adding a course updates summary metrics.</li>
            <li>Score input maps to the correct letter grade.</li>
            <li>Course deletion removes the row from the table.</li>
          </ul>
        </div>
      </section>

      <section className="panel table-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Transcript model</p>
            <h2>Course records</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Code</th>
                <th>Course</th>
                <th>Category</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.year}</td>
                  <td>{course.code}</td>
                  <td>{course.title}</td>
                  <td>{course.category}</td>
                  <td>{course.score}</td>
                  <td>
                    <span className="grade-pill">{course.grade}</span>
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      aria-label={`Delete ${course.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default App
