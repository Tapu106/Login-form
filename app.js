const express = require("express");
const path = require("path");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();
const PORT = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
