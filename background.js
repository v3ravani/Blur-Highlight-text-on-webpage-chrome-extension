chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ mode: null });
});
