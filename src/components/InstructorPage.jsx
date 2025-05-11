import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './InstructorPage.css';

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [formCourse, setFormCourse] = useState({ title: '', description: '', file: null });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.get('https://localhost:7116/api/Courses/allcourses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        setCourses([]);
        console.error("Expected an array, got:", response.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormCourse(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFormSubmit = async () => {
    const token = localStorage.getItem('jwt');
    const formData = new FormData();
    console.log("Form data before submission:", formCourse);
    formData.append('title', formCourse.title);
    formData.append('description', formCourse.description);
    if (formCourse.file) formData.append('MediaFile', formCourse.file);

    try {
      if (editingId) {
        await axios.put(`https://localhost:7116/api/Courses/updatecourse/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('https://localhost:7116/api/Courses', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      await fetchCourses();
      setFormCourse({ title: '', description: '', file: null });
      setEditingId(null);
    } catch (error) {
      console.error(editingId ? "Error updating course:" : "Error adding course:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const token = localStorage.getItem('jwt');

    try {
      await axios.delete(`https://localhost:7116/api/Courses/delcourse/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleEditClick = (course) => {
    setFormCourse({
      title: course.title,
      description: course.description,
      file: null,
    });
    setEditingId(course.courseId);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="fw-bold text-primary">Welcome, Instructor 👋</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="card shadow mb-5">
        <div className="card-body">
          <h4 className="card-title mb-4">{editingId ? "Edit Course" : "Add New Course"}</h4>
          <div className="mb-3">
            <label className="form-label">Course Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formCourse.title}
              onChange={handleFormChange}
              placeholder="Enter title"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Course Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formCourse.description}
              onChange={handleFormChange}
              placeholder="Enter description"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload File</label>
            <input
              type="file"
              name="file"
              className="form-control"
              onChange={handleFormChange}
            />
          </div>
          <button className="btn btn-success" onClick={handleFormSubmit}>
            {editingId ? "Update Course" : "Add Course"}
          </button>
        </div>
      </div>

      <h3 className="mb-3">Your Uploaded Courses</h3>
      <div className="row">
        {courses.map(course => (
          <div className="col-md-6 mb-4" key={course.courseId}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <a href={course.mediaUrl} className="btn btn-sm btn-outline-primary mb-2" target="_blank" rel="noopener noreferrer">View Media</a>
                <div>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(course)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCourse(course.courseId)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructorDashboard;