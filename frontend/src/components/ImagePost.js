import { useMutation } from "@apollo/client";
import React from "react";
import queries from "../queries";

function ImagePost({ k }) {
  const [mutateFunction, { data, loading, error }] = useMutation(
    queries.UPDATE
  );

  function toggleBin() {
    mutateFunction({
      variables: Object.assign({}, k, { binned: !k.binned }),
    });
  }
  return (
    <>
      <center style={{ marginTop: "127px" }}>
        <span style={{ color: "#fff" }}> {k.description}</span>
        <br />
        <span style={{ color: "#fff" }}>an image by: {k.posterName}</span>
        <br />
        <img
          src={k.url}
          style={{
            backgroundColor: "#fff",
            padding: "18px",
            width: "400px",
            height: "600px",
          }}
        />
        <br />

        <button onClick={toggleBin}>
          {!k.binned ? <span>Add to Bin </span> : <span>Remove from bin </span>}
        </button>
      </center>
    </>
  );
}

export default ImagePost;
