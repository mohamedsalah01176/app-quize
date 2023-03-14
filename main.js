let countSpan=document.querySelector(".quize-app .count");
let bullets=document.querySelector(".bullets");
let spanCountainer=document.querySelector(".bullets .span");
let quizeArea=document.querySelector(".quize-area");
let answerArea=document.querySelector(".answer-area");
let submitbutton=document.querySelector(".submit-button");
let resultContainer=document.querySelector(".resuts");
let countDownElement=document.querySelector(".count-bown");

let curentindex=0;
let rightanswer=0;
let countDownInterval;

function getquestion(){
    let myRequest=new XMLHttpRequest();
    myRequest.onreadystatechange =function (){
        if(this.readyState ===4 && this.status===200){
            let questionObject=JSON.parse(this.responseText);
            let questionCount=questionObject.length;
            console.log((questionCount));
            createBulltes(questionCount);
            addQuestionData(questionObject[curentindex] ,questionCount);

            countDwon(5,questionCount);
            
            submitbutton.onclick=() =>{
                let rightAnswer=questionObject[curentindex].right_answer;
                curentindex++;
                
                checkAnswer(rightAnswer,questionCount);
                
                quizeArea.innerHTML="";
                answerArea.innerHTML="";
                
                addQuestionData(questionObject[curentindex] ,questionCount);
                
                handleBulltes();
                
                clearInterval(countDownInterval);
                countDwon(5,questionCount);
                
                showResult(questionCount);
            }
        };
    };


    myRequest.open("GET","html_question.json",true)
    myRequest.send()
};
getquestion();

function createBulltes(num){
    countSpan.innerHTML=num;

    for(let i=0;i<num;i++){
        let bullets=document.createElement("span");

        if(i ===0){
            bullets.className="on";
        }
        spanCountainer.appendChild(bullets);
    };
};
function addQuestionData(obj,count){
    if(curentindex <count){
        let questionTitle=document.createElement("h2");
        let questionText=document.createTextNode(obj.title);

        questionTitle.appendChild(questionText);

        quizeArea.appendChild(questionTitle);
        for(let i=1;i<=4;i++){
            let mainDiv=document.createElement("div");
            mainDiv.className="class";

            let radioInput=document.createElement("input");

            radioInput.type="radio";
            radioInput.id=`answer_${i}`;
            radioInput.name="question";
            radioInput.dataset.answer=obj[`answer_${i}`];

            if(i===1){
                radioInput.checked=true;
            }

            let theLabel=document.createElement("label");
            theLabel.htmlFor=`answer_${i}`;
            let textLabel=document.createTextNode(obj[`answer_${i}`]);
        
            theLabel.appendChild(textLabel);
        
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
        
            answerArea.appendChild(mainDiv);
        };
    }


};
function checkAnswer(ranswer,count){
    let answer=document.getElementsByName("question");
    let choosenquestion;

    for(let i=0;i<answer.length;i++){
        if(answer[i].checked){
            choosenquestion=answer[i].dataset.answer;
        }
    };
    // console.log(ranswer);
    // console.log(choosenquestion);

    if(ranswer ===choosenquestion){
        rightanswer++;
        console.log("good choose")
    }
};
function handleBulltes(){
    let bulletsSpan=document.querySelectorAll(".bullets .span span");
    let arrayBullets=Array.from(bulletsSpan);

    arrayBullets.forEach((span,index) =>{
        if(curentindex === index){
            span.className="on";
        }
    });
};
function showResult(count){
    let theResult;
    if(curentindex === count){
        quizeArea.remove();
        answerArea.remove();
        submitbutton.remove();
        bullets.remove();
        if(rightanswer >count/2 &&rightanswer <count){
            theResult=`<span class="good">Good</span>,${rightanswer} From ${count} Is Good`;
        }else if(rightanswer ===count){
            theResult=`<span class="perfect">perfect</span>,${rightanswer} From ${count} Is Good`;
        }else{
            theResult=`<span class="bad">Bad</span>,${rightanswer} From ${count} Is Good`;
        };
        resultContainer.innerHTML=theResult;
        resultContainer.style.padding="10px";
        resultContainer.style.backgroundColor="white";
        resultContainer.style.marginTop="10px";
    }


};
function countDwon(duration,count){
    if(curentindex <count){
        let minutes,seconds;
        countDownInterval=setInterval(() =>{
            minutes=parseInt(duration/60);
            seconds=parseInt(duration%60);

            minutes =minutes<10 ?`0${minutes}`:minutes;
            seconds =seconds<10 ?`0${seconds}`:seconds;

            countDownElement.innerHTML=`${minutes}:${seconds}`;

            if(--duration <0){
                clearInterval(countDownInterval);
                submitbutton.click();
            }
        },1000)
    }
}