const express = require("express");
const {google} = require("googleapis");
const path = require("path");
const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
let count = 0;
app.get("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client});
  const spreadsheetId = "1tt4L3gC3fBnVReAOKkTa8F2m48-0qt0l4V4Afypxo-8";
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  })

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "count_sheet!A1:A1",
  });
  count = getRows.data.values[0][0]
  console.log("Current Count: " + count);
  res.render("index", {count: count});
});

app.post("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client});
  const spreadsheetId = "1tt4L3gC3fBnVReAOKkTa8F2m48-0qt0l4V4Afypxo-8";
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  })

  count = parseInt(count, 10);
  console.log(count);
  count += 1;
  console.log(count);
  count = count.toString();
  console.log(count);
  await googleSheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: "count_sheet!A1:A1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[count]]
    },
  });
  // res.send(getRows);
});

app.listen(1337, (req, res) => console.log("running on 1337"));

// var button = document.getElementById("clickme");
// var counter = document.getElementById("counter");
// button.onclick = function() {
//   count += 1;
//   fetch_data();
//   counter.innerHTML = "Useful Counter: " + count;

// }
