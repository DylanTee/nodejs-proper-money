require("dotenv").config();
process.env.TZ = "UTC"; 
process.env.LANG = "en_US.UTF-8";

import express from "express";
import Routes from "./src/module/routes";
import cors from "cors";

const app = express();
const port = 8080;
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", async function (req, res) {
  res.send(
    JSON.stringify({
      version: "1",
    })
  );
});

Routes.applyRoutes(app);

app.listen(port, "0.0.0.0", () => {
  console.log(`Running at port:${port}....`);
});
