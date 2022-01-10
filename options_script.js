const notesContainer = document.querySelector("#notes-container");

chrome.runtime.sendMessage(
  {
    message: "get_notes",
  },
  (response) => {
    if (response.message === "success") {
      console.log("geliyor", response.payload);

      response.payload.forEach((noteItem) => {
        let noteContainer = document.createElement("div");
        noteContainer.setAttribute("class", "note-container");

        let noteCheckbox = document.createElement("input");
        noteCheckbox.setAttribute("id", noteItem.id);
        noteCheckbox.setAttribute("class", "note-checkbox");
        noteCheckbox.setAttribute("type", "checkbox");
        noteCheckbox.checked = noteItem.isCompleted;

        let noteText = document.createElement("div");
        noteText.setAttribute("class", "note-text");
        noteText.appendChild(document.createTextNode(noteItem.note));

        noteContainer.appendChild(noteText);
        noteContainer.appendChild(noteCheckbox);

        notesContainer.appendChild(noteContainer);
      });
    }
  }
);

window.addEventListener("click", (e) => {
  if (e.target.className === "note-checkbox") {
    chrome.runtime.sendMessage(
      {
        message: "update_note",
        payload: { id: e.target.id, isCompleted: e.target.checked },
      },
      (response) => {
        if (response.message === "success") {
          console.log("başarılı");
        }
      }
    );
  }
});
