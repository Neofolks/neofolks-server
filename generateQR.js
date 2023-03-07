require("dotenv").config();
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");

async function generateQR(memberDetails) {
  const signedToken = jwt.sign(JSON.stringify(memberDetails), process.env.JWT_SECRET);
  QRCode.toFile(`./${memberDetails._id}.png`, signedToken);
}

// const memberDetails = {
//   name: "Ohm",
//   email: "ohmpatil33@gmail.com",
//   phone: "1234567890",
//   _id: "6406ea4beb506d39eaec1e2e",
// };

// generateQR(memberDetails);

module.exports = generateQR
