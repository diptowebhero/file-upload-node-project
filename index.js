const http = require("http");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const port = 5000;

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method.toLowerCase();

  if (url === "/" && method === "get") {
    fs.readFile("./index.html", (err, data) => {
      if (err) {
        res.writeHead(401, { "Content-Type": "text/html" });
        res.write(`<h1>${err.message}</h1>`);
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      }
    });
  } else if (url === "/process" && method === "post") {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err.message);
      } else {
        //handle field
        fs.mkdir(path.join(__dirname, `./usersData/${fields.email}`), (err) => {
          if (err) {
            console.log(err.message);
          } else {
            console.log("Folder create successfully");
          }
        });
        fs.writeFile(
          `./usersData/${fields.email}/${fields.fname}.json`,
          JSON.stringify(fields),
          (err) => {
            if (err) {
              console.log(err.message);
            } else {
              console.log("Folder create successfully");
            }
          }
        );
        //handle files
        const fileName = files?.image.originalFilename;
        const tempPath = files?.image.filepath;

        const ext = path.extname(fileName)

        fs.rename(
          tempPath,
          `${__dirname}/usersData/${fields.email}/profile${ext}`,
          (err) => {
            if (err) {
              console.log(err.message);
            } else {
              console.log("Folder create successfully");
            }
          }
        );
      }
    });

    res.end("Thanks for submitting");
  }
});

server.listen(port, () => {
  console.log("Server running successfully");
});
