// Express-JS erstellt
const express = require("express");
const app = express();

// Konverterbibliothek in das Projekt importiert
const CSVtoJSON = require("csvtojson");
const FileSystem = require("fs");
const data = require("./destination.json");

// Hier Csv-Datei in Json konvertiert.
CSVtoJSON()
  .fromFile("./D_Bahnhof_2016_01_alle.csv")
  .then((source) => {
    FileSystem.writeFileSync(
      "./destination.json",
      JSON.stringify(source),
      "utf-8",
      (err) => {
        if (err) console.log(err);
      }
    );
  });

// Hier wird eine dynamische Get-Request erstellt
app.get("/api/v1/distance/:from/:to", (req, res) => {
  try {
    // Städte finden

    const from = req.params.from.toUpperCase();
    const to = req.params.to.toUpperCase();

    const filteredFirstCity = data.filter((city) => city.DS100 === from);
    const filteredSecondCity = data.filter((city) => city.DS100 === to);

    // Ermitteln der Luftlinie zwischen zwei Städten

    toRadians = function (degrees) {
      return (degrees * Math.PI) / 180;
    };

    const b1 = filteredFirstCity[0].BREITE;
    const l1 = filteredFirstCity[0].LAENGE;
    const b2 = filteredSecondCity[0].BREITE;
    const l2 = filteredSecondCity[0].LAENGE;

    const radianb1 = toRadians(90 - b1);
    const radianl1 = toRadians(90 - l1);
    const radianb2 = toRadians(90 - b2);
    const radianl2 = toRadians(90 - l2);

    const R = 6371;

    const b = Math.acos(
      Math.cos(radianb2) * Math.cos(radianb1) +
        Math.sin(radianb2) * Math.sin(radianb1) * Math.cos(radianl2 - radianl1)
    );

    const distance = b * R;

    const result = {
      from: filteredFirstCity[0].NAME,
      to: filteredSecondCity[0].NAME,
      distance: distance.toFixed(0),
      unit: "km",
    };

    res.status(200).send(result);
  } catch (err) {
    res
      .status(404)
      .json({ err: 404, description: "Ein Fehler ist aufgetreten!" });
  }
});

app.get("*", (req, res) => {
  try {
    res.status(404).json({ err: 404, description: "URL nicht gefunden!" });
  } catch (err) {
    res.send(err);
  }
});

app.listen(3000, () => {
  console.log("3000 Port läuft...");
});
