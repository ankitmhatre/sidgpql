import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import queries from "../queries";
import ImagePost from "./ImagePost";
import { ScrollRestoration } from "react-router-dom";

export default function Home() {

  const [pageNum, setPageNum] = useState(1);
  const [images, setImages] = useState([]);
  const [scrollPos, setScrollPos] = useState(0);
  const { loading, error, data, refetch } = useQuery(queries.UNSPLASH, {    
    variables: { pageNum },
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;



  function loadMore(){
    setPageNum(pageNum+1);
setScrollPos(window.scrollY)
    refetch();
   window.scrollTo(0, scrollPos)
  }
  return (
  <>

 
      {
        data.unsplashImages.map((k, v) => {
        images.push(k)
      })}


      {images.map((k,v)=>{
        return (
         <ImagePost k={k} />
        );
      })}

      <button  onClick={loadMore}>Load More</button>
  </>
  );
}
