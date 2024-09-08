import React from "react";
import "./Members.css";
import { useState, useEffect } from "react";

const Members = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("{name,email,password}");
    const newMember = { name, email, password };
    setMembers([...members, newMember]);
    closeModal();
  };

  return (
    <div className="Project-page">
      <div className="upper-part">
        <div className="left">
          <h2>Members</h2>
        </div>

        <div className="right">
          <button className="btn" onClick={openModal}>
            New Member
          </button>
        </div>
      </div>
      <div className="member-name">
        {members.length > 0 ? (
          members.map((member, index) => (
            <div key={index}>
              <div className="members">
                <p>Name: {member.name}</p>
                <p>Email: {member.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No members added yet.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-container">
          <div className="modal-content">
            <h3>Register a new Member in team</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="submit-btn">
                Submit
              </button>
              <button type="button" className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
