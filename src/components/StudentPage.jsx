import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        console.error('No token found, cannot fetch courses.');
        return;
      }

      try {
        const response = await axios.get('https://localhost:7116/api/Courses/allcourses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching courses:', error.response?.data || error.message);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  const handleTakeQuiz = async (courseId) => {
    try {
      const token = localStorage.getItem('jwt');
      const res = await axios.get(`https://localhost:7116/api/assessments/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.questions) {
        const parsedQuestions = JSON.parse(res.data.questions);
        setSelectedAssessment({ ...res.data, questions: parsedQuestions });
        setAnswers({});
      } else {
        console.warn('No questions found for this course.');
      }
    } catch (err) {
      console.error('Error fetching quiz:', err.response?.data || err.message);
    }
  };

  const handleOptionChange = (qIndex, selectedOption) => {
    setAnswers(prev => ({ ...prev, [qIndex]: selectedOption }));
  };

  const handleSubmitQuiz = async () => {
    let correct = 0;
    selectedAssessment.questions.forEach((q, i) => {
      if (answers[i] === q.Answer) correct++;
    });

    const token = localStorage.getItem('jwt');

    try {
      await axios.post(
        'https://localhost:7116/api/Result',
        {
          assessmentId: selectedAssessment.assessmentId,
          score: correct,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`✅ You scored ${correct} out of ${selectedAssessment.questions.length}`);
      setSelectedAssessment(null);
    } catch (err) {
      console.error('Failed to submit result:', err.response?.data || err.message);
      alert('Failed to submit result.');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Student Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      {selectedAssessment ? (
        <div className="quiz-section">
          <h3 className="mb-4">{selectedAssessment.title}</h3>
          {selectedAssessment.questions.map((q, index) => (
            <div key={index} className="mb-4 border-bottom pb-3">
              <h5>{index + 1}. {q.QuestionText}</h5>
              {q.Options.map((option, optIndex) => (
                <div className="form-check" key={optIndex}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleOptionChange(index, option)}
                    id={`q-${index}-opt-${optIndex}`}
                  />
                  <label className="form-check-label" htmlFor={`q-${index}-opt-${optIndex}`}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button className="btn btn-success mt-3" onClick={handleSubmitQuiz}>
            Submit Quiz
          </button>
        </div>
      ) : (
        <>
          <h3 className="mb-4">Available Courses</h3>
          {courses.length === 0 ? (
            <div className="alert alert-warning">No courses available.</div>
          ) : (
            <div className="row">
              {courses.map(course => (
                <div className="col-md-4" key={course.courseId}>
                  <div className="card h-100 shadow-sm mb-4 border-0">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{course.title}</h5>
                      <p className="card-text flex-grow-1">{course.description}</p>
                      <div className="d-flex justify-content-between">
                        <a
                          href={course.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary"
                        >
                          View Media
                        </a>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleTakeQuiz(course.courseId)}
                        >
                          Take Quiz
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StudentDashboard;
