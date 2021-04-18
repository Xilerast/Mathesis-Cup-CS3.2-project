// Ένας βοηθητικός πίνακας που θα περιέχει τις χώρες από το countries.js σε λίγο πιο βολική μορφή
const allCountries = new Array();
// πχ. allCountries['GRE'] = { code2: "GR", name: "Greece"}, ή κάτι παρόμοιο 

// Εδώ μπορείτε να βάλετε τον κώδικα για όλο το παιχνίδι
// Μπορείτε γράψετε κλάσεις που να έχουν κάποια συμπεριφορά, 
// π.χ. Game, PlayingCountry, Neighbour, ...
// ή να και ακολουθήσετε άλλη τακτική, που να σας είναι πιο προσιτή

var score = 0;
var round = 1;

function requests(countriesArr) {
    var countriesArr = shuffleArray(countriesArr);

    var URL = "https://restcountries.eu/rest/v2/alpha/";
    var xhttp = new XMLHttpRequest();

    xhttp.open("GET", URL + countriesArr[0]["code3"], false);
    xhttp.send();
    var borders = JSON.parse(xhttp.responseText)["borders"];
    while (borders.length == 0) {
        countriesArr = shuffleArray(countriesArr);
        xhttp.open("GET", URL + countriesArr[0]["code3"], false);
        xhttp.send();
        borders = JSON.parse(xhttp.responseText)["borders"];
    }

    var countryAndBorders = new Array();
    countryAndBorders.push(countriesArr[0]);

    for (var i = 0; i < borders.length; i++) {
        for (var j = 0; j < countriesArr.length; j++) {
            if (countriesArr[j]["code3"] == borders[i]) {
                countryAndBorders.push(countriesArr[j]);
                break;
            }
        }
    }

    return countryAndBorders;
}

function editInnerHTML(countriesArr) {
    document.getElementById("btn-next-round").disabled = true;
    document.getElementById("my-country-name").innerHTML = "<h2>" + countriesArr[0]["name"] + "</h2>";
    document.getElementById("my-country-flag").innerHTML = country2emoji2(countriesArr[0]["code"]);
    document.getElementById("round").innerHTML = round;

    var fakeBorders = new Array();
    const shuffledCountries = shuffleArray(countryObjects);

    for (var i = 0; i < shuffledCountries.length; i++) {
        for (var j = 0; j < countriesArr.length; j++) {
            if (shuffledCountries[i] == countriesArr[j]) {
                break;
            }
        }
        if ((j == countriesArr.length) && (shuffledCountries[i] != countriesArr[j])) {
            fakeBorders.push(shuffledCountries[i]);
        }
        if (fakeBorders.length == (countriesArr.length - 1) * 2) {
            break;
        }
    }

    var finalCountries = countriesArr.slice(1, countriesArr.length).concat(fakeBorders);

    finalCountries = shuffleArray(finalCountries);

    document.getElementById("neighbours-panel").innerHTML = "<div class=\"neighbour\">" +
        "<div class=\"flag\">" + country2emoji2(finalCountries[0]["code"]) + "</div>" +
        "<div class=\"country-name\">" + finalCountries[0]["name"] + "</div>" +
        "<span style=\"display:none\">" + finalCountries[0]["code"] + "</span>" + "</div>";

    for (var i = 1; i < finalCountries.length; i++) {
        document.getElementById("neighbours-panel").innerHTML += "<div class=\"neighbour\">" +
            "<div class=\"flag\">" + country2emoji2(finalCountries[i]["code"]) + "</div>" +
            "<div class=\"country-name\">" + finalCountries[i]["name"] + "</div>" +
            "<span style=\"display:none\">" + finalCountries[i]["code"] + "</span>" + "</div>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    //start a new Game
    //...
    var countriesArray = requests(countryObjects);

    editInnerHTML(countriesArray);

    var countryElements = document.getElementsByClassName("neighbour");

    var mistakesAvail = countriesArray.length - 1;
    var correctsAvail = countriesArray.length - 1;

    var onClickEL = function () {
        if ((correctsAvail != 0) && (mistakesAvail != 0)) {
            this.classList.add("was-clicked");

            for (var i = 0; i < countriesArray.length; i++) {
                if ((this.getElementsByTagName("span")[0].innerHTML == countriesArray[i]["code"]) && (correctsAvail != 0) && (mistakesAvail != 0)) {
                    this.classList.add("neighbour-is-valid");
                    score += 5;
                    document.getElementById("score").innerHTML = score;
                    correctsAvail--;
                    document.getElementById("progress").value += 100 / (countriesArray.length - 1);
                    if (correctsAvail == 0) {
                        document.getElementById("btn-next-round").disabled = false;
                        document.getElementById("results-message").innerHTML = "<h2>Τους βρήκατε όλους!</h2>";
                        document.getElementById("results-message").style.color = "black";
                        document.getElementById("results-message").style.visibility = "visible";
                        document.getElementById("next-round-panel").style.visibility = "visible";
                        document.getElementById("neighbours-panel").style.opacity = "25%";
                        document.getElementById("progress").value = 100;
                    }
                    return;
                }
            }

            this.classList.add("neighbour-is-invalid");
            score -= 3;
            document.getElementById("score").innerHTML = score;
            mistakesAvail--;
            if (mistakesAvail == 0) {
                document.getElementById("btn-next-round").disabled = false;
                document.getElementById("results-message").innerHTML = "<h2>Κρίμα, χάσατε!</h2>";
                document.getElementById("results-message").style.color = "brown";
                document.getElementById("results-message").style.visibility = "visible";
                document.getElementById("next-round-panel").style.visibility = "visible";
                document.getElementById("neighbours-panel").style.opacity = "25%";
            }
        }

        return;
    };

    for (var i = 0; i < countryElements.length; i++) {
        countryElements[i].addEventListener("click", onClickEL);
    }

    //event listener to new game button
    document.querySelector("#btn-new-game").addEventListener("click", () => {
        // ...
        score = 0;
        round = 1;
        document.getElementById("round").innerHTML = round;
        document.getElementById("score").innerHTML = score;
        document.getElementById("progress").value = 0;
        document.getElementById("results-message").style.visibility = "hidden";
        document.getElementById("next-round-panel").style.visibility = "hidden";
        document.getElementById("neighbours-panel").style.opacity = "100%";

        countriesArray = requests(countryObjects);

        editInnerHTML(countriesArray);

        mistakesAvail = countriesArray.length - 1;
        correctsAvail = countriesArray.length - 1;

        for (var i = 0; i < countryElements.length; i++) {
            countryElements[i].addEventListener("click", onClickEL);
        }
    })

    //event listener to next round button
    document.querySelector("#btn-next-round").addEventListener("click", () => {
        round++;
        document.getElementById("round").innerHTML = round;

        document.getElementById("progress").value = 0;

        document.getElementById("results-message").style.visibility = "hidden";
        document.getElementById("next-round-panel").style.visibility = "hidden";
        document.getElementById("neighbours-panel").style.opacity = "100%";

        countriesArray = requests(countryObjects);

        editInnerHTML(countriesArray);

        mistakesAvail = countriesArray.length - 1;
        correctsAvail = countriesArray.length - 1;

        for (var i = 0; i < countryElements.length; i++) {
            countryElements[i].addEventListener("click", onClickEL);
        }
    })

});