(async function extendCompile() {
  const url = window.location.pathname;

  if (!url.startsWith('/submit/')) {
    return;
  }

  console.log('Ready to compile');

  const submitButton = document.getElementById('submit_button');
  const compileButton = await createCompileButton();
  const compileDropdown = await createCompileDropdown();
  submitButton.parentNode.appendChild(compileButton);

  async function createCompileButton() {
    const button = Utils.createElement('button', {
      type: 'button',
      class: 'btn',
      style: 'margin-left: 5px',
    });
    const staticTextarea = document.querySelector('textarea#source');
    const dynamicTextarea = document.querySelector('.CodeMirror textarea');
    dynamicTextarea.value = staticTextarea.value;
    button.textContent = '컴파일';
    await button.addEventListener('click', (evt) => {
      evt.preventDefault();
      const codeLines = document.querySelectorAll(
        '.CodeMirror-code .CodeMirror-line[role="presentation"]'
      );
      const sourceCodeText = Array.from(codeLines)
        .map((e) => e.textContent)
        .join('\n');
      const input = '12 3'; // TODO: 입력값 받아오기
      buttonClick(input, sourceCodeText);
    });
    return button;
  }

  async function buttonClick(input, code) {
    const result = await compile(code, input);

    await alert(result[0] + '\n' + result[1]);
  }

  async function compile(code, input) {
    // eslint-disable-next-line camelcase
    const lang_json = {
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
    const lang =
      lang_json[
        document.getElementsByClassName('chosen-single')[0].textContent.trim()
      ];
    if(lang === 'unsupported') {
      result = ['ERR', '지원하지 않는 언어입니다.'];
      return result;
    }

    code = code.replace(
      // eslint-disable-next-line no-control-regex
      /[\u000d\u0020\u0085\u1680\u2000-\u200a\u2029\u202f\u205f\u3000]+/g,
      ' '
    );

    let result;

    await TIO.run(code, input, lang).then((n) => (result = n));

    return result;
  }

  function createCompileDropdown() {
    // TODO : 컴파일 버튼 누르면 나오는 드롭다운 메뉴
  }
})();
