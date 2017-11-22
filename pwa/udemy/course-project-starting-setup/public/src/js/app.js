if ("serviceWorker" in navigator) {
  // navigator.serviceWorker.register("/sw.js", { scope: "/help/" }).then(function() {
  navigator.serviceWorker.register("/sw.js").then(function() {
    console.log("Service worker registered.");
  })
  .catch(function() {
    console.log("Service worker registration failed.");
  });
}

var deferredPrompt;

/*
window.addEventListener("beforeinstallprompt", function(evt) {
  console.log("beforeinstallprompt");
  evt.preventDefault(); 
  deferredPrompt = evt;
  return false;
});
*/

