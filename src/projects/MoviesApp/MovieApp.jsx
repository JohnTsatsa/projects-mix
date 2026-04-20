import { useEffect, useState } from "react";

function MovieApp() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=17a942f5117edb235cd582e581c9332b",
    )
      .then((res) => res.json())
        .then((data) => {
          console.log((data));
          
        setMovies(data.results);
      });
  }, []);

  return (
    <div>
      <h1>Popular Movies</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {movies.map((movie) => (
          <div key={movie.id} style={{ width: "150px" }}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              style={{ width: "100%" }}
            />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieApp;
