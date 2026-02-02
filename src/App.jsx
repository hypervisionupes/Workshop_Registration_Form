import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/reg.jsx";
import Feedback from "./pages/feedback.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;