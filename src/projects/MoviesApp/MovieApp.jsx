import { useEffect, useState } from "react";

function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const API_KEY = "17a942f5117edb235cd582e581c9332b";

  // FETCH MOVIES
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`,
        );

        const data = await res.json();

        setMovies((prev) => [...prev, ...(data.results || [])]);
      } catch (error) {
        console.log("Error fetching movies:", error);
      }

      setLoading(false);
    };

    fetchMovies();
  }, [page]);

  // INFINITE SCROLL
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= docHeight - 50 && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Popular Movies</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {movies.map((movie) => (
          <div key={movie.id} style={{ width: "150px" }}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <p style={{ fontSize: "14px" }}>{movie.title}</p>
          </div>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading more...</p>}
    </div>
  );
}

export default MovieApp;
