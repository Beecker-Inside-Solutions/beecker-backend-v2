const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user");
const rolesRouter = require("./routes/roles");
const projectRouter = require("./routes/project");
const notificationsRouter = require("./routes/notifications");
const botsRouter = require("./routes/bots");
const itemsRouter = require("./routes/items");
const costRouter = require("./routes/costs");
const incidents = require("./routes/incidents");
const fileRoutes = require("./routes/files");
const forgotRoutes = require("./routes/forgot");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const requestLogger = (req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  next();
};

app.use(requestLogger);

app.use("/", userRouter);
app.use("/", rolesRouter);
app.use("/", projectRouter);
app.use("/", notificationsRouter);
app.use("/", botsRouter);
app.use("/", itemsRouter);
app.use("/", costRouter);
app.use("/", incidents);
app.use("/", fileRoutes);
app.use("/", forgotRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
