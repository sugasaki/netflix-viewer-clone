import { request } from "https";
import React, { useState, useEffect } from "react";
import { DEFAULT_MIN_VERSION } from "tls";
import axios from "../axios";
import { requests } from "../request";
import "./Banner.scss";
import YouTube from "react-youtube";

//@ts-ignore
// import movieTrailer from 'movie-trailer'
const movieTrailer = require("movie-trailer");


type movieProps = {
  title?: string;
  name?: string;
  original_name?: string;
  backdrop_path?: string;
  overview?: string;
};

//trailerのoption
type Options = {
  height: string;
  width: string;
  playerVars: {
    autoplay: 0 | 1 | undefined;
  };
};

export const Banner = () => {
  const [movie, setMovie] = useState<movieProps>({});
  const [trailerUrl, setTrailerUrl] = useState<string | null>("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.feachNetflixOriginals);
      console.log(request.data.result);

      //apiからランんダムで値を取得している
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      );
      return request;
    }
    fetchData();
  }, []);
  console.log(movie);

  // descriptionの切り捨てよう関数
  function truncate(str: any, n: number) {
    // undefinedを弾く
    if (str !== undefined) {
      return str.length > n ? str?.substr(0, n - 1) + "..." : str;
    }
  }

  const opts: Options = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  const handleClick = async (movie: movieProps) => {
    console.log(movie, "movie click");

    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      console.log(movie?.name, "movie name");

      movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
      .then((url: string) => {
        console.log(url, "movieTrailer url");

        const urlParams = new URLSearchParams(new URL(url).search);
        const urlParamsUrl = urlParams.get("v")
        console.log(urlParamsUrl, "urlParamsUrl");
        setTrailerUrl(urlParamsUrl);
      })
      .catch((error: any) => console.log(error.message));
    }
  };

  return (
    <header
      className="Banner"
      style={{
        backgroundSize: "cover",
        // backgroundImage: `url(${foo})`,
        backgroundImage: `url("https://image.tmdb.org/t/p/original${movie?.backdrop_path}")`,
        // backgroundImage: `url("https://image.tmdb.org/t/p/original/34OGjFEbHj0E3lE2w0iTUVq0CBz.jpg")`,
        backgroundPosition: "top center",
      }}
    >
      <div className="Banner-contents">
        <h1 className="Banner-title">
          {movie?.title || movie?.name || movie?.original_name}
        </h1>
        <div className="Banner-buttons">
          <button className="Banner-button" onClick={() => handleClick(movie)}>Play</button>
          <button className="Banner-button">My List</button>
        </div>

        <h1 className="Banner-description">{truncate(movie?.overview, 150)}</h1>
      </div>

      {trailerUrl &&  <div className="YouTube"><YouTube videoId={trailerUrl} opts={opts} /></div>}

      <div className="Banner-fadeBottom" />
    </header>
  );
};
