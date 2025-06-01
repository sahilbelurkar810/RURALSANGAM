const jwt = require("jsonwebtoken");

const generateJaaSToken = (roomName, userName) => {
  const privateKey = process.env.JAAS_PRIVATE_KEY.replace(/\\n/g, "\n");
  const appID = process.env.JAAS_APP_ID;

  const payload = {
    aud: "jitsi",
    iss: "chat",
    sub: appID,
    room: roomName,
    context: {
      user: {
        name: userName,
      },
    },
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
};

module.exports = generateJaaSToken;
