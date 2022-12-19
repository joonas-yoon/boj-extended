const RTE_MSGS = [
  {
    langs: [],
    messages: {
      NZEC: 'Exit code가 0이 아님',
      BrokenPipe: '',
    },
  },
  {
    langs: [
      'C99',
      'C11',
      'C90',
      'C2x',
      'C++98',
      'C++11',
      'C++14',
      'C++17',
      'C++20',
    ],
    messages: {
      AssertionFailed: 'assert함수가 실패',
      Segfault: 'Segmentation fault',
      BusError: 'Bus error',
      InvalidPointer: 'munmap_chunk(): invalid pointer',
      OutOfBounds: '컨테이너 또는 배열에서 할당된 경계를 넘어가는 접근 발생',
      DivisionByZero: '0으로 나눔',
      FloatingPointException: '',
      WithoutReturning: 'void형이 아닌 함수가 리턴을 하지 않음',
      IntegerOverflow: '',
      DoubleFree: 'double free or corruption',
      MisalignedAddress: '',
      BufferOverflow: '',
      InsufficientSpace: '',
      NeverBeNull: '',
      InvalidNextSize: 'free(): invalid next size',
      MemoryCorruption: 'malloc(): memory corruption',
      CorruptedList: 'corrupted double-linked list',
      AccessNullPointer: '',
      AccessEmptyContainer: '',
      StoreToNullPointer: '',
      ShiftExponent: '',
      PastTheEndIterator: 'attempt to decrement a past-the-end iterator.',
      LoadOfNull: '',
      bad_alloc: 'std::bad_alloc',
      bad_array_new_length: 'std::bad_array_new_length',
      out_of_range: 'std::out_of_range',
      length_error: 'std::length_error',
    },
  },
  {
    langs: ['Python 3', 'PyPy3', 'Python 2', 'PyPy2'],
    messages: {
      ValueError: '',
      IndexError: '',
      NameError: '',
      TypeError: '',
      AssertionError: '',
      ImportError: '',
      FileNotFoundError: '',
      SyntaxError: '',
      EOFError: '',
      AttributeError: '',
      RecursionError: '',
      ZeroDivisionError: '',
      ModuleNotFoundError: '',
      UnboundLocalError: '',
      OverflowError: '',
      Error: '',
    },
  },
  {
    langs: ['Java 8', 'Java 8 (OpenJDK)', 'Java 11', 'Java 15', 'Kotlin (JVM)'],
    messages: {
      NoSuchElement: 'java.util.NoSuchElementException',
      InputMismatch: 'java.util.InputMismatchException',
      NumberFormat: 'java.lang.NumberFormatException',
      IndexOutOfBounds: 'java.lang.IndexOutOfBoundsException',
      ArrayIndexOutOfBounds: 'java.lang.ArrayIndexOutOfBoundsException',
      StringIndexOutOfBounds: 'java.lang.StringIndexOutOfBoundsException',
      '/ by zero': 'java.lang.ArithmeticException: / by zero',
      Arithmetic: 'java.lang.ArithmeticException',
      StackOverflow: 'java.lang.StackOverflowError',
      FileNotFound: 'java.io.FileNotFoundException',
      NullPointer: 'java.lang.NullPointerException',
      IO: 'java.io.IOException',
      IllegalArgument: 'java.lang.IllegalArgumentException',
      EmptyStack: 'java.util.EmptyStackException',
      IllegalFormat: 'java.util.IllegalFormatConversionException',
      AccessControl: 'java.security.AccessControlException',
      NegativeArraySize: 'java.lang.NegativeArraySizeException',
      IllegalState: 'java.lang.IllegalStateException',
      UnknownFormat: 'java.util.UnknownFormatConversionException',
      ConcurrentModification: 'java.util.ConcurrentModificationException',
      ClassCast: 'java.lang.ClassCastException',
      ArrayStore: 'java.lang.ArrayStoreException',
      Unsupported: 'java.lang.UnsupportedOperationException',
      Exception: '',
      'main class Main': 'Error: Could not find or load main class Main',
      'void main':
        'Error: Main method must return a value of type void in class Main, please\ndefine the main method as:\npublic static void main(String[] args)',
      'static main':
        'Error: Main method is not static in class Main, please define the main method as:\npublic static void main(String[] args)',
    },
  },
  {
    langs: ['Java 8', 'Java 8 (OpenJDK)', 'Java 11', 'Java 15'],
    messages: {
      'No main':
        'Error: Main method not found in class Main, please define the main method as:\npublic static void main(String[] args)',
    },
  },
  {
    langs: ['Kotlin (JVM)'],
    messages: {
      'No main': 'no main manifest attribute, in Main.jar',
    },
  },
  {
    langs: ['C# 9.0 (.NET)', 'F# (.NET)', 'Visual Basic (.NET)'],
    messages: {
      Format: 'System.FormatException',
      IndexOutOfRange: 'System.IndexOutOfRangeException',
      Argument: 'System.ArgumentException',
      ArgumentNull: 'System.ArgumentNullException',
      PlatformNotSupported: 'System.PlatformNotSupportedException',
      ArgumentOutOfRange: 'System.ArgumentOutOfRangeException',
      Overflow: 'System.OverflowException',
      InvalidOperation: 'System.InvalidOperationException',
      Segfault: 'System.NullReferenceException로 추정되나 확실하지 않음',
      Exception: '',
    },
  },
  {
    langs: ['node.js'],
    messages: {
      TypeError: '',
      ReferenceError: '',
      SyntaxError: '',
      StackSizeExceeded: 'RangeError: Maximum call stack size exceeded',
      RangeError: '',
      UnsupportedError: '',
      Error: '',
      AssertionFailed: '',
      CannotFindModule: 'Error: Cannot find module',
      ENOENT: 'Error: ENOENT: no such file or directory',
      EACCES: 'Error: EACCES: permission denied',
      ENOTDIR: 'Error: ENOTDIR: not a directory',
    },
  },
  {
    langs: ['Ruby 2.7', 'Ruby 1.8', 'Ruby 1.9', 'Golfscript'],
    messages: {
      NoMethodError: '',
      NameError: '',
      ArgumentError: '',
      TypeError: '',
      SystemStackError: '',
      LoadError: '',
      IOError: '',
      NoMemoryError: '',
      RuntimeError: '',
      SyntaxError: '',
      RangeError: '',
      FloatDomainError: '',
      EncodingError: '',
      Error: '',
      ENOENT: 'No such file or directory',
    },
  },
  {
    langs: ['Go', 'Go (gccgo)'],
    messages: {
      IndexOutOfRange: '',
      SliceBoundsOutOfRange: '',
      LenOutOfRange: '',
      CapOutOfRange: '',
      DivideByZero: '',
      PermissionDenied: '',
      Deadlock: '',
      NilMap: '',
      ValueOutOfRange: '',
      InvalidSyntax: '',
      ConcurrentMapWrites: '',
      EOF: '',
      InvalidNumber: '',
      ZeroValue: '',
      BufferCalledAfterScan: '',
      ENOENT: 'Error: no such file or directory',
      BufferFull: '',
      InterfaceConversion: '',
      Panic: '',
      Segfault: 'Segmentation fault',
    },
  },
];

