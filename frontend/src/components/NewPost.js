import { useMutation } from "@apollo/client";
import React from "react";
import queries from "../queries";

export default function NewPost() {
    const [addPost, { data, loading, error }] = useMutation(queries.UPLOAD_IMAGE);

    function addImage(e){

        e.preventDefault();
       

        //check if url is valid
        addPost({variables : {
            description : e.target.elements.description.value,
            url :e.target.elements.description.value.img_url,
            posterName :e.target.elements.description.author_name,
        }})

        if(!error){
window.location.reload();
        }
       // 
    }
  return (
    <center>
    <span> Create a post</span>
      <form method="POST" onSubmit={addImage} style={{color:'#000', background:'#fff', padding:'64px', width:'40%'}}>
      <label>Description</label>
        <input type="text" id="description" />
        <br />
        <br />
        <label>Author Name</label>  <input type="text" id="author_name" />

        <br />
        <br />
        <label>Image Url</label>  <input type="text" id="img_url" />
        <br />
        <br />
        <button  type="submit" >
  		Submit
		</button>
      </form>
    </center>
  );
}
