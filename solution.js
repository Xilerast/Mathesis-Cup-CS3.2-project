// Ένας βοηθητικός πίνακας που θα περιέχει τις χώρες από το countries.js σε λίγο πιο βολική μορφή
const allCountries = new Array();
// πχ. allCountries['GRE'] = { code2: "GR", name: "Greece"}, ή κάτι παρόμοιο 

// Εδώ μπορείτε να βάλετε τον κώδικα για όλο το παιχνίδι
// Μπορείτε γράψετε κλάσεις που να έχουν κάποια συμπεριφορά, 
// π.χ. Game, PlayingCountry, Neighbour, ...
// ή να και ακολουθήσετε άλλη τακτική, που να σας είναι πιο προσιτή

var round = 1;
var score = 0;
var fakeBordersCodes = new Array();
var numberOfValidNeighbors = 0;
var numberOfValidsFound = 0;
var mistakesAvail = 0;
const numOfRows = 4;

// Updates game progress
function updateProgress(result) {
    const nextRoundPanel = document.getElementById("next-round-panel");

    const resultElement = document.getElementById("result");
    const scorePtsElem = document.getElementById("score-pts");

    if (result) {
        numberOfValidsFound++;
        score += 3;
        scorePtsElem.innerText = score;
        const progressBar = document.getElementById("progress");
        progressBar.setAttribute("value", (numberOfValidsFound * 100) / numberOfValidNeighbors);

        if (numberOfValidsFound === numberOfValidNeighbors) {
            resultElement.setAttribute("class", "success-result");
            resultElement.innerText = "Success!";
            nextRoundPanel.appendChild(resultElement);
            nextRoundPanel.style.display = "flex";
            document.getElementById("next-round").disabled = false;
        }
    } else {
        mistakesAvail--;
        score -= 5;
        scorePtsElem.innerText = score;

        if (mistakesAvail === 0) {
            resultElement.setAttribute("class", "failure-result");
            resultElement.innerText = "Failure...";
            nextRoundPanel.appendChild(resultElement);
            nextRoundPanel.style.display = "flex";
        }
    }
}

// Checks if neighbor is valid.
function checkNeighbor(event) {
    let thisClassAttribute = this.getAttribute("class");
    thisClassAttribute += " was-clicked";
    const countryCodeSpan = this.lastChild;
    if (fakeBordersCodes.includes(countryCodeSpan.innerText)) {
        thisClassAttribute += " is-invalid";

        updateProgress(false);
    } else {
        thisClassAttribute += " is-valid";

        updateProgress(true);
    }

    this.setAttribute("class", thisClassAttribute);
    this.removeEventListener("click", checkNeighbor);
}

function countryRemove(countriesArray) {
    for (let i = 0; i < countryObjects.length; i++) {
        for (let j = 0; j < countriesArray.length; j++) {
            if (countriesArray[j] === countryObjects[i].code3) {
                countriesArray.splice(i, 1);
            }
        }
    }
}

// Lookup countries and fill array
function countryLookupArray(countriesArray) {
    const resultArray = new Array();

    for (let i = 0; i < countryObjects.length; i++) {
        for (let j = 0; j < countriesArray.length; j++) {
            if (countriesArray[j] === countryObjects[i].code3) {
                resultArray.push(countryObjects[i]);
            }
        }
    }

    return resultArray;
}

