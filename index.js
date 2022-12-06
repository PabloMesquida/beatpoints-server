const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const URI = "https://beatpoints.vercel.app";
const PORT = process.env.PORT || 3001;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("Server running", "color: green", PORT);
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log("ok");
  const spotifyApi = new SpotifyWebApi({
    redirectUri: URI,
    clientId: "eafd5a23f1cb4f02b98c1cda9aa21333",
    clientSecret: "bb78d5a6ed1b4abfa8ec5f93731cf401",
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      // console.log("refrehsData: ", data);
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      //  console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  // console.log("code", code);
  const spotifyApi = new SpotifyWebApi({
    redirectUri: URI,
    clientId: "eafd5a23f1cb4f02b98c1cda9aa21333",
    clientSecret: "bb78d5a6ed1b4abfa8ec5f93731cf401",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      // console.log("post-login-error", err);
      res.sendStatus(400);
    });
});
