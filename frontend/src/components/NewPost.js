import React from "react";

export default function NewPost() {
  return (
    <>
      <form>
      <label>Description</label>
        <input type="text" name="description" />
        <br />
        <br />
        <label>Author Name</label>  <input type="text" name="author_name" />
      </form>
    </>
  );
}
