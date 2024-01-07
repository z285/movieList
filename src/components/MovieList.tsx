import React, { useEffect, useState } from "react";
import { useRef } from "react";

interface Movie {
  original_language: string;
  original_title: string;
  poster_path: string;
  overview: string;
}

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);
  const [hoveredDescriptionIndex, setHoveredDescriptionIndex] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1); // Use state for page
  const [movieSearch, setMovieSearch] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
        const response = await fetch(
          "https://api.themoviedb.org/3/discover/movie?api_key=7a884526e4e67695d33cd2c16acbfccc&include_adult=false&include_video=false&language=en-US&" +
            "page=" +
            page +
            "&sort_by=popularity.desc"
        );
        const data = await response.json();
        setMovies(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const searchMovies = async (name: string) => {
        try {
        const response = await fetch(
          "https://api.themoviedb.org/3/search/movie?api_key=7a884526e4e67695d33cd2c16acbfccc&query=" +
            name +
            "&page=" +
            page
        );
        const data = await response.json();
        setMovies(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if(movieSearch == null || movieSearch == ""){
      fetchMovies();
    }
    else{
      searchMovies(movieSearch)
    }
  }, [page]);

  const MouseOver = (index: number) => {
    setHoveredImageIndex(index);
    setHoveredDescriptionIndex(index);
    //console.log(movies[index].overview);
  };

  const MouseOut = () => {
    setHoveredImageIndex(null);
    setHoveredDescriptionIndex(null);
  };

  const imageStyle = (index: number) => {
    return {
      filter: index === hoveredImageIndex ? "brightness(10%)" : "",
      transition: "filter 0.3s ease",
    };
  };

  const description = (index: number) => {
    return index === hoveredDescriptionIndex ? movies[index].overview : "";
  };

  const nextPage = () => {
    setPage(page + 1);
  };
  const previousPage = () => {
    setPage(page - 1);
  };

  const message = useRef<HTMLInputElement>(null);

  const search = () => {
    setPage(1)
    if (message.current?.value !== null && message.current !== null && message.current.value != "") {
      setMovieSearch(message.current.value)
      searchMovies(message.current.value);
    }
    else{
      setMovieSearch(null)
      fetchMovies()
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-center">Movies List</h1>
        <div className="py-4">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              ref={message}
              id="default-search"
              className="block w-full p-5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              required
            />
            <button
              onClick={search}
              type="submit"
              className="text-white absolute end-2.5 bottom-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {movies.map((movie, index) => (
          <div
            className="bg-black rounded-md overflow-hidden shadow-md relative"
            key={index}
            onMouseOver={() => MouseOver(index)}
            onMouseOut={MouseOut}
          >
            <img
              className="object-cover w-full"
              style={imageStyle(index)}
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt="Card Image"
            />
            <div className="absolute top-3 left-3 right-2">
              {description(index)}
            </div>
            <div className="p-4">
              <p className="text-yellow-600">{movie.original_language}</p>
              <h2
                className="text-xl text-white font-semibold mb-2"
                key={movie.original_title}
              >
                {movie.original_title}
              </h2>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center p-4">
        {page !== 1 && (
          <button style={{ marginRight: "8px" }} onClick={previousPage}>
            Back
          </button>
        )}
        <button onClick={nextPage}>Next</button>
      </div>
    </div>
  );
}

export default MovieList;
