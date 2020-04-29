const clearStorageButton = document.querySelector('.clear');
const emptyStorageButton = document.querySelector('.empty');
const storageQuotaMsg = document.getElementById('storage-quota-msg');
const saveTextButton = document.getElementById('save-text');
const fileDownloadButton = document.getElementById('save');
const textField = document.querySelector('[name=text]');

function sessionStorageToFile() {
  const csv = JSON.stringify(sessionStorage['autosave']);
  console.log(csv);
  const csvAsBlob = new Blob([csv], { type: 'text/plain' });
  const fileNameToSaveAs = 'session-storage.txt';
  const downloadLink = document.getElementById('save');
  downloadLink.download = fileNameToSaveAs;

  if (window.URL !== null) {
    downloadLink.href = window.URL.createObjectURL(csvAsBlob);
    downloadLink.target = '_blank';
  } else {
    downloadLink.window.URL.createObjectURL(csvAsBlob);
    downloadLink.target = '_blank';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink.download);
  }
}

function sessionStorageSupport() {
  return typeof Storage !== 'undefined';
}

function sessionStorageAndQuota() {
  let myStory = document.getElementById('textArea').value;
  if (!sessionStorageSupport) {
    storageQuotaMsg.innerHTML = 'Sorry. No HTML5 session storage support here.';
  } else {
    try {
      if (sessionStorage.getItem('autosave', myStory)) {
        
        myStory = sessionStorage.getItem('autosave', myStory);
      } else {
        sessionStorage.setItem('autosave', myStory);
      }
    } catch (domException) {
      domException = new DOMException();
      console.log(domException.name);
      if (
        domException.name === 'QUOTA_EXCEEDED_ERR' ||
        domException.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      ) {
        storageQuotaMsg.innerHTML = 'Session Storage Quota Exceeded!';
      }
    }
  }
}

function clearStorage() {
  const myStory = document.getElementById('textArea');
  myStory.value = '';
  sessionStorage.removeItem('autosave', myStory.value);
}

function emptyStorage() {
  const myStory = document.getElementById('textArea');
  myStory.value = '';
  sessionStorage.clear();
}

clearStorageButton.addEventListener('click', clearStorage);
emptyStorageButton.addEventListener('click', emptyStorage);
saveTextButton.addEventListener('click', function () {
  sessionStorageAndQuota();
  console.log('Message saved to sessionStorage.');
});
textField.addEventListener('input', () => {
  sessionStorage.setItem('autosave', textField.value);
});
fileDownloadButton.addEventListener('click', sessionStorageToFile);