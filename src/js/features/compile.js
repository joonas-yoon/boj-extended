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
  Text: 'unsupported',
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
  'Objective-C++': 'unsupported',
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
  'Assembly (32bit)': 'unsupported',
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
  Rhino: 'unsupported',
  Cobol: 'cobol-gnu',
  Pike: 'pike',
  sed: 'sed-gnu',
  INTERCAL: 'intercal',
  bc: 'bc',
  'Algol 68': 'algol68g',
  Befunge: 'befunge',
  FreeBASIC: 'unsupported',
  Haxe: 'haxe',
  LOLCODE: 'lolcode',
  아희: 'unsupported',
  SystemVerilog: 'unsupported',
};

function extendCompile() {
  const url = window.location.pathname;

  if (!url.startsWith('/submit/')) {
    return;
  }

  // prepare button and result
  const submitButton = document.getElementById('submit_button');
  const formGroup = submitButton.closest('.form-group');
  const resultWrapper = Utils.createElement('div', {
    class: 'col-md-offset-2 col-md-10',
    style: 'margin-top: 1em',
  });
  const resultPreBox = Utils.createElement('pre', {
    style: 'display: none',
  });
  resultWrapper.appendChild(resultPreBox);
  formGroup.appendChild(resultWrapper);

  // working code to compile
  console.log('Ready to compile');
  fetchExamples().then((testCases) => {
    console.log('testCases', testCases);
    const compileButton = createCompileButton({
      testCaseSamples: testCases,
      whenCompileRequested: () => {
        resultPreBox.style.display = 'block';
        resultPreBox.innerText = '';
      },
      whenCompileDone: ({ tc, isPassed, stderr }) => {
        resultPreBox.innerText += `테스트케이스 #${tc}`;
        if (isPassed) {
          resultPreBox.innerText += ' ✅\n';
        } else {
          resultPreBox.innerText += ' ❌\n';
        }
        resultPreBox.innerText += stderr + '\n---------------------------\n\n';
      },
    });
    submitButton.parentNode.appendChild(compileButton);
  });

  function createCompileButton({
    testCaseSamples,
    whenCompileRequested,
    whenCompileDone,
  }) {
    const button = Utils.createElement('button', {
      type: 'button',
      class: 'btn',
      style: 'margin-left: 5px',
    });
    button.textContent = '컴파일 (beta)';
    button.addEventListener('click', async (evt) => {
      evt.preventDefault();
      whenCompileRequested();
      for (let i = 0; i < testCaseSamples.length; i++) {
        const { tc, input, output: answer } = testCaseSamples[i];
        compile(input)
          .then(({ stdout, stderr }) => {
            const isPassed = answer.trim() == stdout.trim();
            whenCompileDone({ tc, isPassed, stderr });
          })
          .catch((error) => console.error(error));
      }
    });
    return button;
  }

  function fetchExamples() {
    return new Promise((resolve, reject) => {
      const currentProblemId = window.location.pathname.split('/')[2];
      if (currentProblemId === undefined) {
        reject(new Error('could not find problem id'));
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

          resolve(testCases);

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
      if (!compileLanguage || compileLanguage === 'unsupported') {
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
