document.getElementById("highlight").addEventListener("click", () => {
    chrome.storage.local.set({ mode: "highlight" });
});

document.getElementById("blur").addEventListener("click", () => {
    chrome.storage.local.set({ mode: "blur" });
});

document.getElementById("undo").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: undoLastChange
        });
    });
});

function undoLastChange() {
    if (window.history && window.history.length > 0) {
        let last = window.history.pop();
        if (last && last.parentNode) {
            let textNode = document.createTextNode(last.dataset.originalText);
            last.parentNode.replaceChild(textNode, last);
        }
    }
}
