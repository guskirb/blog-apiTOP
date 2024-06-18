import "dotenv/config";
import jsonwebtoken from "jsonwebtoken";

function issueJWT(user: any) {
  const _id = user._id;

  const expiresIn = "7d";

  const payload = {
    sub: _id,
  };

  const signedToken = jsonwebtoken.sign(payload, process.env.ACCESS_TOKEN as string, {
    expiresIn: expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

export default issueJWT;
