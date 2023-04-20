require("dotenv").config();
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");

async function dummyQR() {
  for (let i = 1; i <= 100; i++) {
    const dummyDetails = {
      _id: `${i}`,
      name: `Extra Person ${i}`,
      email: `dummy${i}@email.com`,
      phone: `00000000${i}`,
      teamName: "Dummy Team",
      __v: 0,
    };
    const signedToken = jwt.sign(
      JSON.stringify(dummyDetails),
      process.env.JWT_SECRET
    );
    QRCode.toFile(`./dummyQRs/DummyQR_${dummyDetails._id}.png`, signedToken);
  }
}
dummyQR();
