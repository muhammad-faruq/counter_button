const { application } = require("express");
const express = require("express");
const {google} = require("googleapis");
const path = require("path");
const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
let count = 0;
let dislikes = 0;
let ratio = 0;
let client;
let googleSheets;
let spreadsheetId;
let metaData;
app.get("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  client = await auth.getClient();
  googleSheets = google.sheets({ version: "v4", auth: client});
  spreadsheetId = "1tt4L3gC3fBnVReAOKkTa8F2m48-0qt0l4V4Afypxo-8";
  metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  })

  const getCount = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "count_sheet!A1:A1",
  });
  count = getCount.data.values[0][0]
  const getDislikes = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "count_sheet!B1:B1",
  });
  dislikes = getDislikes.data.values[0][0];
  console.log("Current Count: " + count);
  console.log("Current Dislikes: " + dislikes);
  console.log("what: " + count + dislikes);
  ratio = (parseInt(count, 10) / (parseInt(count, 10) + parseInt(dislikes, 10))) * 100;
  ratio = parseFloat(ratio).toFixed(2).toString();
  console.log("First Render")
  console.log("Current Ratio: " + ratio); 
  res.render("index", {ratio: ratio});
});

app.post("/decrement", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client});
  const spreadsheetId = "1tt4L3gC3fBnVReAOKkTa8F2m48-0qt0l4V4Afypxo-8";
  while (dislikes < 10) {
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "count_sheet!B1:B1",
    });
    dislikes = getRows.data.values[0][0];
    console.log("refetching dislike data");
  }


  dislikes = parseInt(dislikes, 10);
  dislikes += 1;
  dislikes = dislikes.toString();
  await googleSheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: "count_sheet!B1:B1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[dislikes]]
    },
  });
  ratio = (parseInt(count, 10) / (parseInt(count, 10) + parseInt(dislikes, 10))) * 100;
  ratio = parseFloat(ratio).toFixed(2).toString();
  console.log("decremented")
  console.log(ratio);
  res.render("index", {ratio, ratio});
})

app.post("/increment", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client});
  const spreadsheetId = "1tt4L3gC3fBnVReAOKkTa8F2m48-0qt0l4V4Afypxo-8";
  while (count < 10) {
    const getRows = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "count_sheet!A1:A1",
    });
    count = getRows.data.values[0][0];
    console.log("refetching data");
  }


  count = parseInt(count, 10);
  count += 1;
  count = count.toString();
  await googleSheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: "count_sheet!A1:A1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[count]]
    },
  });
  ratio = (parseInt(count, 10) / (parseInt(count, 10) + parseInt(dislikes, 10))) * 100;
  ratio = parseFloat(ratio).toFixed(2).toString();
  console.log("incremented")
  console.log(ratio);
  res.render("index", {ratio, ratio});

});

app.get("/get-ratio", (req, res) => {
  const ratio = (parseInt(count, 10) / (parseInt(count, 10) + parseInt(dislikes, 10))) * 100;
  const formattedRatio = parseFloat(ratio).toFixed(2).toString();
  res.json({ ratio: formattedRatio });
});


app.listen(1337, (req, res) => console.log("running on 1337"));

// var button = document.getElementById("clickme");
// var counter = document.getElementById("counter");
// button.onclick = function() {
//   count += 1;
//   fetch_data();
//   counter.innerHTML = "Useful Counter: " + count;

// }
