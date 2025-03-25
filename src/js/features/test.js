const TIO_LANGUAGES_MAP = {
  'C++17': 'cpp-gcc',
  'Java 8': 'java-jdk',
  'Python 3': 'python3-cython',
  C11: 'c-gcc',
  PyPy3: 'python3-pypy',
  C99: 'c-gcc',
  'C++98': 'cpp-gcc',
  'C++11': 'cpp-gcc',
  'C++14': 'cpp-gcc',
  'Java 8 (OpenJDK)': 'java-openjdk',
  'Java 11': 'java-jdk',
  'C++20': 'cpp-gcc',
  Ruby: 'ruby',
  'Kotlin (JVM)': 'kotlin',
  Swift: 'swift4',
  Text: undefined,
  'C#': 'cs-core',
  'node.js': 'javascript-node',
  Go: 'go',
  'Go (gccgo)': 'go',
  'Java 15': 'java-jdk',
  D: 'd',
  'D (LDC)': 'd',
  PHP: 'php',
  'Rust 2015': 'rust',
  'Rust 2018': 'rust',
  'Rust 2021': 'rust',
  Pascal: 'pascal-fpc',
  Scala: 'scala',
  Lua: 'lua',
  Perl: 'perl5',
  'F#': 'fs-core',
  'Visual Basic': 'vb-core',
  'Objective-C': 'objective-c-gcc',
  'Objective-C++': undefined,
  'C99 (Clang)': 'c-clang',
  'C++98 (Clang)': 'cpp-clang',
  'C++11 (Clang)': 'cpp-clang',
  'C++14 (Clang)': 'cpp-clang',
  'C11 (Clang)': 'c-clang',
  'C++17 (Clang)': 'cpp-clang',
  'C++20 (Clang)': 'cpp-clang',
  Golfscript: 'golfscript',
  C90: 'c-gcc',
  C2x: 'c-gcc',
  'C90 (Clang)': 'c-clang',
  'C2x (Clang)': 'c-clang',
  TypeScript: 'typescript',
  'Assembly (32bit)': undefined,
  'Assembly (64bit)': 'assembly-nasm',
  Bash: 'bash',
  Fortran: 'fortran-gfortran',
  Scheme: 'scheme-chez',
  Ada: 'ada-gnat',
  awk: 'awk',
  OCaml: 'ocaml',
  'Brainf**k': 'brainfuck',
  Whitespace: 'whitespace',
  Tcl: 'tcl',
  Rhino: undefined,
  Cobol: 'cobol-gnu',
  Pike: 'pike',
  sed: 'sed-gnu',
  INTERCAL: 'intercal',
  bc: 'bc',
  'Algol 68': 'algol68g',
  Befunge: 'befunge',
  FreeBASIC: undefined,
  Haxe: 'haxe',
  LOLCODE: 'lolcode',
  아희: undefined,
  SystemVerilog: undefined,
};

