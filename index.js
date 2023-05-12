require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "This web app is a user-friendly journaling platform built with Node.js, Express, and MongoDB. It allows users to compose journal entries, which are securely stored in a MongoDB database. The app offers a clean interface, easy entry creation, and features like editing and deleting entries. It promotes personal growth, self-reflection, and organized memory preservation.";
const aboutContent = "This web app is a user-friendly journaling platform built with Node.js, Express, and MongoDB. It allows users to compose journal entries, which are securely stored in a MongoDB database. The app offers a clean interface, easy entry creation, and features like editing and deleting entries. It promotes personal growth, self-reflection, and organized memory preservation.";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
// const PORT = process.env.MONGO_URI || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongodb connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI);

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// }


const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {

  Post.find({})
    .then(posts => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({ _id: requestedPostId })
    .then(post => {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    })
    .catch(err => {
      console.log(err);
    });
});


app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

// app.get("/contact", function (req, res) {
//   res.render("contact", { contactContent: contactContent });
// });

app.get("/compose", function (req, res) {
  res.render("compose");
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Server is running on port 3000.');
});

//Connect to the database before listening
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log("listening for requests");
//   })
// })