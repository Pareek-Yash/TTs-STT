let mediaRecorder;
let audioChunks = [];
let audioContext;

document.getElementById('recordButton').addEventListener('click', function() {
    let recordButton = this;
    let isRecording = recordButton.getAttribute('data-recording') === 'true';

    if (!isRecording) {
        // Start recording
        recordButton.style.backgroundColor = 'red';
        recordButton.setAttribute('data-recording', 'true');
        startRecording();
    } else {
        // Stop recording
        recordButton.style.backgroundColor = 'limegreen';
        recordButton.setAttribute('data-recording', 'false');
        stopRecording();
    }
});

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.start();
        })
        .catch(e => console.error(e));
}

function stopRecording() {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio_data', audioBlob);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json()) // Assuming the server returns JSON
        .then(data => {
            // Display the transcription
            document.getElementById('transcription').innerText = data.transcript;

            // Play the audio
            playAudio(data.audio_filename);
        })
        .catch(error => console.error('Error:', error));

        // Clear the chunks for next recording
        audioChunks = [];
    };
}

function playAudio(audioPathFromServer) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Adjust the path to be relative to the web root
    const relativeAudioPath = audioPathFromServer.replace('ailabs/ui/', '');

    fetch(relativeAudioPath)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.arrayBuffer();
    })
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
        source.onended = function() {
            console.log('Audio playback finished');
        };
    })
    .catch(e => {
        console.error('Error fetching or playing audio:', e);
    });
}

// let mediaRecorder;
// let audioChunks = [];

// document.getElementById('recordButton').addEventListener('click', function() {
//     let recordButton = this;
//     let isRecording = recordButton.getAttribute('data-recording') === 'true';

//     if (!isRecording) {
//         // Start recording
//         recordButton.style.backgroundColor = 'red';
//         recordButton.setAttribute('data-recording', 'true');
//         startRecording();
//     } else {
//         // Stop recording
//         recordButton.style.backgroundColor = 'limegreen';
//         recordButton.setAttribute('data-recording', 'false');
//         stopRecording();
//     }
// });

// function startRecording() {
//     navigator.mediaDevices.getUserMedia({ audio: true })
//         .then(stream => {
//             mediaRecorder = new MediaRecorder(stream);
//             mediaRecorder.ondataavailable = event => {
//                 audioChunks.push(event.data);
//             };
//             mediaRecorder.onstop = () => {
//                 const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//                 const formData = new FormData();
//                 formData.append('audio_data', audioBlob, 'recording.wav');
                
//                 fetch('/upload', {
//                     method: 'POST',
//                     body: formData
//                 }).then(response => response.text())
//                   .then(data => {
//                     document.getElementById('transcription').innerText = data;
//                 });
//             };
//             mediaRecorder.start();
//         })
//         .catch(e => console.error(e));
// }

// function stopRecording() {
//     mediaRecorder.stop();
//     // Clear the chunks for next recording
//     audioChunks = [];
//     mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
//         const formData = new FormData();
//         // We only append the audio data here, not the filename
//         formData.append('audio_data', audioBlob);

//         // Send the audio data to the server
//         fetch('/upload', {
//             method: 'POST',
//             body: formData
//         }).then(response => response.text())
//           .then(data => {
//             document.getElementById('transcription').innerText = data;
//         });
//     };
// }
