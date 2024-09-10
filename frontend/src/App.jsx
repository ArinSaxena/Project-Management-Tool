import React from "react";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<h1>Home Page</h1>} />
                <Route path="/Signup" element={<h1>Signup</h1>} />
                <Route path="/login" element={<h1>Signin</h1>} />
                <Route path="/projects" element={<h1>Projects</h1>} />
                <Route path="/project/:id" element={<h1>Signle project</h1>} />
            </Routes>
        </div>
    );
}

export default App;
