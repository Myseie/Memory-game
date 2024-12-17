import React from "react";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MemoryGame from "./components/MemoryGame";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MemoryGame />} />
      </Routes>
    </Router>
  );
};



export default App;
