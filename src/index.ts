const https = require("https");
const fs = require("fs");
const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");


// SSL
const privateKey = fs.readFileSync("/etc/nginx/ssl/local-server.key", "utf8");
const certificate = fs.readFileSync("/etc/nginx/ssl/local-server.crt", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
};

// Endpoints

const app = express();
app.use(bodyParser.json());
app.get("/", (req: any, res: any) => {
  res.send("Hello World");
});

app.get("/api", (req: any, res: any) => {
  res.send("Hell");
});

app.post("/refresh", (req: any, res: any) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: '77f685e7f75347a08e71369bd8eef061',
    clientSecret: '7522dff5768a4935aa862b365a33bb7a',
    refreshToken,
  });

  spotifyApi.refreshAccessToken().then(
    (data: any) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    }).catch(() => {
      res.sendStatus(400);
    })
})

app.get("/login", (req: any, res: any) => {
    const code  = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '77f685e7f75347a08e71369bd8eef061',
        clientSecret: '7522dff5768a4935aa862b365a33bb7a'
    });

    spotifyApi.authorizationCodeGrant(code).then((data: any) => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refreh_token,
            expiresIn: data.body.expires_in
        }).catch((err: any) => {
            console.log(err);
            res.sendStatus(404)
        })
    })
  res.send("Hello World");
});

// HTTPS server
const httpsServer = https.createServer(credentials, app);

// Listen
const PORT = process.env.PORT || 3000;
httpsServer
  .listen(PORT, () => {
    console.log("HTTPS Server running on port 3000");
  })
  .on("error", (err: any) => {
    console.error("Server failed to start:", err);
  });
