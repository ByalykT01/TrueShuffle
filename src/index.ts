const https = require("https");
const fs = require("fs");
const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
const cors = require("cors");

// SSL
const privateKey = fs.readFileSync("/etc/nginx/ssl/local-server.key", "utf8");
const certificate = fs.readFileSync("/etc/nginx/ssl/local-server.crt", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
};

// Initialization
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Endpoints
app.get("/", (req: any, res: any) => {
  res.send("Hello True Shuffle!");
});

app.get("/api", (req: any, res: any) => {
  res.send("Hell");
});

app.post("/refresh", (req: any, res: any) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "https://encape.me",
    clientId: "77f685e7f75347a08e71369bd8eef061",
    clientSecret: "7522dff5768a4935aa862b365a33bb7a",
    refreshToken,
  });
  console.log("Why am I here?");
  spotifyApi
    .refreshAccessToken()
    .then((data: any) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(() => {
      res.sendStatus(400);
    });
});

app.post("/login", (req: any, res: any) => {
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "https://encape.me",
    clientId: "77f685e7f75347a08e71369bd8eef061",
    clientSecret: "7522dff5768a4935aa862b365a33bb7a",
  });
  spotifyApi
    .authorizationCodeGrant(req.body.code)
    .then((data: any) => {
      // Set the access token on the API object to use it in later calls
      console.log("-----authorizationCodeGrant------");
      console.log(`accessToken: ${data.body.access_token}`);
      console.log(`refreshToken: ${data.body.refreh_token}`);
      console.log(`expiresIn: ${data.body.expires_in}`);
      console.log("---------------------------------");
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refreh_token,
        expiresIn: data.body.expires_in,
      });
      console.log(res.json);
      console.log("END OF FUNC");
    })
    .catch((err: any) => {
      console.log("WHY DID I BREAK??");
      console.log(err);
    });
});

// HTTPS server
const httpsServer = https.createServer(credentials, app);

// Listen
const PORT = process.env.PORT || 3000;
httpsServer
  .listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  })
  .on("error", (err: any) => {
    console.error("Server failed to start:", err);
  });
httpsServer.setTimeout(1000);
httpsServer.keepAliveTimeout = 65000;
