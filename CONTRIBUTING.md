# 기여를 위한 개발 가이드라인

먼저 이 문서를 읽어주셔서 감사합니다. 프로젝트에 어떠한 방식으로든 기여에 대한 관심을 보여주셔서 감사합니다.

이 프로젝트는 무척 유연하게 관리되고 있으니 두려워하실 필요가 없습니다!

다만, 아래의 내용을 먼저 읽고 작업을 시작하시는 것을 추천합니다 :)

## 개발 브랜치

개발용 브랜치는 `dev` 입니다.

먼저 `git checkout dev` 커맨드를 실행해서, 개발용 브랜치에서 작업을 진행해주세요.

작성해주신 Pull Request는 결국에 `dev` 브랜치로 합쳐지기 때문에, `main` 브랜치에서 fork 하신다면 해결하기 어려운 충돌이 많을 수 있습니다.

## Requirement

이 프로젝트는 빌드와 포맷을 위해 `npm` 커맨드를 사용합니다.

```bash
npm install
```

## Build

> Windows OS의 경우, [Git Bash](https://git-scm.com/downloads) 환경에서 실행하는 것을 권장합니다.

```bash
npm run build
```

실제로 배포되었을 때, 확장 프로그램이 정상적으로 동작하는 지 확인하고 싶으시다면, 위 커맨드로 프로젝트를 빌드해주세요. 빌드된 코드는 `dist/` 에 생성됩니다.

★ `dist/` 디렉토리는 커밋에 포함하지 말아주세요!

## Run

Chrome에 "확장 프로그램 - 개발자 모드 - `압축해제된 확장 프로그램을 로드합니다.`"를 클릭한 후, `dist/` 폴더를 지정하여 로드할 수 있습니다.

> `dist/` 디렉토리는 자동으로 빌드되므로 git 변경 내용에서 제외해주세요.

## Lint + Format

> `push` 전에 이 커맨드를 실행하는 것을 권장합니다.

아래 커맨드를 실행하셔서 문법 오류를 수정하고, 코드 스타일을 맞출 수 있습니다.

```bash
npm run lint:fix
```

# Directory Structure

크롬 확장 프로그램을 위한 파일 구조는 아래와 같습니다.

```bash
📁src/
├── 📁css       # css
├── 📁icons     # icons
├── 📁js        # javascript files
├── 📁options   # for option page
├── manifest.json
├── rules.json
```

실제 배포되는 파일의 구조 (`dist/`)도 위와 같습니다.

# Ready to merge!

축하합니다 🎉 이제 Pull Request를 push 할 준비가 모두 끝났습니다! ✨.

더 나아진 확장 프로그램을 만드는 데에 동참해주셔서 감사합니다!