// Updates the HTML page with the countries given by the array passed as an argument
function editInnerHTML(country, countriesArr) {
    document.getElementById("next-round").disabled = true;
    document.getElementById("my-country-name").innerHTML = "<h2>" + country["name"] + "</h2>";
    document.getElementById("my-country-flag").innerHTML = country2emoji2(country["code"]);
    document.getElementById("round-number").innerHTML = round;
    document.getElementById("score-pts").innerHTML = score;

    let fakeBorders = new Array();
    const shuffledCountries = shuffleArray(countryObjects);

    for (var i = 0; i < shuffledCountries.length; i++) {
        for (var j = 0; j < countriesArr.length; j++) {
            if (shuffledCountries[i] === countriesArr[j]) {
                break;
            }
        }
        if ((j === countriesArr.length) && (shuffledCountries[i] !== countriesArr[j])) {
            fakeBorders.push(shuffledCountries[i]);
            fakeBordersCodes.push(shuffledCountries[i].code);
        }
        if (fakeBorders.length === (countriesArr.length) * 2) {
            break;
        }
    }

    let finalCountries = countriesArr.slice(0, countriesArr.length).concat(fakeBorders);

    finalCountries = shuffleArray(finalCountries);

    const neighborsList = document.getElementById("neighbors-list");
    let innerHTML = "";
    for (i = 0; i < finalCountries.length; i++) {
        if ((finalCountries.length - i) <= 4) {
            break;
        }
        innerHTML += "<div class=\"neighbor\">" +
            "<div class=\"flag\">" + country2emoji2(finalCountries[i]["code"]) + "</div>" +
            "<div class=\"country-name\">" + finalCountries[i]["name"] + "</div>" +
            "<span style=\"display:none\">" + finalCountries[i]["code"] + "</span>" + "</div>";
    }

    neighborsList.innerHTML = innerHTML;

    let rowRemainder = i % 4;
    const lastNeighborRow = document.createElement("div");
    if (i < finalCountries.length) {
        for (var index = 0; (index < numOfRows - rowRemainder) && (i < finalCountries.length); index++) {
            innerHTML += "<div class=\"neighbor\">" +
                "<div class=\"flag\">" + country2emoji2(finalCountries[i]["code"]) + "</div>" +
                "<div class=\"country-name\">" + finalCountries[i]["name"] + "</div>" +
                "<span style=\"display:none\">" + finalCountries[i]["code"] + "</span>" + "</div>";
                i++;
        }

        neighborsList.innerHTML = innerHTML;

        lastNeighborRow.setAttribute("id", "last-neighbor-row");
        innerHTML = "";
        if (finalCountries.length - i === 4) {
            lastNeighborRow.style.display = "grid";
            lastNeighborRow.style.gridTemplateColumns = "repeat(4, 1fr)";
        }

        for (; i < finalCountries.length; i++) {
            innerHTML += "<div class=\"neighbor\">" +
                "<div class=\"flag\">" + country2emoji2(finalCountries[i]["code"]) + "</div>" +
                "<div class=\"country-name\">" + finalCountries[i]["name"] + "</div>" +
                "<span style=\"display:none\">" + finalCountries[i]["code"] + "</span>" + "</div>";
        }

        innerHTML += "</div>";
    }

    lastNeighborRow.innerHTML += innerHTML;
    document.getElementById("neighbors-panel").appendChild(lastNeighborRow);
}

async function loadRound() {
    const shuffledCountries = shuffleArray(countryObjects.slice());
    for (var i = 0; i < shuffledCountries.length; i++) {
        var country = shuffledCountries[i];
        shuffledCountries.splice(i, 1);
        var response = await fetch("https://restcountries.com/v2/alpha/" + country["code"]);
        responseJSON = await response.json();
        if (responseJSON["borders"]) break;
    }

    const countries = countryLookupArray(responseJSON["borders"]);
    numberOfValidNeighbors = countries.length;
    editInnerHTML(country, countries);

    const neighborClasses = document.getElementsByClassName("neighbor");
    for (i = 0; i < neighborClasses.length; i++) {
        neighborClasses[i].addEventListener("click", checkNeighbor);
    };

    mistakesAvail = numberOfValidNeighbors;
}

document.addEventListener("DOMContentLoaded", async () => {
    //start a new Game
    loadRound();

    //event listener to new game button
    document.querySelector("#new-game").addEventListener("click", () => {
        round = 1;
        score = 0;
        loadRound();
        document.getElementById("next-round-panel").style.display = "none";
        document.getElementById("progress").setAttribute("value", 0);
        document.getElementById("last-neighbor-row").remove();
    })

    //event listener to next round button
    document.querySelector("#next-round").addEventListener("click", () => {
        round++;
        loadRound();
        document.getElementById("round-number").innerText = round;
        document.getElementById("next-round-panel").style.display = "none";
        document.getElementById("progress").setAttribute("value", 0);
        document.getElementById("last-neighbor-row").remove();
    })

});