(function () {
  function getLanguage(e) {
    const tr = e.closest('tr');
    const langElement = tr.children[6];
    if (langElement.firstChild.href) {
      return langElement.firstChild.innerText;
    } else {
      return langElement.innerText;
    }
  }

  function getReason(lang, type) {
    for (const msgs of RTE_MSGS) {
      const reason = msgs['messages'][type];
      if (reason) {
        console.log(reason, msgs['langs'], lang);
      }
      if (reason && msgs['langs'].indexOf(lang) !== -1) {
        return reason;
      }
    }
    return null;
  }

  const tooltip = document.createElement('div');
  tooltip.className = 'rte-tooltip';

  // add reason for rte message
  const rteMessages = document.getElementsByClassName('result-rte');
  Array.from(rteMessages).forEach((e, i) => {
    const x = e.innerText;
    const errorType = x.slice(x.indexOf('(') + 1, x.indexOf(')'));
    if (errorType) {
      console.group(x + ' - ' + i);
      const lang = getLanguage(e);
      const reason = getReason(lang, errorType);
      console.log(e);
      console.log('lang', lang);
      if (reason !== null) {
        console.log('reason', reason);
        e.setAttribute('data-reason', encodeURIComponent(reason));
        e.addEventListener('mouseover', () => {
          document.body.appendChild(tooltip);
          tooltip.style.display = 'inline-block';
          const { top, left } = e.getBoundingClientRect();
          const MARGIN = 10;
          tooltip.innerText = decodeURIComponent(e.getAttribute('data-reason'));
          tooltip.style.top =
            top - tooltip.offsetHeight + window.pageYOffset - MARGIN + 'px';
          tooltip.style.left = left + 'px';
        });
        e.addEventListener('mouseout', () => {
          setTimeout(() => {
            if (document.body.contains(tooltip)) {
              document.body.removeChild(tooltip);
            }
          }, 50);
        });
      }
      console.groupEnd();
    }
  });
})();
