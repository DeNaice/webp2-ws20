import express = require("express");
import {Request, Response} from "express";
let gesuchteZahl: number = random(1, 10);
let passwort: string = "Blaubeermuffin"

   function random(min:number, max: number): number{
        return  Math.floor(Math.random() * (max - min) + min);

}

const app = express();
app.use(express.json());

app.listen(8080, () => {
console.log("Das Guessing-Game finden sie hier: http://localhost:8080")
});
// Statische Routen

const basedir: string = __dirname + "/../..";
app.use("/", express.static(basedir + "/client/views"));
app.use('/css', express.static(basedir + '/client/css'));
app.use('/src', express.static(basedir + '/client/src'));
app.use('/jquery', express.static(basedir + '/client/node_modules/jquery/dist'));
app.use('/popperjs', express.static(basedir + '/client/node_modules/popper.js/dist'));
app.use('/bootstrap', express.static(basedir + '/client/node_modules/bootstrap/dist'));
app.use('/font-awesome', express.static(basedir + '/client/node_modules/font-awesome'));

//HTTP ROUTEN

app.get("/guess/:guess", (req:Request, res: Response) => {
    let guess:number = Number(req.params.guess);
    if (isNaN(guess)){
        res.status(400).send({
            flag: false,
            message: "Please guess a number!"
        });
    }
    else if (guess<gesuchteZahl){
    res.status(200).send({
       flag: false,
       message:"Your guess was too low"
    });
    }
    else if (guess>gesuchteZahl){
        res.status(200).send({
            flag:false,
            message:"Your guess was too high"
        });
    }
    else if(guess == gesuchteZahl){
        res.status(200).send({
            flag:true,
            message:"You got it!"
        });
    }
});
app.post("/reset", (req:Request, res: Response) =>{

    let minWert:number = req.body.minFeld;
    let maxWert:number = req.body.maxFeld;

   gesuchteZahl = random(minWert, maxWert);
    res.status(200).send({
        message: "Zahl wurde resettet"
    })

})

app.post("/cheat", (req:Request, res: Response) =>{

    let eingabePasswort: string = req.body.passwortcheck;

    if (eingabePasswort == passwort){
        res.status(200).send({
            message: "Das Zahl ist" + gesuchteZahl
        })
    }
    else if (eingabePasswort !== passwort){
        res.status(200).send({
            message: "Passwort ist nicht richtig"
        })
    }
})