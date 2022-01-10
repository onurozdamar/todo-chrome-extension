const button = document.querySelector("#my-popup-button");
const input = document.querySelector("#note-input");

button.addEventListener("click", () => {
  chrome.runtime.sendMessage(
    {
      message: "add_note",
      payload: input.value,
    },
    (response) => {
      if (response.message === "success") {
        console.log("başarıyla eklendi");
        input.value = "";
      }
    }
  );
});
