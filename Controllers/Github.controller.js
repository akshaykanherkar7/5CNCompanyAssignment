var axios = require("axios");
const express = require("express");
const GithubController = express.Router();

const UserModel = require("../Models/User.model");

GithubController.post("/:username", async (req, res) => {
  let { username } = req.params;
  console.log("username:", username);
  let user = await UserModel.findOne({ login: username });
  console.log("user:", user);
  if (user) {
    return res.status(500).send("User already exists!");
  }
  var config = {
    method: "get",
    url: `https://api.github.com/users/${username}`,
    headers: {},
  };

  axios(config)
    .then(async function (response) {
      const data = response.data;
      const {
        login,
        id,
        node_id,
        avatar_url,
        gravatar_id,
        url,
        html_url,
        followers_url,
        following_url,
        gists_url,
        starred_url,
        subscriptions_url,
        organizations_url,
        repos_url,
        events_url,
        received_events_url,
        type,
        site_admin,
        name,
        company,
        blog,
        location,
        email,
        hireable,
        bio,
        twitter_username,
        public_repos,
        public_gists,
        followers,
        following,
        created_at,
        updated_at,
      } = data;
      const userData = new UserModel({
        login,
        id,
        node_id,
        avatar_url,
        gravatar_id,
        url,
        html_url,
        followers_url,
        following_url,
        gists_url,
        starred_url,
        subscriptions_url,
        organizations_url,
        repos_url,
        events_url,
        received_events_url,
        type,
        site_admin,
        name,
        company,
        blog,
        location,
        email,
        hireable,
        bio,
        twitter_username,
        public_repos,
        public_gists,
        followers,
        following,
        created_at,
        updated_at,
      });
      await userData.save();
      res.status(200).send(response.data);
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send("User Not Found");
    });
  //   res.send(200);
});

GithubController.get("/search", async (req, res) => {
  const { username, location } = req.query;
  console.log("username:", username);
  console.log("location:", location);
  if (username) {
    let user = await UserModel.findOne({ login: username });
    return res.status(200).send({ user: user });
  } else if (location) {
    let user = await UserModel.findOne({ location });
    return res.status(200).send({ user: user });
  } else if (username && location) {
    let user = await UserModel.findOne({ login: username, location });
    return res.status(200).send({ user: user });
  }
  return res.status(500).send("Can't find user");
});

GithubController.delete("/:username", async (req,res) => {
    const {username} = req.params;
    const deleted_user = a 
})

module.exports = GithubController;
