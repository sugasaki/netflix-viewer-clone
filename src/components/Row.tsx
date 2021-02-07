import React, { useState, useEffect } from "react";
import axios from "./../axios";

type Props = {
    title: string;
    fetchUrl: string;
    isLargeRow?: boolean;
  };
  
  type Movie = {
    id: string;
    name: string;
    title: string;
    original_name: string;
    poster_path: string;
    backdrop_path: string;
  };
  
  export const Row = ({ title, fetchUrl, isLargeRow }: Props) => {
    const [movies, setMovies] = useState<Movie[]>([]);
  
    useEffect(() => {
      async function fetchData() {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
        return request;
      }
      fetchData();
    }, [fetchUrl]);
  
    console.log(movies);
  
    return(
        <div className="Row" /> 
    );
  };
