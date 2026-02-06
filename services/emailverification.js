const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { secret } = require("./auth");
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

async function sendVerifyMail(username, id, email) {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "ondropp.app@gmail.com",
      pass: "dpsxfswrxrrihzbl",
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const token = jwt.sign(
    {
      data: id,
    },
    secret,
    {
      expiresIn: "10m",
    },
  );
  // console.log(token);

  const mailConfig = {
    from: "ondropp.app@gmail.com",
    to: email,
    subject: "You're almost in 👀 Just verify your email",
    text: `Hey ${username} 👋
    
    We just need to make sure it's really you.
    
    Click below to verify your email and unlock your account 🚀
    👉 http://localhost:8000/verify/${token}
    
    This link expires for security reasons.
    Didn't sign up? No worries — you can ignore this email.
    
    Let's build cool stuff together
    Team Dropp.`,
  };
  try {
    const info = await transport.sendMail(mailConfig);

    return info;
  } catch (error) {
    return error;
  }
}

function verifyEmailToken(token) {
  try {
    const payload = jwt.verify(token, secret);
    return { result: true, payload };
  } catch (error) {
    return { result: false };
  }
}

module.exports = { sendVerifyMail, verifyEmailToken };
