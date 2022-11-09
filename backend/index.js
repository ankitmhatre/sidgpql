const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const http = require("http");
const app = express();
var path = require("path");
const fs = require("fs");
var axios = require("axios");
const redis = require("redis");
const redisClient = redis.createClient();

const cors = require("cors");
const uuid = require("uuid");
app.use(cors());

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
redisClient.connect().then(() => {
  console.log("Connected!");
});

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    userPostedImages: [ImagePost]
    binnedImages: [ImagePost]
  }
  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }
  type Mutation {
    updateImage(
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
    ): ImagePost

    uploadImage(
      url: String!
      description: String
      posterName: String
    ): ImagePost

    deleteImage(id: ID!): ImagePost
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    userPostedImages: async () => {
      let returnData = [];
      const data = await redisClient.lRange("photos_list", 0, -1);
      console.log("userPostedImages", data);
      if (data.length != 0) {
        for (let d of data) {
          const jsonImageFromRedis = await redisClient.get(d);
          const recomposedImage = JSON.parse(jsonImageFromRedis);
          returnData.push(recomposedImage);
        }
      }
      return returnData;
    },

    unsplashImages: async (_, args) => {
      let returnData = [];
      let imageData = {};

      try {
        const { data } = await axios.get(
          "https://api.unsplash.com/photos?page=" +
            args.pageNum +
            "&client_id=FUANkq2fJtG-qRGo9nfn0w1_dbXDtY7xhe4F_yR9Kq4"
        );

        let existBin;
        for (let arr of data) {
          imageData.id = arr.id;
          imageData.url = arr.urls.thumb;
          imageData.posterName = arr.user.name ? arr.user.name : "No Author";
          imageData.description = arr.description
            ? arr.description
            : arr.alt_description;
          imageData.userPosted = false;

          console.log(arr.id);
          existBin = await redisClient.get(arr.id);
          if (existBin) imageData.binned = true;
          else imageData.binned = false;
          //   imageData.numBinned = arr.likes;
          returnData.push(imageData);
          imageData = {};
        }
      } catch (err) {
        console.log(err);
        return null;
      }

      return returnData;
    },

    binnedImages: async () => {
      let returnData = [];

      const members = await redisClient.sMembers("binned_images", 0, -1);
      //async function(err,members){

      if (members.length != 0) {
        for (let err of members) {
          const jsonImageFromRedis = await redisClient.get(err);
          const recomposedImage = JSON.parse(jsonImageFromRedis);
          returnData.push(recomposedImage);
        }
        return returnData;
      }
      return returnData;
    },
  },
  Mutation: {
    async uploadImage(_, args) {
      const redisId = uuid.v4();
      const newImage = {
        id: redisId,
        url: args.url,
        posterName: args.posterName,
        description: args.description,
        userPosted: true,
        binned: false,
      };

      await redisClient.rPush("photos_list", redisId);

      const jsonBio = JSON.stringify(newImage);
      await redisClient.set(redisId, jsonBio);
      const jsonImageFromRedis = await redisClient.get(redisId);
      const recomposedImage = JSON.parse(jsonImageFromRedis);

      return recomposedImage;
    },

    async updateImage(_, args) {
      let redisId = args.id;

      if (args.binned) {
        const newImage = {
          id: redisId,
          url: args.url,
          posterName: args.posterName,
          description: args.description,
          userPosted: args.userPosted,
          binned: args.binned,
        };

        await redisClient.sAdd("binned_images", redisId);
        await redisClient.del(redisId);
        const jsonBio = JSON.stringify(newImage);
        await redisClient.set(redisId, jsonBio);
        const jsonImageFromRedis = await redisClient.get(redisId);
        const recomposedImage = JSON.parse(jsonImageFromRedis);

        return recomposedImage;
      } else {
        await redisClient.sRem("binned_images", redisId);
        await redisClient.del(redisId);

        const jsonImageFromRedis = await redisClient.get(redisId);

        const recomposedImage = JSON.parse(jsonImageFromRedis);

        return recomposedImage;
      }
    },

    async deleteImage(_, args) {
      let redisId = args.id;

      //redisClient.zrem("binned_images", redisId);
      await redisClient.del(redisId);

      const jsonImageFromRedis = await redisClient.get(redisId);
      const recomposedImage = JSON.parse(jsonImageFromRedis);
      return recomposedImage;
    },
  },
};

let apolloServer = null;
async function startServer() {
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}
startServer();
const httpserver = http.createServer(app);

app.get("/rest", function (req, res) {
  res.json({ data: "api working" });
});

app.get("/j", function (req, res) {
  fs.readFile(
    path.join(__dirname, "./assets", "placeholder.json"),
    "utf8",
    (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
        return;
      }
      //   console.log('File data:', jsonString)

      var l = JSON.parse(jsonString);

      res.json(l);
    }
  );
});

app.get("/photos", async (req, res) => {
  let cachedData = await redisClient.exists("photos_list");

  if (cachedData) {
    console.log("Data from Cache");
    let showDetailPage = await redisClient.get("photos_list");
    res.send(JSON.parse(showDetailPage));

    return;
  } else {
    console.log("Data from Api");
    //const unsplashApiResponse = [{id : 1}]
    const unsplashApiResponse = await axios.get(
      "https://api.unsplash.com/photos?client_id=FUANkq2fJtG-qRGo9nfn0w1_dbXDtY7xhe4F_yR9Kq4"
    );
    var r = unsplashApiResponse.data;

    try {
      await redisClient.set("photos_list", JSON.stringify(r));

      res.json(r);
    } catch (err) {
      console.log(err);

      res.status(404).json({ err });
    }
  }
  return;
});

app.listen(4000, function () {
  console.log(`server running on port 4000`);
  console.log(`gql path is ${apolloServer.graphqlPath}`);
});

//await
// redisClient.sadd(
//   ["photos_list", "ReactJS", "Angular", "Svelte", "VueJS", "VueJS"],
//   function (err, reply) {
//     console.log(reply); // 4
//   }
// );
