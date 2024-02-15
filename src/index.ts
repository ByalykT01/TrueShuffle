const https = require("https");
const fs = require("fs");
const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const bodyParser = require("body-parser");
const cors = require("cors");

// Terminate duplicates
const codes: any = new Set([1, 2, 3]);
const insertCode = (code: string): boolean => {
  if (codes.has(code)) return false;
  codes.add(code);
  setTimeout(() => codes.delete(codes), 5000);
  return true;
};

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
const corsOptions = {
  origin: "https://encape.me",

  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

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
  let code = req.body.code;
  if (insertCode(code)) {
    const spotifyApi = new SpotifyWebApi({
      redirectUri: "https://encape.me",
      clientId: "77f685e7f75347a08e71369bd8eef061",
      clientSecret: "7522dff5768a4935aa862b365a33bb7a",
    });
    spotifyApi
      .authorizationCodeGrant(code)
      .then((data: any) => {
        res.json({
          accessToken: data.body.access_token,
          refreshToken: data.body.refreh_token,
          expiresIn: data.body.expires_in,
        });
      })
      .catch((err: any) => {
        console.log(err);
        res.sendStatus(400);
      });
  } else {
    res.sendStatus(200);
  }
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
httpsServer.setTimeout(10000);
httpsServer.keepAliveTimeout = 65000;
