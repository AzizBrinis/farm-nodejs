const fs = require("fs");
const http = require("http");
const url = require("url");
const handleElement = require("./modules/handleElement");

const newData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
);

const temp = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8");
const card = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const prod = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");

const server = http.createServer((req, res) => {
  const { path, query } = url.parse(req.url, true);
  if (path == "/overview" || path == "/") {
    const output = newData.map((el) => handleElement(card, el)).join(" ");
    const view = temp.replace(/{%CARD_TEMPLATE%}/g, output);
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(view);
  } else if (path == "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(newData);
  } else if (path == `/product?id=${query.id}`) {
    const product = handleElement(prod, newData[+query.id]);
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(product);
  } else {
    console.log(path);
    res.writeHead(404, {
      "Content-type": "text/html",
      my_own_header: "this is a test",
    });
    res.end("<h1>Page Not Found !</h1>");
  }
});

server.listen(8000, "127.0.0.1", (err) => {
  console.log("server is runnig on port 8000");
});
