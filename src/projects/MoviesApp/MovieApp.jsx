import { useEffect, useState } from "react";

function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [genre, setGenre] = useState("");

  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const API_KEY = "17a942f5117edb235cd582e581c9332b";

  // ✅ DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // ✅ RESET when filters change
  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [debouncedQuery, genre]);

  // ✅ FETCH MOVIES (with abort)
  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      setLoading(true);
      if (debouncedQuery) setIsSearching(true);

      let url = "";

      if (debouncedQuery) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${debouncedQuery}&page=${page}`;
      } else if (genre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
      }

      try {
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        let results = data.results || [];

        // ✅ Local filter if BOTH search + genre
        if (debouncedQuery && genre) {
          results = results.filter((movie) =>
            movie.genre_ids.includes(Number(genre)),
          );
        }

        setMovies((prev) => [...prev, ...results]);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log("Error:", error);
        }
      }

      setLoading(false);
      setIsSearching(false);
    };

    fetchMovies();

    return () => controller.abort();
  }, [page, debouncedQuery, genre]);

  // ✅ INFINITE SCROLL
  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= docHeight - 1000) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movies</h1>

      {/* 🔍 SEARCH */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "white",
          padding: "10px 0",
          zIndex: 1000,
        }}
      >
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />

        {/* 🎭 GENRE */}
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All</option>
          <option value="35">Comedy</option>
          <option value="53">Thriller</option>
          <option value="28">Action</option>
          <option value="18">Drama</option>
          <option value="10749">Romance</option>
        </select>
      </div>

      {/* 🔄 STATUS */}
      {isSearching && <p>Searching...</p>}

      {/* 🎬 MOVIES */}
      <div
        style={{
          display: "grid",
          gap: "20px",
          marginTop: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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

      {/* ❌ NO RESULTS */}
      {!loading && movies.length === 0 && (
        <p style={{ textAlign: "center" }}>No results found</p>
      )}

      {/* ⏳ LOADING */}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
    </div>
  );
}

export default MovieApp;
