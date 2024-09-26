declare const chrome: any;

interface Question {
    text: string;
    choices: string[];
    correctIndex: number;
}
interface Quiz {
    title: string;
    questions: Question[];
}

let QUIZZES: { [ id: string ]: Quiz } = {};

const RetrieveQuizzes = () => {
    return new Promise((resolve) => {
        chrome.storage.local.get(["quizzes"], function(items: any){
            const json = items["quizzes"];
            if (json == undefined) {
                QUIZZES = {};
            }
            else {
                QUIZZES = JSON.parse(json);
            }

            resolve(undefined);
        });
    })
}
const SaveQuizzes = () => {
    const json = JSON.stringify(QUIZZES);
    chrome.storage.local.set({ quizzes: json });
      
    //console.log(QUIZZES);
    //localStorage.setItem("quizzes", json);
}





//https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
function GuidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const transcriptTextfield = document.getElementById("transcriptTextfield")! as HTMLInputElement;
const generateQuizButton = document.getElementById("generateQuizButton")!;

generateQuizButton.onclick = async () => {
    const quizID = GuidGenerator();
    const transcript = transcriptTextfield.value;

    //create and save the quiz to local storage, then refresh the 'saved quizes list'
    const quiz = await GenerateQuizFromTranscript(transcript);
    QUIZZES[quizID] = { title: quizID, questions: quiz };
    SaveQuizzes();

    RefreshQuizList();
}

const quizList = document.getElementById("quizList")!;
const RefreshQuizList = () => {
    quizList.innerHTML = "";

    for (const id in QUIZZES) {
        const quiz = QUIZZES[id];
        
        const element = document.createElement("p");
        element.innerText = quiz.title;
        element.onclick = () => {
            InitQuiz(id);
        }
        quizList.append(element);
    }
}





const indexMap: { [ key: number ]: string } = { 0: "A", 1: "B", 2: "C", 3: "D" };

const quizContainer = document.getElementById("quiz")!;
const questionMessage = document.getElementById("title")!;
const choices = document.getElementById("choices")!;
const currentlySelected = document.getElementById("currentlySelected")!;
const nextButton = document.getElementById("nextButton")!;
const quitQuizButton = document.getElementById("quitQuizButton")!;

const resultsContainer = document.getElementById("results")!;
const resultMessage = document.getElementById("message")!;
const doneButton = document.getElementById("done")!;

const InitQuiz = async (id: string) => {
    //show quiz popup
    quizContainer.style.display = "";

    quitQuizButton.onclick = () => {
        quizContainer.style.display = "none";
    }

    //get quiz, and display one question at a time
    const quiz = QUIZZES[id];
    let selectedIndex: number = 0;
    let score = 0;

    let i = 0;
    while (i < quiz.questions.length) {
        const question = quiz.questions[i];
        let answeredFirstTime = true;

        questionMessage.innerText = `${i + 1}. ${question.text}`;
        
        choices.innerHTML = "";
        for (const [i, choice] of question.choices.entries()) {
            const choiceElement = document.createElement("div")!;
            choiceElement.className = "choice";
            choiceElement.id = `choice${i}`;
            choiceElement.innerText = `${indexMap[i]}. ${choice}`;
            choiceElement.onclick = () => {
                selectedIndex = i;
                UpdateCurrentlySelected(selectedIndex);
            }
            choices.append(choiceElement);
        }

        selectedIndex = 0;
        UpdateCurrentlySelected(selectedIndex);


        const AnswerQuestion = async () => {
            await WaitForNext();

            //check whether answer is correct; if it isn't, then stay on question
            if (selectedIndex == question.correctIndex) {
                if (answeredFirstTime == true) {
                    score += 1;
                }
                i += 1;
            }
            else {
                answeredFirstTime = false; //user will no longer get a point for answering this question correctly

                //colour the wrongly selected choice red
                const wronglySelectedChoice = document.getElementById(`choice${selectedIndex}`)!;
                wronglySelectedChoice.style.backgroundColor = "rgb(255, 0, 0, 0.5)";

                await AnswerQuestion(); //redoes current question
            }
        }
        await AnswerQuestion();
    }


    //quiz done, show results and go back to main screen (hide quiz screen)
    const percentage = Math.round((score / quiz.questions.length) * 100);

    //show results screen
    resultsContainer.style.display = "";
    resultMessage.innerText = `You got ${percentage}%`;
    doneButton.onclick = () => {
        //hide results and quiz screen
        resultsContainer.style.display = "none";
        quizContainer.style.display = "none";
    }
}

const UpdateCurrentlySelected = (index: number) => {
    currentlySelected.innerText = `Currently Selected: ${indexMap[index]}`;
}

const WaitForNext = () => {
    return new Promise((resolve) => {
        nextButton.onclick = () => {
            resolve(undefined);
        }
    })
}





const Main = async () => {
    await RetrieveQuizzes();
    RefreshQuizList();
}
Main();