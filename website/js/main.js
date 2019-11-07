(function() {
    const watcher = window.watcher

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const start = document.getElementById("start-button");
    const errorMsgElement = document.querySelector('span#errorMsg');
    
    const constraints = {
        audio: false,
        video: {
            width: 1280, height: 720
        }
    };

    // Access webcam
    async function init() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        } catch (e) {
            // TODO: error message
            console.error(e)
        }
    }

    // Success
    function handleSuccess(stream) {
        window.stream = stream;
        video.srcObject = stream;
    }

    // Load init
    init();

    // Draw image
    const context = canvas.getContext('2d');
    start.addEventListener("click", function() {
        context.drawImage(video, 0, 0, 640, 480);
    });
})()