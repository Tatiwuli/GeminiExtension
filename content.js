
// Locate the AI response
let chatLabels = {}
let currentChatId = null

function getChatId() {
  return window.location.pathname
}
function initializeHiderButton() {
     const MESSAGE_SELECTOR = "message-content.model-response-text"


     const aiResponses= document.querySelectorAll(MESSAGE_SELECTOR)

     if (aiResponses.length ===0) {
          console.log("AI Responses not found")
     }

     aiResponses.forEach((response) => {
       const responseContainer = response.closest(".response-content")
       if (!responseContainer) {
         console.log("AI Response container not found")
         return
       }

       responseContainer.classList.add("gext-response-content")

       // Check if we've already added our UI to this container
       if (responseContainer.querySelector(".gext-hider-btn")) return

     
        const messageId = response.id
        if (!messageId) return

       const hideButton = document.createElement("div")
       hideButton.className = "gext-hider-btn"
       hideButton.addEventListener("click", () => {
         // if user clicks and message is NOT hidden
         if (!responseContainer.classList.contains("gext-message-is-hidden")) {
           const gifOverlay = document.createElement("img")
           gifOverlay.src =
             chrome.runtime.getURL("images/hiding-animation.gif") +
             "?t=" +
             new Date().getTime() // assign an unique "id" to re-render the gif
           gifOverlay.className = "gext-hider-btn-gif-overlay"
           hideButton.appendChild(gifOverlay)
           setTimeout(() => {
             responseContainer.classList.add("gext-message-is-hidden")
             gifOverlay.remove()
           }, 1500)
         } else {
           //if button is in show state: the message is hidden
           // render the hide button state
           responseContainer.classList.remove("gext-message-is-hidden")
         }
       })

       responseContainer.appendChild(hideButton)
     })
}
function loadInitialData() {
  const newChatId = getChatId()

  currentChatId = newChatId

  chrome.storage.local.get([newChatId], (result) => {
    chatLabels = result[newChatId] || {}

    initializeHiderButton()
  })
}

const observer = new MutationObserver(() => {
//   const newChatId = getChatId() // Check if the URL has changed (i.e., user navigated to a new chat)

//   if (newChatId !== currentChatId) {
//     loadInitialData() // If so, reset cache and re-initialize
//   } else {
//     initializeHiderButton() // Otherwise, just process new elements
//   }
     initializeHiderButton();
})

observer.observe(document.body, { childList: true, subtree: true })

// loadInitialData()

