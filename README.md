# BOJ-extended <img align="right" src="icons/icon48.png"/>

[![build](https://github.com/joonas-yoon/boj-extended/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/joonas-yoon/boj-extended/actions/workflows/build.yml) [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/mfcaadoifdifdnigjmfbekjbhehibfel)](https://chrome.google.com/webstore/detail/boj-%ED%94%84%EB%A1%9C%ED%95%84-%EB%AC%B8%EC%A0%9C-%EB%B3%B4%EA%B8%B0/mfcaadoifdifdnigjmfbekjbhehibfel) ![Chrome 55+](https://img.shields.io/badge/chrome-55%2B-green?logo=googlechrome) ![Whale 1.4+](https://img.shields.io/badge/whale-1.4%2B-green?logo=googlechrome) ![Safari 14.0](https://img.shields.io/badge/safari-14.0+%20partial-orange?logo=safari) ![FireFox 91.0.2](https://img.shields.io/badge/firefox-91.0.2%20partial-orange?logo=firefox)

[![Chrome Web Store](https://storage.googleapis.com/chrome-gcs-uploader.appspot.com/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png)](https://chrome.google.com/webstore/detail/boj-%ED%94%84%EB%A1%9C%ED%95%84-%EB%AC%B8%EC%A0%9C-%EB%B3%B4%EA%B8%B0/mfcaadoifdifdnigjmfbekjbhehibfel) [![Naver Whale Store](docs/images/whalestore-sm.png)](https://store.whale.naver.com/detail/epdpeloboklojnaelckeihkghcgebhnp)

## 미리 보기

|                    **유저 페이지**                     |                      **어두운 테마**                      |
| :----------------------------------------------------: | :-------------------------------------------------------: |
|   [![User Page](docs/images/screenshot-user.png)][1]   | [![Dark Theme](docs/images/screenshot-theme-dark.png)][2] |
|                     **채점 현황**                      |                       **넓게 보기**                       |
| [![Status Page](docs/images/screenshot-status.png)][3] |   [![Wide Screen](docs/images/screenshot-wide.png)][4]    |
|                    **문제 타이머**                     |                      **문제 타이머**                      |
|    [![Timer](docs/images/screenshot-timer2.png)][5]    |   [![Timer List](docs/images/screenshot-timer.png)][6]    |
|                        **설정**                        |                        **유저 VS**                        |
|   [![Option](docs/images/screenshot-option.png)][7]    |         [![VS](docs/images/screenshot-vs.png)][8]         |
|                        **그룹**                        |                                                           |
| [![Groups](docs/images/screenshot-group-list.png)][9]  |                                                           |

## 설치 및 사용

Google Chrome과 Naver Whale의 경우, 웹 스토어에서 최신 버전을 설치할 수 있습니다.

직접 설치하는 경우에는 브라우저마다 다르니, 각 브라우저의 설정에서 확인하시길 바랍니다.

**Chrome에서 직접 설치하기**

- [How to Install Extensions From Outside the Chrome Web Store](https://www.howtogeek.com/120743/how-to-install-extensions-from-outside-the-chrome-web-store/)

**Safari에서 직접 설치하기**

1. '개발자용' 메뉴에서 '서명되지 않은 확장프로그램 허용' 옵션 체크  
   (개발자용 메뉴 활성화: 환경설정 - 고급 - 메뉴 막대에서 개발자용 메뉴 보기)
2. extension.dmg 파일을 다운 받아 실행 후 boj extension을 애플리케이션 폴더로 복사 및 실행  
   (애플리케이션 폴더 내부로 복사한 파일을 실행해야 합니다.)
3. 사파리 확장프로그램 설정에 추가된 BOJ extension 체크
4. [백준 온라인 저지 사이트](https://www.acmicpc.net)에 접속 후 주소창 왼쪽에 나타난 BOJ extension 클릭 후 '이 웹페이지에서 항상 허용' 선택

## 업데이트 내역

[▶ 자세히 보기](UPDATENOTE.md)

## 직접 수정 및 빌드

### Requirement

`npm`을 위해서 `node.js`가 필요합니다.

```bash
npm install
```

### Build

```bash
npm run build
```

위 커맨드를 입력하면, 아래`js/` 하위의 자바스크립트 파일들이 트랜스컴파일되어 `js/build/`에 생성됩니다.

- `js/*.js` -> `js/build/*.js`
- `options/*.js` -> `options/build/*.js`

빌드된 스크립트를 사용하고 싶다면, `manifest.json`에서 변경해주셔야합니다.

```
"js": [
  "js/config.js",  // -> "js/build/config.js"
  "js/utils.js",   // -> "js/build/utils.js",
  "js/theme.js",   // -> "js/build/theme.js",
  "js/wide.js",    // -> "js/build/wide.js",
  "js/db.js"       // -> "js/build/db.js"
]
```

### Lint

다음 커맨드로 코딩 컨벤션을 맞출 수 있습니다.

```bash
npm run lint
```

## License

[BOJ-extended](https://github.com/joonas-yoon/boj-extended/) are released under [MIT license](https://github.com/joonas-yoon/boj-extended/blob/master/LICENSE).

[1]: https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/docs/images/screenshot-user.png
[2]: https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/docs/images/screenshot-theme-dark.png
[3]: https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/docs/images/screenshot-status.png
[4]: https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/docs/images/screenshot-wide.png
[5]: https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/docs/images/screenshot-timer2.png
[6]: https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/docs/images/screenshot-timer.png
[7]: https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/docs/images/screenshot-option.png
[8]: https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/docs/images/screenshot-vs.png
[9]: https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/docs/images/screenshot-group-list.png
