import * as express from "express";
import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import App from "../src/app";
import "dotenv/config";

function handleRender(req: Request, res: Response) {
  // Renders our Hello component into an HTML string
  const html = ReactDOMServer.renderToString(React.createElement(App));

  // Load contents of index.html
  fs.readFile("./dist/index.html", "utf8", function (err, data) {
    if (err) throw err;

    // Inserts the rendered React HTML into our main div
    const document = data.replace(
      /<div id="root"><\/div>/,
      `<div id="root">${html}</div>`
    );

    // Sends the response back to the client
    res.send(document);
  });
}

const app = express();

// Serve built files with static files middleware
app.use("/dist", express.static(path.join(__dirname, "dist")));

// Serve requests with our handleRender function
app.get("*", handleRender);

//PORT
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log("Server up in ", PORT);
});
