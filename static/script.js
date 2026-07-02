
// ==============================
// SELECTING HTML ELEMENTS
// ==============================

const lyricsInput = document.getElementById("lyrics-input");

const analyzeBtn = document.getElementById("analyze-btn");

const clearBtn = document.getElementById("clear-btn");

const resultBox = document.getElementById("result-box");

const loading = document.getElementById("loading");

const analysisMode =document.getElementById("analysis-mode");

const copyBtn = document.getElementById("copy-btn");

// ==============================
// CLEAR BUTTON FUNCTIONALITY
// ==============================

clearBtn.addEventListener("click", () => {

    // clear textarea
    lyricsInput.value = "";

    // reset result section
    resultBox.innerHTML = `
        <p class="default-message">
            Your AI-generated analysis will appear here.
        </p>
    `;

});

copyBtn.addEventListener("click", () => {

    const text = resultBox.innerText;

    if(text.trim() === ""){
        return;
    }

    navigator.clipboard.writeText(text);

    copyBtn.innerText = "Copied!";

    setTimeout(() => {
        copyBtn.innerText = "Copy Result";
    }, 2000);

});


// ==============================
// ANALYZE BUTTON FUNCTIONALITY
// ==============================

analyzeBtn.addEventListener("click", async () => {

    // get lyrics text
    const lyrics = lyricsInput.value.trim();

    // validation
    if(lyrics.length === 0){

        alert("Please enter some lyrics first.");

        return;
    }

    // show loading
    loading.classList.remove("hidden");

    // clear previous result
    resultBox.innerHTML = "";

    try{

        // sending request to flask backend
        const response = await fetch("/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },


body: JSON.stringify({

    lyrics: lyrics,

    mode: analysisMode.value

})



        });

        // converting response to json
        const data = await response.json();

        // hide loading
        loading.classList.add("hidden");

        // display result
        showAnalysis(data.analysis);

    }
    catch(error){

        // hide loading
        loading.classList.add("hidden");

        // error message
        resultBox.innerHTML = `
            <p style="color: #f87171;">
                Something went wrong. Please try again.
            </p>
        `;

        console.log(error);
    }

});


// ==============================
// FUNCTION TO DISPLAY ANALYSIS
// ==============================

function showAnalysis(text){

    // split response by lines
    const lines = text.split("\n");

    let finalResult = "";

    lines.forEach((line) => {

        // ignore empty lines
        if(line.trim() !== ""){

            finalResult += `
                <p style="margin-bottom: 18px;">
                    ${line}
                </p>
            `;
        }

    });

    resultBox.innerHTML = finalResult;
}


// ==============================
// OPTIONAL:
// ENTER KEY SHORTCUT
// ==============================

lyricsInput.addEventListener("keydown", (event) => {

    // Ctrl + Enter to analyze
    if(event.ctrlKey && event.key === "Enter"){

        analyzeBtn.click();
    }

});


// ==============================
// OPTIONAL:
// AUTO RESIZE TEXTAREA
// ==============================

lyricsInput.addEventListener("input", () => {

    lyricsInput.style.height = "auto";

    lyricsInput.style.height =
        lyricsInput.scrollHeight + "px";

});