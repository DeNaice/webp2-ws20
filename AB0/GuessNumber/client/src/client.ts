//Hier sollen mit ajax die Daten übergeben werden

import {response} from "express";

function guess(){
    let guessNumber = $("#guessNumber").val();
    $.ajax({
        url: "/guess/" + guessNumber,
        type: "GET",
        dataType: "json",
        success: (response) => {
    alert(response.message);
        }
    });
}

//
function reset(){
    let minFeld: number = Number($("#minValue").val());
    let maxFeld: number = Number($("#maxValue").val());
    $.ajax({
    url: "/reset",
    type: "POST",
    dataType: "json",
        data: JSON.stringify({
            minFeld,
            maxFeld
        }),

    contentType: "application/json",
        success: (response) => {
            alert(response.message);
        }
    })


}
function cheaten(){
    let passwortcheck: string = String($("#passwortFeld").val());
    $.ajax({
        url: "/cheat",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({
            passwortcheck
        }),
        contentType:"application/json",
        success: (response) => {
            alert(response.message);
        }
    })



}
// Main Callback
$(() => {
    //Define Jquery HTML Objects

    const guessButton: JQuery = $("#guessButton");
    const passwortButton: JQuery = $("#passwortButton");
    const resetButton: JQuery = $("#resetButton");

    const minValue: JQuery = $("#minValue");
    const maxValue: JQuery = $("#maxValue");

    // Register listeners
guessButton.on('click',guess);
resetButton.on("click", reset);
passwortButton.on("click", cheaten);
});