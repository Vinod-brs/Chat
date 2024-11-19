
function setTheme(theme) {
    document.documentElement.style.setProperty('--primary-color', theme);
    localStorage.setItem('cc-theme', theme);
}

setTheme(localStorage.getItem('cc-theme') || '#1A4B84');

function loadScript() {
    let user = prompt("Please enter your name", "");
    console.log(user)
    if (!user) {
      document.getElementsByTagName('main')[0].innerHTML = 'Please ReLoad page and Enter Your Name';
    }
  
    var pubnub = new PubNub({
        publishKey: 'demo',
        subscribeKey: 'demo',
        userId: user
    })
  
    pubnub.subscribe({
        channels: ['ws-channel']
    })
  
    pubnub.addListener({
      message: payload => {
        let messageString = '';
        const isCurrentUserPublisher = user === payload.publisher;
        const msg_cls = isCurrentUserPublisher ? 'justify-content-md-end' : 'justify-content-md-start';
        if(isCurrentUserPublisher) {
          messageString =
          `
            <div class='row w-100 ${msg_cls} mb-2'>
              <div class="col-5 text-start sender-msg p-0">
                <div class='d-inline'>${payload.message}</div>
              </div>
              <div class="col-1 p-0">
                <div class='d-inline text-dark fw-bold'>${payload.publisher}</div>
              </div>
            </div>
          `
        } else {
          messageString =
          `
            <div class='row w-100 ${msg_cls} mb-2'>
              <div class="col-1 p-0">
                <div class='d-inline text-dark fw-bold'>${payload.publisher}</div>
              </div>
              <div class="col-5 text-start receiver-msg p-0">
                <div class='d-inline'>${payload.message}</div>
              </div>
            </div>
          `
        }
        document.getElementById('messages').innerHTML += messageString;
      }
    })
  
    function sendMessage(event) {
      var inputMessage = document.getElementById('message')
      if(inputMessage.value) {
        pubnub.publish({
          channel: 'ws-channel',
          message: inputMessage.value
        })
        inputMessage.value = ""
        event.preventDefault();
      }
      document.getElementById('message').focus();
    }
    document.getElementById('input-form').addEventListener('submit', sendMessage);
  }
  
  window.onload = loadScript;