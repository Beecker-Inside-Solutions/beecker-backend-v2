const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user");
const rolesRouter = require("./routes/roles");
const projectRouter = require("./routes/project");
const notificationsRouter = require("./routes/notifications");
const botsRouter = require("./routes/bots");
const itemsRouter = require("./routes/items");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use("/", userRouter);
app.use("/", rolesRouter);
app.use("/", projectRouter);
app.use("/", notificationsRouter);
app.use("/", botsRouter);
app.use("/", itemsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
