let history = []; // Store modified elements for undo

// Change cursor based on mode
document.addEventListener("mousemove", () => {
    chrome.storage.local.get("mode", (data) => {
        let mode = data.mode || "highlight";
        document.body.style.cursor = mode === "blur" ? "crosshair" : "text";
    });
});

document.addEventListener("mouseup", () => {
    chrome.storage.local.get("mode", (data) => {
        let mode = data.mode;
        if (!mode) return; // Prevent issues if no mode is set

        let selection = window.getSelection();
        if (!selection.rangeCount || !selection.toString().trim()) return;

        let range = selection.getRangeAt(0);
        let span = document.createElement("span");
        span.classList.add("modified-text");

        if (mode === "highlight") {
            span.style.backgroundColor = "yellow";
            span.style.color = "black";
        } else if (mode === "blur") {
            span.style.filter = "blur(5px)";
            span.style.backgroundColor = "transparent"; 
            span.style.display = "inline"; // Ensures inline behavior
        }

        span.dataset.originalText = selection.toString();
        span.innerText = selection.toString();

        range.deleteContents();
        range.insertNode(span);

        history.push(span); // Store element for undo
    });
});

// Undo last change (CTRL+Z)
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z" && history.length > 0) { // CTRL+Z to undo
        let last = history.pop();
        if (last && last.parentNode) {
            let textNode = document.createTextNode(last.dataset.originalText);
            last.parentNode.replaceChild(textNode, last);
        }
    }
});
