import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import queries from "../queries";

export default function Home() {
  const [pageNum, setPageNum] = useState(1);
  const [ unsplashImages, setUnsplashImages ] = useState([]);

  const { loading, error, data, refetch } = useQuery(queries.UNSPLASH, {    
    variables: { pageNum },
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;



  function loadMore(){
    setPageNum(pageNum+1);
    refetch();
   
  }
  return (
    <>
      {data.unsplashImages.map((k, v) => {
        return (
          <center style={{ marginTop: "127px" }}>
            <span style={{ color: "#fff" }}> {k.description}</span>
            <br />
            <span style={{ color: "#fff" }}>an image by: {k.posterName}</span>
            <br />
            <img
              src={k.url}
              style={{ backgroundColor: "#fff", padding: "18px" }}
            />
            <br />
          </center>
        );
      })}

      <button  onClick={loadMore}>Load More</button>
    </>
  );
}
