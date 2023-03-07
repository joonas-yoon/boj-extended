(function extendCompile() {
  const url = window.location.pathname;

  if (!url.startsWith('/submit/')) {
    return;
  }

  console.log('Ready to compile');

  const submitButton = document.getElementById('submit_button');
  const compileButton = createCompileButton();
  submitButton.parentNode.appendChild(compileButton);

  function createCompileButton() {
    const button = Utils.createElement('button', {
      type: 'button',
      class: 'btn',
      style: 'margin-left: 5px',
    });
    const staticTextarea = document.querySelector('textarea#source');
    const dynamicTextarea = document.querySelector('.CodeMirror textarea');
    dynamicTextarea.value = staticTextarea.value;
    button.textContent = '컴파일';
    button.addEventListener('click', (evt) => {
      evt.preventDefault();
      const codeLines = document.querySelectorAll(
        '.CodeMirror-code .CodeMirror-line[role="presentation"]'
      );
      const sourceCodeText = Array.from(codeLines)
        .map((e) => e.textContent)
        .join('\n');
      const result = compile(sourceCodeText || '');
      window.alert('컴파일 결과: ' + result);
    });
    return button;
  }

  function compile(text) {
    // TODO: implement
    console.log('Start compile:', text);
    return 'Good';
  }
})();
