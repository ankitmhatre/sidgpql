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
  }`


  export default {
    UNSPLASH
  }