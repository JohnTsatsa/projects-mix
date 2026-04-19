import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MovieApp from "./projects/MoviesApp/MovieApp";
import TaskApp from "./projects/TasksApp/TasksApp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie-app" element={<MovieApp />} />
        <Route path="/tasks-app" element={<TaskApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
