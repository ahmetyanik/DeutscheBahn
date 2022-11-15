const express = require("express");

const app = express();

app.get("/api/v1/distance/:from/:to", (req,res) => {

    const from = req.params.from;
    const to = req.params.to;



  res.send(`${from} ---> ${to}`);
});

app.listen(3000,()=>{
    console.log("3000 Port läuft...");
});
