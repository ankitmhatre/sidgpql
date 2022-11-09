import React from "react";
const { gql } = require("@apollo/client");

const UNSPLASH = gql`
query unsplash($pageNum: Int){    
    unsplashImages(pageNum:$pageNum){
         id
    url
    posterName
    description
    userPosted
    binned
    }
  }
  `


  const UPDATE = gql`
  mutation updateImage($id: ID!, $url: String, $posterName: String, $description: String, $userPosted: Boolean, $binned: Boolean){
    updateImage(id:$id,
    url:$url,posterName:$posterName,description:$description,userPosted:$userPosted,binned:$binned){
    id
    url
    posterName
    description
    userPosted
    binned

    }
  }`


  const USER_POSTED = gql`query posted{
    userPostedImages{
    id
    url
    posterName
    description
    userPosted
    binned

    }
  }`


  const BINNED = gql`
  
query binned{
  binnedImages{
  id
  url
  posterName
  description
  userPosted
  binned
  }
}`



const UPLOAD_IMAGE = gql` 
mutation uploadImage($url: String!, $description: String, $posterName: String){
  uploadImage(url:$url,description:$description,posterName:$posterName){
  id
  url
  posterName
  description
  userPosted
  binned
  
  }
}
`

  export default {
    UNSPLASH,
    UPDATE,
    BINNED,
    USER_POSTED,
    UPLOAD_IMAGE
  }