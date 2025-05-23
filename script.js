const video = document.getElementById("video")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

// Load the CocoSsd Model
cocoSsd.load().then((model) => {
    console.log("Model Loaded Successfully!")

    // Start the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.addEventListener('loadeddata', () => {
                detectObjects(model)
            });
        }).catch((error) => {
            alert("Unable to access the webcam!", error)
        })
});

function detectObjects(model) {
    model.detect(video).then((predictions) => {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw the video frame on the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Loop through the predictions

        predictions.forEach((prediction) => {
            const [x, y, width, height] = prediction.bbox;
            const text = `${prediction.class} (${(prediction.score * 100).toFixed(0)}%)`;

            // Draw the bounding box
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height)

            // Draw the object Name above the bounding box

            ctx.fillStyle = "red";
            ctx.font = "25px Arial";
            ctx.fillText(text, x, y > 20 ? y - 10 : 20);

        })
        // Continuously detect Object
        requestAnimationFrame(() => detectObjects(model))
    })
}