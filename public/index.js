// Triggered by Go button: encodes URL, updates iframe and URL hash (not susceptible to sql injection trust me bro)
function go() {
    //Show System Processing  
	window.location.href = "#dialog-swloading";
	  
	const connection = new BareMux.BareMuxConnection("/baremux/worker.js")
	const inputField = document.getElementById('address-input');
    let raw = inputField.value.trim();
    if (!raw) return;
		
	// ensure ServiceWorker is working like a serviceWORKER should do (bruh i got so frustrated when it didnt work) 
	try {
		registerSW();
		} catch (err) {
			error.textContent = "Failed to register service worker.";
			// errorCode.textContent = err.toString();
			throw err;
		}
		
	// Ensure URL scheme
	const url = raw.startsWith('http') ? raw : `https://${raw}`;
		
	let frame = document.getElementById("uv-frame");
		frame.style.display = "block";
		let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
		if (connection.getTransport() !== "/epoxy/index.mjs") {
			connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
		}
	const finalUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
	displayIframe(finalUrl);

    // Show loading
    showLoading();
    setStatus('Loading... (status kinda broken rn ^_^)');

    // Clear input
    inputField.value = '';
		
	window.location.href = "#dialog-no";
		
	// Sets iframe src
    function displayIframe(url) {
        document.getElementById('uv-frame').src = url;
    }
} // <--- Few! we exited the unreliable zone!

// When iFrame is finished loading
function onIframeLoad() {
	hideLoading();
	setStatus('Ready');
}
		
// Back Button
function goBack() {
	const fw = document.getElementById('uv-frame').contentWindow;
	fw.history.back();
}
		
// Forward Button
function goForward() {
	const fw = document.getElementById('uv-frame').contentWindow;
	fw.history.forward();
}
		
//Refresh Button
function refreshIframe() {
	const frame = document.getElementById('uv-frame');
	frame.contentWindow.location.reload();
}
		
// Show loading spinner
function showLoading() {
    document.getElementById('loading-img').style.display = 'block';
}

// Hide loading spinner
function hideLoading() {
    document.getElementById('loading-img').style.display = 'none';
}

// Update status text
function setStatus(text) {
    document.getElementById('status-text').textContent = text;
}
