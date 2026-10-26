let html5QrCode;
let isCameraRunning = false;

function switchTab(mode) {
    const cameraTab = document.getElementById('tab-camera');
    const fileTab = document.getElementById('tab-file');
    const cameraContainer = document.getElementById('camera-container');
    const fileContainer = document.getElementById('file-container');

    if (mode === 'camera') {
        cameraTab.className = "flex-1 py-3 text-center font-medium text-indigo-600 border-b-2 border-indigo-600 focus:outline-none transition";
        fileTab.className = "flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent focus:outline-none transition";
        cameraContainer.classList.remove('hidden');
        fileContainer.classList.add('hidden');
        startCamera();
    } else {
        fileTab.className = "flex-1 py-3 text-center font-medium text-indigo-600 border-b-2 border-indigo-600 focus:outline-none transition";
        cameraTab.className = "flex-1 py-3 text-center font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent focus:outline-none transition";
        fileContainer.classList.remove('hidden');
        cameraContainer.classList.add('hidden');
        stopCamera();
    }
}

function onScanSuccess(decodedText, decodedResult) {
    displayResult(decodedText);
}

function startCamera() {
    if (!isCameraRunning) {
        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            onScanSuccess
        ).then(() => {
            isCameraRunning = true;
        }).catch(err => {
            console.error("Camera start error: ", err);
        });
    }
}

function stopCamera() {
    if (html5QrCode && isCameraRunning) {
        html5QrCode.stop().then(() => {
            isCameraRunning = false;
        }).catch(err => {
            console.error("Camera stop error: ", err);
        });
    }
}

function decodeFile(e) {
    if (e.target.files.length === 0) return;
    const imageFile = e.target.files[0];
    
    const readerTemp = new Html5Qrcode("reader");
    readerTemp.scanFile(imageFile, true)
        .then(decodedText => {
            displayResult(decodedText);
        })
        .catch(err => {
            alert("Could not read QR code from this image. Please make sure the image contains a clear QR code.");
        });
}

function displayResult(text) {
    const resultSection = document.getElementById('result-section');
    const resultContent = document.getElementById('result-content');
    const resultActions = document.getElementById('result-actions');

    resultSection.classList.remove('hidden');
    resultContent.innerText = text;
    resultActions.innerHTML = '';

    // Smart action buttons based on content type
    if (text.startsWith('http://') || text.startsWith('https://')) {
        resultActions.innerHTML += `<a href="${text}" target="_blank" class="bg-indigo-600 text-white text-xs px-3 py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-1"><i class="fa-solid fa-external-link-alt"></i> Open Link</a>`;
    } else if (text.startsWith('tel:')) {
        resultActions.innerHTML += `<a href="${text}" class="bg-green-600 text-white text-xs px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-1"><i class="fa-solid fa-phone"></i> Call Number</a>`;
    } else if (text.startsWith('mailto:')) {
        resultActions.innerHTML += `<a href="${text}" class="bg-blue-600 text-white text-xs px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-1"><i class="fa-solid fa-envelope"></i> Send Email</a>`;
    } else if (text.startsWith('whatsapp:') || text.includes('wa.me')) {
        resultActions.innerHTML += `<a href="${text}" target="_blank" class="bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-1"><i class="fa-brands fa-whatsapp"></i> Open WhatsApp</a>`;
    } else {
        if (/^\+?[0-9\s\-\(\)]{7,15}$/.test(text)) {
            resultActions.innerHTML += `<a href="tel:${text}" class="bg-green-600 text-white text-xs px-3 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-1"><i class="fa-solid fa-phone"></i> Call</a>`;
        }
    }
}

function copyResult() {
    const text = document.getElementById('result-content').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    });
}

// Start camera on page load by default
window.onload = function() {
    startCamera();
};