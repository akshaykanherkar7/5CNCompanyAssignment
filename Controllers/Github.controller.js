var axios = require("axios");
const express = require("express");
const GithubController = express.Router();

const UserModel = require("../Models/User.model");
const MutualModel = require("../Models/Mutual.model");

GithubController.post("/:username/mutual", async (req, res) => {
  const { username } = req.params;
  var following = [];
  var followers = [];
  let MutualFriends = [];
  var axios = require("axios");

  var config = {
    method: "get",
    url: `https://api.github.com/users/${username}/following`,
    headers: {},
  };

  axios(config)
    .then(async function (response) {
      // console.log(JSON.stringify(response.data));
      if (response.data) {
        following = response.data;
      }
    })
    .catch(function (error) {
      console.log(error);
      return res.status(404).send("Error in Mutual Friends Saving");
    });

  var config = {
    method: "get",
    url: `https://api.github.com/users/${username}/followers`,
    headers: {},
  };

  axios(config)
    .then(async function (response) {
      // console.log(JSON.stringify(response.data));
      if (response.data) {
        followers = response.data;
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  setTimeout(async () => {
    for (let i = 0; i < followers.length; i++) {
      for (let j = 0; j < following.length; j++) {
        if (followers[i].login === following[j].login) {
          MutualFriends.push(followers[i]);
        }
      }
    }
    console.log("Mutual Friends: ", MutualFriends);
    for (let i = 0; i < MutualFriends.length; i++) {
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
      } = MutualFriends[i];

      const MFriends = new MutualModel({
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
      });
      await MFriends.save();
    }
  }, 1000);
  return res.status(200).send("Mutal Friends Successfully Saved");
});

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

GithubController.get("/", async (req, res) => {
  let { value, order, username, location } = req.query;
  let obj = {};
  if (value) {
    obj[value] = order.toString() === "asc" ? 1 : -1;
    let sorted_data = await UserModel.find().sort(obj);
    return res.status(200).send({ sorted_data: sorted_data });
  }
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

// GithubController.get("/search", async (req, res) => {
//   const { username, location } = req.query;
//   console.log("username:", username);
//   console.log("location:", location);
//   if (username) {
//     let user = await UserModel.findOne({ login: username });
//     return res.status(200).send({ user: user });
//   } else if (location) {
//     let user = await UserModel.findOne({ location });
//     return res.status(200).send({ user: user });
//   } else if (username && location) {
//     let user = await UserModel.findOne({ login: username, location });
//     return res.status(200).send({ user: user });
//   }
//   return res.status(500).send("Can't find user");
// });

GithubController.patch("/:username", async (req, res) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ login: username });
  if (!user) {
    return res.status(404).send("User not found");
  }
  const updated_user = await UserModel.findOneAndUpdate(
    { login: username },
    req.body,
    { new: true }
  );
  return res.status(200).send({
    message: "User Detail Updated Successfully",
    project: updated_user,
  });
});

GithubController.delete("/:username", async (req, res) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ login: username });
  if (!user) {
    return res.status(404).send("User not found");
  }
  const deleted_user = await UserModel.findOneAndDelete(
    { login: username },
    { new: true }
  );
  return res.status(200).send({
    message: "User Data Deleted Successfully",
    deleted_user: deleted_user,
  });
});

module.exports = GithubController;
