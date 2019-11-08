const serverAddress = "http://localhost:80";
window.onload = function () {
    const mediaWidth = 512;
    const mediaHeight = 384;

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const snapButton = document.getElementById('snap');
    const saveButton = document.getElementById('save');
    const labels = document.getElementById('labels');

    const constraints = {
        audio: false,
        video: {
            width: mediaWidth,
            height: mediaWidth,
        }
    };

    init();

    snapButton.addEventListener('click', () => {
        saveButton.disabled = false;
        canvas.width = mediaWidth;
        canvas.height = mediaHeight;

        let context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, mediaWidth, mediaHeight);
    });

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

    function processButton(button, route) {
        button.classList.add('is-loading');
        sendPostWithImage(button, route);
    };

    function sendPostWithImage(button, route) {
        let imageData = canvas.toDataURL('image/jpg');

        let xhr = new XMLHttpRequest();
        xhr.button = button;
        xhr.open('POST', route);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                processResponse(xhr.responseText);
            }
            this.button.classList.remove('is-loading');
        };
        let removedPaddingData = imageData.substr(imageData.indexOf(',') + 1);
        xhr.send(JSON.stringify({ "image": removedPaddingData }));
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
};
