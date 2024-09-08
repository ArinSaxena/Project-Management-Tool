// Projects.js
import React from "react";
import { useState, useEffect } from "react";
import "./Projects.css";
import {Navigate, Link} from "react-router-dom"

const Projects = () => {
  const [projects, setProjects] = useState(["First project"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  //   useEffect(() ={
  //     localStorage.setItem('projects',JSON.stringify(projects));
  //   },[projects]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewProjectName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      setProjects([...projects, newProjectName]); // addign new project to the list
      closeModal();
    }
  };
  console.log(projects);

  return (
    <div className="Project-page">
      <div className="upper-part">
        <div className="left">
          <h2>Projects</h2>
        </div>

        <div className="right">
          <button className="btn" onClick={openModal}>
            New Project
          </button>
        </div>
      </div>
      <div className="project-name">
        {projects.map((project, i) => (
          <div className="lower-part">
           <Link to={`/project/${i}`} className="project-link">
              <button className="project-btn">{project}</button>
            </Link>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-container">
          <div className="modal-content">
            <h3>Create new project</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
              />
              <div className="modal-actions">
                <button className="submit-btn">Submit</button>
                <button className="cancle-btn" onClick={closeModal}>
                  Cancle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