function extendTest() {
  const url = window.location.pathname;

  if (!url.startsWith('/submit/')) {
    return;
  }

  // prepare button and result
  const submitButton = document.getElementById('submit_button');
  const formGroup = submitButton.closest('.form-group');
  const resultWrapper = Utils.createElement('div', {
    id: 'testExampleResults',
    class: 'col-md-offset-2 col-md-10',
    style: 'margin-top: 1em',
  });
  const resultPanels = Utils.createElement('div', {
    class: 'panel panel-default',
  });
  const infoMessage = createInfoMessage();
  infoMessage.style.display = 'none';
  resultWrapper.appendChild(infoMessage);
  resultWrapper.appendChild(resultPanels);
  formGroup.appendChild(resultWrapper);

  const tcController = {};
  const testButton = Utils.createElement('button', {
    type: 'button',
    class: 'btn btn-warning',
    style: 'margin-left: 1rem',
  });
  testButton.textContent = '테스트 (beta)';
  testButton.addEventListener('click', async (evt) => {
    evt.preventDefault();
    console.log('Click to compile and test');
    // display info message
    infoMessage.style.display = 'block';
    // initialize and fetch problem examples
    if (resultPanels.childElementCount === 0) {
      fetchExamples()
        .then((testCases) => {
          console.log('testCases', testCases);
          for (const { tc, input, output } of testCases) {
            const { head, body, foot } = createTestResultBox(`#${tc}`);
            // append to document
            resultPanels.appendChild(head);
            resultPanels.appendChild(body);
            resultPanels.appendChild(foot);
            tcController[tc] = { head, body, foot, input, output };
          }
        })
        .then(runTestAll)
        .catch(({ message }) => {
          const element = document.createElement('pre');
          element.textContent = message;
          resultWrapper.innerHTML = '';
          resultWrapper.appendChild(element);
        });
    } else {
      // ui is ready
      runTestAll();
    }
  });
  submitButton.parentNode.appendChild(testButton);

  function createTestResultBox(title) {
    const head = Utils.createElement('div', {
      class: 'panel-heading',
    });
    head.textContent = title;
    const body = Utils.createElement('pre', {
      class: 'panel-body',
    });
    const foot = Utils.createElement('pre', {
      class: 'panel-body metadata',
    });
    return { head, body, foot };
  }

  function runTestAll() {
    for (const key of Object.keys(tcController)) {
      const { head, body, foot, input, output } = tcController[key];
      // update ui
      head.setAttribute('data-result', '');
      // set values
      body.innerText = '';
      foot.innerText = 'Running...';
      compile(input)
        .then(({ stdout, stderr }) => {
          const sameOutput = output.trim() == stdout.trim();
          const usageDelimIdx = stderr.indexOf('\nReal time:');
          const metaInfos = stderr.slice(usageDelimIdx).trim().split('\n');
          const errContent = stderr.slice(0, usageDelimIdx).trim();
          const isReturnOk = stderr.indexOf('Exit code: 0') !== -1;

          let isPassed = 'Pass';
          // set values
          if (stdout && errContent) {
            // code works but warnings
            body.innerText = `stdout:\n${stdout}\n\nstderr:\n${errContent}`;
            isPassed = sameOutput ? 'Warning' : 'Fail';
          } else if (errContent) {
            // compile or runtime error
            body.innerText = `stderr:\n${errContent}`;
            isPassed = 'Fail';
          } else if (!sameOutput) {
            // run but WA
            body.innerText = `your answer:\n${stdout}\n\nbut expected:\n${output}`;
            isPassed = 'Fail';
          } else if (!isReturnOk) {
            body.innerText = 'Process returned non-zero exit code';
            isPassed = 'Fail';
          }
          foot.innerText = metaInfos.join(' / ');

          // set result emoji
          let resultEmoji;
          if (isPassed === 'Pass') {
            resultEmoji = '✅';
          } else if (isPassed === 'Warning') {
            resultEmoji = '⚠️';
          } else {
            resultEmoji = '❌';
          }

          // update ui
          head.setAttribute('data-result', resultEmoji);
        })
        .catch((error) => console.error(error));
    }
  }

  function fetchExamples() {
    return new Promise((resolve, reject) => {
      const currentProblemId = window.location.pathname.split('/')[2];
      if (currentProblemId === undefined) {
        reject(new Error('Could not find problem id'));
        return;
      }
      fetch(`https://www.acmicpc.net/problem/${currentProblemId}`, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      })
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const MAX_TC_COUNT = 5;
          const testCases = [];
          for (let tc = 1; tc <= MAX_TC_COUNT; ++tc) {
            const input = parseTestSampleById('sample-input-' + tc);
            const output = parseTestSampleById('sample-output-' + tc);
            if (input || output) {
              testCases.push({ tc, input, output });
            }
          }

          if (!testCases || testCases.length === 0) {
            reject(new Error('No example to test'));
          } else {
            resolve(testCases);
          }

          function parseTestSampleById(id) {
            const pre = doc.getElementById(id);
            if (pre) {
              return pre.innerText;
            }
            return undefined;
          }
        })
        .catch(resolve);
    });
  }

  function createInfoMessage() {
    const div = document.createElement('div');
    div.className = 'alert alert-info';
    div.innerHTML =
      '사용되는 <a href="https://tio.run/" target="_blank">테스트 환경</a>은 <a href="https://help.acmicpc.net/language/info" target="_blank">채점 환경</a>과 다르므로 채점 결과를 보장하지 않는 점 유의하시길 바랍니다.</div>';
    return div;
  }

  async function compile(input) {
    // get source to compile
    const codeLines = document.querySelectorAll(
      '.CodeMirror-code .CodeMirror-line[role="presentation"]'
    );

    const unexpectedUnicodes =
      // eslint-disable-next-line no-control-regex
      /[\u0000-\u001F\u007F-\u009F\u00A0\u1680\u2000-\u200F\u2028-\u202F\u205F\u3000\uFEFF]+/g;

    const submitCode = Array.from(codeLines)
      .map((e) => e.textContent.replace(unexpectedUnicodes, ''))
      .join('\n');

    // get language to compile
    const userSelectedLangForm = document
      .getElementById('language_chosen')
      .getElementsByClassName('chosen-single')[0];
    let compileLanguage;
    if (!userSelectedLangForm) {
      console.error('Can not found DOM Element #language_chosen');
      return {
        stdout: '',
        stderr: '페이지에 문제가 발생했습니다. 새로고침 후 다시 시도해주세요.',
      };
    } else {
      const selectedLang = userSelectedLangForm.textContent.trim();
      compileLanguage = TIO_LANGUAGES_MAP[selectedLang];
      if (!compileLanguage || compileLanguage === undefined) {
        return {
          stdout: '',
          stderr: '지원하지 않는 언어입니다.',
        };
      }
    }

    const [stdout, stderr] = await TIO.run(submitCode, input, compileLanguage);
    return {
      stdout,
      stderr,
    };
  }
}
