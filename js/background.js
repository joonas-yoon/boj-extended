chrome.runtime.onMessage.addListener(function (message) {
  switch (message.action) {
    case 'openSettingPage':
      openSettingPage();
      break;
    default:
      break;
  }
});

function openSettingPage() {
  chrome.runtime.openOptionsPage();
}
