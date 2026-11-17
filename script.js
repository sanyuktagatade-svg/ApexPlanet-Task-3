// ===============================
// INTERACTIVE QUIZ
// ===============================

const questions = [
    {
        question: "Which language is used to structure a webpage?",
        answers: ["CSS", "HTML", "Python", "Java"],
        correct: "HTML"
    },
    {
        question: "Which language is used to style webpages?",
        answers: ["HTML", "Java", "CSS", "C++"],
        correct: "CSS"
    },
    {
        question: "Which language makes webpages interactive?",
        answers: ["JavaScript", "HTML", "SQL", "C"],
        correct: "JavaScript"
    },
    {
        question: "What does CSS stand for?",
        answers: [
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Creative Style System",
            "Colorful Style Sheets"
        ],
        correct: "Cascading Style Sheets"
    },
    {
        question: "Which symbol is used for an ID selector in CSS?",
        answers: [".", "#", "*", "&"],
        correct: "#"
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const resultElement = document.getElementById("quiz-result");
const scoreElement = document.getElementById("score");
const nextButton = document.getElementById("next-btn");

function showQuestion() {
    answered = false;

    const current = questions[currentQuestion];

    questionElement.textContent =
        `Question ${currentQuestion + 1}: ${current.question}`;

    answersElement.innerHTML = "";
    resultElement.textContent = "";

    current.answers.forEach(answer => {
        const button = document.createElement("button");

        button.textContent = answer;
        button.className = "answer-btn";

        button.addEventListener("click", () => {
            checkAnswer(answer, button);
        });

        answersElement.appendChild(button);
    });

    nextButton.textContent =
        currentQuestion === questions.length - 1
        ? "Show Final Score"
        : "Next Question";
}

function checkAnswer(selected, selectedButton) {
    if (answered) return;

    answered = true;

    const correctAnswer = questions[currentQuestion].correct;

    if (selected === correctAnswer) {
        score++;
        resultElement.textContent = "Correct! Well done!";
        selectedButton.style.background = "#bbf7d0";
    } else {
        resultElement.textContent =
            `Incorrect! Correct answer: ${correctAnswer}`;

        selectedButton.style.background = "#fecaca";
    }

    document.querySelectorAll(".answer-btn").forEach(button => {
        button.disabled = true;

        if (button.textContent === correctAnswer) {
            button.style.background = "#bbf7d0";
        }
    });

    scoreElement.textContent = `Score: ${score}`;
}

nextButton.addEventListener("click", () => {
    if (!answered) {
        resultElement.textContent =
            "Please select an answer first!";
        return;
    }

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        questionElement.textContent = "Quiz Completed!";
        answersElement.innerHTML = "";
        resultElement.textContent =
            `Your final score is ${score} out of ${questions.length}.`;

        nextButton.textContent = "Play Again";
        nextButton.onclick = () => {
            currentQuestion = 0;
            score = 0;
            scoreElement.textContent = "Score: 0";
            nextButton.onclick = null;
            showQuestion();
        };
    }
});

showQuestion();


// ===============================
// WEATHER APP USING OPEN-METEO API
// ===============================

const weatherButton = document.getElementById("weather-btn");
const cityInput = document.getElementById("city");
const weatherResult = document.getElementById("weather-result");

weatherButton.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        weatherResult.textContent = "Please enter a city name.";
        return;
    }

    weatherResult.textContent = "Loading weather information...";

    try {
        // Find city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            weatherResult.textContent = "City not found. Try another city.";
            return;
        }

        const place = geoData.results[0];

        // Get current weather
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Weather information is unavailable.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        const descriptions = {
            0: "Clear Sky",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Overcast",
            45: "Foggy",
            48: "Foggy",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Heavy Drizzle",
            61: "Light Rain",
            63: "Moderate Rain",
            65: "Heavy Rain",
            71: "Light Snow",
            73: "Moderate Snow",
            75: "Heavy Snow",
            80: "Rain Showers",
            81: "Moderate Rain Showers",
            82: "Heavy Rain Showers",
            95: "Thunderstorm",
            96: "Thunderstorm with Hail",
            99: "Heavy Thunderstorm"
        };

        const description =
            descriptions[current.weather_code] || "Weather information";

        weatherResult.innerHTML = `
            <h3>${place.name}, ${place.country || ""}</h3>
            <p>🌡️ Temperature: ${current.temperature_2m} °C</p>
            <p>🌤️ Condition: ${description}</p>
            <p>💧 Humidity: ${current.relative_humidity_2m}%</p>
            <p>💨 Wind Speed: ${current.wind_speed_10m} km/h</p>
        `;

    } catch (error) {
        weatherResult.textContent =
            "Unable to get weather. Please try again.";
    }
}
