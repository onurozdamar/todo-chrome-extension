var firstNote = {
  notes: [
    {
      id: 1,
      note: "ilk not",
      isCompleted: false,
    },
  ],
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    notes: JSON.stringify(firstNote),
  });
});

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
//     chrome.scripting
//       .executeScript({
//         target: { tabId: tabId },
//         files: ["./foreground.js"],
//       })
//       .then(() => {
//         console.log("injected foreground");
//       })
//       .catch((err) => console.log(err));
//   }
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "add_note") {
    chrome.storage.local.get("notes", (data) => {
      let previousNotes = {};

      if (chrome.runtime.lastError) {
        console.log("hata oldu");
        sendResponse({ message: "fail" });
        return;
      }
      try {
        previousNotes = JSON.parse(data.notes);
      } catch (error) {
        console.log("parse error");
        previousNotes = {};
      }

      previousNotes.notes.push({
        id: previousNotes.notes[previousNotes.notes.length - 1].id + 1,
        note: request.payload,
        isCompleted: false,
      });

      chrome.storage.local.set({
        notes: JSON.stringify(previousNotes),
      });
      sendResponse({ message: "success" });
    });

    return true;
  } else if (request.message === "get_notes") {
    chrome.storage.local.get("notes", (data) => {
      let previousNotes = {};

      if (chrome.runtime.lastError) {
        console.log("hata oldu");
        sendResponse({ message: "fail", payload: null });
        return;
      }
      try {
        previousNotes = JSON.parse(data.notes);
      } catch (error) {
        console.log("parse error");
        previousNotes = {};
      }

      sendResponse({ message: "success", payload: previousNotes.notes });
    });

    return true;
  } else if (request.message === "update_note") {
    chrome.storage.local.get("notes", (data) => {
      let previousNotes = {};

      if (chrome.runtime.lastError) {
        console.log("hata oldu");
        sendResponse({ message: "fail" });
        return;
      }
      try {
        previousNotes = JSON.parse(data.notes);
      } catch (error) {
        console.log("parse error");
        previousNotes = {};
      }

      var note = previousNotes.notes.find((e) => e.id == request.payload.id);
      note.isCompleted = request.payload.isCompleted;

      chrome.storage.local.set({
        notes: JSON.stringify(previousNotes),
      });

      sendResponse({ message: "success" });
    });

    return true;
  }
});
