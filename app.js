//How many women around 30's were on the titanic?
import { DecisionTree } from "./libraries/decisiontree.js"
import { VegaTree } from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "./data/titanic.csv"
const trainingLabel = "survived"
const ignored = ['name',]

let decisionTree;
let trainData;
let testData;
let decision;
let amountCorrect= 0;
let totalAmount;

let trueAndAlive = 0;
let falseButAlive = 0;
let falseButDead = 0;
let trueAndDead = 0;

let a = document.getElementById("true-and-alive");
let b = document.getElementById("false-but-alive");
let c = document.getElementById("false-but-dead");
let d = document.getElementById("true-and-dead");

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        //checking if the data works, switch console.log
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    trainData = data.slice(0, Math.floor(data.length * 0.8));
    testData = data.slice(Math.floor(data.length * 0.8) + 1);
    totalAmount  = testData.length;
    data.sort(() => (Math.random() - 0.5));

    // maak het algoritme aan
    decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: "Survived",
        maxTreeDepth: 3,
    })

    let json = decisionTree.toJSON()
    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())

    // todo : maak een prediction met een sample uit de testdata
    let survivors = testData[0]
    let survivorsPrediction = decisionTree.predict(survivors);
    console.log(`Survived the titanic : ${survivorsPrediction}`)

    testSurvivors(testData)
}

function testSurvivors(survivors) {
    
    for (let survivor of survivors) {
        const survivorWithoutLabel = Object.assign({}, survivor)
        delete survivorWithoutLabel.survived

        //prediction
        let prediction = decisionTree.predict(survivorWithoutLabel)

        //confusion matrix!!
        if(prediction == 1 && survivor.Survived == 1) {
            trueAndAlive++;
            amountCorrect++;
        }
         if (prediction == 1 && survivor.Survived != 1){
            falseButAlive++;
        }
         if (prediction == 0 && survivor.Survived != 0){
            falseButDead++;
        }
        if (prediction == 0 && survivor.Survived == 0){
            trueAndDead++;
            amountCorrect++;
        }
        
    }

    //bereken de accuracy met behulp van alle test data
    let accuracy = amountCorrect / totalAmount * 100;
    document.getElementById("accuracy").innerHTML = accuracy;
    console.log(`Je accuracy is ${accuracy}`)

    a.innerHTML = `${trueAndAlive}`;
    b.innerHTML = `${falseButAlive}`;
    c.innerHTML = `${falseButDead}`;
    d.innerHTML = `${trueAndDead}`;
   
}

loadData()