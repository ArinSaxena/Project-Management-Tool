import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import Members from "./Components/Members/Members";
import Projects from "./Components/Projects/Projects";
import Navbar from "./Components/Navbar/Navbar";
import SingleProject from './Components/SingleProject/SingleProject'

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        {/* <Route path='/Signup' element={<Signup/>}/> */}
        {/* <Route path='/login' element={<Login/>}/> */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:id" element={<SingleProject/>}/>
        <Route path="/members" element={<Members />} />
      </Routes>
    </div>
  );
}

export default App;
