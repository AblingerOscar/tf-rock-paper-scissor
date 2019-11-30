const serverAddress = "http://localhost:80";
window.onload = function () {
    const mediaWidth = 512;
    const mediaHeight = 384;

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const canvas2 = document.getElementById('canvas2');
    const snapButton = document.getElementById('snap');
    const saveButton = document.getElementById('save');
    const goButton = document.getElementById('go-button');
    const labels = document.getElementById('labels');
    const aiSymbol = this.document.getElementById('ai-symbol');
    const counter = this.document.getElementById('countdown');
    const victoryLabel = this.document.getElementById('victory-text');

    const constraints = {
        audio: false,
        video: {
            width: mediaWidth,
            height: mediaWidth,
        }
    };

    init();

    snapButton.addEventListener('click', processSnapButton);

    saveButton.addEventListener('click', () => processButton(saveButton, serverAddress + '/api/predict'));

    // Access webcam
    async function init() {
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        try {
            const stream =
                await navigator.mediaDevices.getUserMedia(constraints);
            window.stream = stream;
            video.srcObject = stream;

            snapButton.disabled = false;
            video.removeAttribute('hidden')
            document.getElementById('image-placeholder').setAttribute('hidden', '');
        } catch (e) {
            console.error(`navigator.getUserMedia error: ${e.toString()}`);
        }
    };

    function processSnapButton() {
        saveButton.disabled = false;
        canvas.width = mediaWidth;
        canvas.height = mediaHeight;

        let context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, mediaWidth, mediaHeight);

        // canvas2 (the game)
        let context2 = canvas2.getContext('2d');
        context2.drawImage(video, 0, 0, canvas2.width, canvas2.height);
    }

    function processButton(button, route) {
        button.classList.add('is-loading');

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                button.classList.remove('is-loading')
                resolve({
                    paper: 0.9628594517707825,
                    rock: 0.09970790892839432,
                    scissors: 0.00016899642650969326
                })
            }, 3000)
        })
        //return sendPostWithImage(button, route);
    };

    function sendPostWithImage(button, route) {
        return new Promise((resolve, reject) => {
            let imageData = canvas.toDataURL('image/jpg');

            let xhr = new XMLHttpRequest();
            xhr.button = button;
            xhr.open('POST', route);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let prediction = processResponse(xhr.responseText);
                    this.button.classList.remove('is-loading');
                    resolve(prediction);
                } else {
                    this.button.classList.remove('is-loading');
                }
            };
            let removedPaddingData = imageData.substr(imageData.indexOf(',') + 1);
            xhr.send(JSON.stringify({ "image": removedPaddingData }));
        })
    };

    function processResponse(response) {
        if (!response) {
            console.error("No response.");
            return;
        }
        response = JSON.parse(response);

        if (!response.prediction) {
            console.error("Couldn't parse response.");
            return;
        }

        console.log("got response: ", response);

        labels.innerHTML = '';
        const predictionKeys = Object.keys(response.prediction);
        predictionKeys.forEach(key => {
            addLabelToView(key, response.prediction[key]);
        });

        document.getElementById('not-loaded-notice').setAttribute('hidden', '');
        return response.prediction
    };

    function addLabelToView(description, score) {
        let roundedScore = Math.round(score * 100);
        let labelHtml = `
        <a class="panel-block">
            <div class="row">
                <div class="col-9">
                    <span class="tag is-dark is-medium">
                        ${description.substr(0, 22)}
                    </span>
                </div>
                <div class="col-3">
                    <span>${roundedScore}%</span>
                </div>
                <div class="col-12">
                    <progress class="progress
                        ${roundedScore > 50 ? 'is-success' : 'is-warning'}" value="${roundedScore}" max="100"></progress>
                </div>
            </div>
        </a>
        `;

        labels.innerHTML += labelHtml;
    };



    /* === The game === */
    function countDown() {
        waitOneSecond = () => new Promise((resolve) => setTimeout(resolve.bind(null), 1000))

        counter.dataset.status = 'counting'
        counter.textContent = "3"
        aiSymbol.dataset.status = 'count-down'
        aiSymbol.className = 'ai-symbol far fa-hand-rock'
        return waitOneSecond().then(() => {
            console.log('setting to 2')
            counter.offsetHeight //trigger reflow
            counter.textContent = "2"
            return waitOneSecond()
        }).then(() => {
            console.log('setting to 1')
            counter.offsetHeight //trigger reflow
            counter.textContent = "1"
            return waitOneSecond()
        }).then(() => {
            counter.offsetHeight //trigger reflow
            counter.textContent = "0"
            console.log('setting to 0')
            counter.dataset.status = 'done'
        })
    }

    function makeAiChoice(predictionScores) {
        const predictionKeys = Object.keys(predictionScores);
        let max = {key:'', score:0}

        predictionKeys.forEach(key => {
            if (predictionScores[key] >= max.score) {
                max = {
                    key, score: predictionScores[key]
                }
            }
        });

        let prediction = max.key
        let randomBool = Math.floor((Math.random() * 2)) == 0;
        let aiChoice = 'rock'

        switch (prediction) {
            case 'rock':
                aiChoice = randomBool ? 'paper' : 'spock'
                break;
            case 'paper':
                aiChoice = randomBool ? 'scissors' : 'lizard'
                break;
            case 'scissor':
                aiChoice = randomBool ? 'rock' : 'spock'
                break;
            case 'lizard':
                aiChoice = randomBool ? 'rock' : 'scissor'
                break;
            case 'spock':
                aiChoice = randomBool ? 'paper' : 'lizard'
                break;
        }

        return {prediction, aiChoice}
    }

    const beatsNarration = {
        'rock': {
            'scissor': 'rock crushes scissors',
            'lizard': 'rock crushes lizard',
        },
        'paper': {
            'rock': 'paper covers rock',
            'spock': 'paper disproves spock',
        },
        'scissors': {
            'paper': 'scissors cuts paper',
            'lizard': 'scissors decapitates lizard',
        },
        'lizard': {
            'paper': 'lizard eats paper',
            'spock': 'lizard poisons spock',
        },
        'spock': {
            'rock': 'spock vaporizes rock',
            'scissor': 'spock smashes scissors',
        },
    }

    const beatTexts = [
        'I won!',
        'You lost!',
        'Were you even trying?',
        'Lol once again: I win!',
        ':shrug:',
        'That was easy!',
        'I saw that coming from a mile away!'
    ]

    function getRandomBeatText() {
        let randomNr = Math.floor((Math.random() * beatTexts.length));
        return beatTexts[randomNr]
    }

    function makeVictoryText({prediction, aiChoice}) {
        let narration
        try {
            narration = beatsNarration[aiChoice][prediction]
        } catch(e) {
            narration = 'AI'
        }
        return narration + ': ' + getRandomBeatText();
    }

    goButton.addEventListener('click', () => {
        countDown().then(() => {
            processSnapButton();
            processButton(goButton, serverAddress + '/api/predict').then((predictionScores) => {
                let {prediction, aiChoice} = makeAiChoice(predictionScores)
                
                victoryLabel.textContent = makeVictoryText({prediction, aiChoice})
                aiSymbol.dataset.status = 'done'
                aiSymbol.className = 'ai-symbol far fa-hand-' + aiChoice
            }).catch((reason) => {
                console.error(reason)
            })
        })
    });
};
