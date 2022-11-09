import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import queries from "../queries";

export default function Home() {
  const [pageNo, setPageNum] = useState(1);

  const { loading, error, data } = useQuery(queries.UNSPLASH, {
    variables: {
      pageNum: pageNo,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  function loadMore(){
    var pgnum = pageNo;
    pgnum++;
    setPageNum(pgnum)
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


      <button onclick={loadMore}>
Load More
</button>
    </>
  );
}
