const connection = require("../helpers/mysql-config");
const nodemailer = require("nodemailer");
const jwtMiddleware = require("../middleware/jwt-middleware");

const forgotService = {
  forgotPassword: async (email, languageType) => {
    try {
      console.log(
        `Received forgot password request for email: ${email}, languageType: ${languageType}`
      );

      const [rows] = await connection.query(
        "SELECT idUsers, email, password FROM Users WHERE email = ?",
        [email]
      );

      if (rows.length > 0) {
        const user = rows[0];
        console.log(`User found: ${JSON.stringify(user)}`);

        const token = jwtMiddleware.generateToken(user.idUsers);
        console.log(`Generated token: ${token}`);

        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const infoEnglish = {
          from: `Beecker Recovery <${process.env.EMAIL}>`,
          to: email,
          subject: "Reset Password",
          html: `
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Actualización de Contraseña</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: #333333;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
              a {
                color: #0072c6;
                text-decoration: none;
              }
              a:hover {
                color: #003c7a;
                text-decoration: underline;
              }

              img {
                width: 200px;
              }
            </style>
          </head>
          <body>
            <img src="https://raw.githubusercontent.com/Beecker-Inside-Solutions/beecker-Front/main/app/images/logos/logo.png" alt="beecker-logo" border="0">
            <p>Dear user,</p>
            <p>We have recieved the request to change your password, click in reset password to properly reset it:</p>
            <a href="http://localhost:3000/resetPassword/${token}/idUsers/${user.idUsers}">Reset Password</a>
            <p>This link will only last 15 minutes.</p>
            <p>Thank you,</p>
            <p>Beecker</p>
          </body>
        </html>
          `,
        };

        const infoSpanish = {
          from: `Beecker Recovery <${process.env.EMAIL}>`,
          to: email,
          subject: "Restablecer Contraseña",
          html: `
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Actualización de Contraseña</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: #333333;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
              a {
                color: #0072c6;
                text-decoration: none;
              }
              a:hover {
                color: #003c7a;
                text-decoration: underline;
              }

              img {
                width: 200px;
              }
            </style>
          </head>
          <body>
            <img src="https://raw.githubusercontent.com/Beecker-Inside-Solutions/beecker-Front/main/app/images/logos/logo.png" alt="beecker-logo" border="0">
            <p>Estimado usuario,</p>
            <p>Hemos recibido la petición de restablecer su contraseña, de click en recuperar contraseña:</p>
            <a href="http://localhost:3000/resetPassword/${token}/idUsers/${user.idUsers}">Recuperar Contraseña</a>
            <p>Este link solo estará disponible 15 minutos.</p>
            <p>Gracias,</p>
            <p>Beecker</p>
          </body>
        </html>`,
        };

        let mailOptions;
        switch (languageType) {
          case "es":
            mailOptions = infoSpanish;
            break;
          case "en":
            mailOptions = infoEnglish;
            break;
          default:
            mailOptions = infoEnglish;
            break;
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      } else {
        console.error("No user found with email:", email);
        throw new Error("Invalid email");
      }
    } catch (error) {
      console.error("Error in forgotPassword service:", error);
      throw error;
    }
  },

  resetPassword: async (password, token, userId) => {
    try {
      console.log(
        `Reset password service called with token: ${token} and userId: ${userId}`
      );

      if (!password || !token || !userId) {
        console.error("Missing password, token, or userId");
        throw new Error("Password, token, and userId are required");
      }

      const decoded = jwtMiddleware.verifyToken(token);
      console.log(`Decoded token: ${JSON.stringify(decoded)}`);

      if (decoded.idUsers !== parseInt(userId, 10)) {
        console.error("Invalid token: User ID does not match");
        throw new Error("Invalid token");
      }

      await connection.query(
        "UPDATE Users SET password = SHA2(?, 224) WHERE idUsers = ?",
        [password, userId]
      );

      console.log("Password updated successfully");
    } catch (error) {
      console.error("Error in resetPassword service:", error);
      throw error;
    }
  },
};

module.exports = forgotService;
