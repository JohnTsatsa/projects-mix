import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <h1>My Projects</h1>

      <Link to="/movie-app">
        <h2>Movie App</h2>
      </Link>

      <Link to="/tasks-app">
        <h2>Task Manager</h2>
      </Link>
    </>
  );
}

export default Home;
