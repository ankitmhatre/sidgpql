import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import queries from "../queries";
import ImagePost from "./ImagePost";

export default function Home() {
  const [pageNum, setPageNum] = useState(1);
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
         <ImagePost k={k} />
        );
      })}

      <button  onClick={loadMore}>Load More</button>
    </>
  );
}
