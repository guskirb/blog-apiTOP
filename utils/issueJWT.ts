import "dotenv/config";
import jsonwebtoken from "jsonwebtoken";

function issueJWT(user) {
  const _id = user._id;

  const expiresIn = "30m";

  const payload = {
    sub: _id,
  };

  const signedToken = jsonwebtoken.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

export default issueJWT;
