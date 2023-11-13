window.customElements.define('zoom-cc',
  class SpeechToText extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.appendChild(this.style);
      shadowRoot.appendChild(this.content);

      this.recognition = undefined;
      this.transcribing = false;

      let startStopButton = this.shadowRoot.querySelector('#start-stop');
      startStopButton.onclick = (event) => {
        if (this.transcribing) {
          this.stop();
        } else {
          this.start();
        }
      }
    }

    get style() {
      let style = document.createElement('style');
      style.innerHTML = `
        .stop{ 
          background-color: red;
        }

        button {
          font-weight: bold;
          background-color: #ccc;
          padding: 0.2em;
          border-radius: 5px;
        }

        #transcript-window {
          border: 1px solid #ccc;
          padding: 1em;
          margin-top: 1em;
          height: 300px;
          overflow-y: scroll;
        }
      `;
      return style;
    }

    get content() {
      let content = document.createElement('section');
      content.innerHTML = `
        <p><button id="start-stop">Start Transcription</button></p>
        <div id="transcript-window"></div> 
      `;
      return content;
    }

    start() {
      let startStopButton = this.shadowRoot.querySelector('#start-stop');
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (typeof SpeechRecognition === "undefined") {
        startStopButton.disabled = true;
        this.write(`This browser doesn't support the SpeechRecognition API.`);
      } else {
        startStopButton.innerHTML = 'Stop Transcription';
        startStopButton.classList.add('stop');

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.onresult = (event) => {
          const result = event.results[event.resultIndex][0].transcript;
          this.write(result);
        }
        this.recognition.onerror = (event) => {
          console.log(event);
        }
        this.recognition.onstart = (event) => {
          this.transcribing = true;
        }
        this.recognition.onend = (event) => {
          this.transcribing = false;
        }
        this.recognition.start();
      }
    }

    stop() {
      let startStopButton = this.shadowRoot.querySelector('#start-stop');
      startStopButton.innerHTML = 'Start Transcription';
      startStopButton.classList.remove('stop');
      this.recognition.stop();
    }

    write(message) {
      let transcriptWindow = this.shadowRoot.querySelector('#transcript-window');
      transcriptWindow.insertAdjacentHTML('beforeend', `<p>${message}</p>`);
    }
  }
);
