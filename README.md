# BOJ-extended <img align="right" src="src/icons/icon48.png"/>

[![build](https://github.com/joonas-yoon/boj-extended/actions/workflows/build.yml/badge.svg?branch=release)](https://github.com/joonas-yoon/boj-extended/actions/workflows/build.yml) ![GitHub issues](https://img.shields.io/github/issues-raw/joonas-yoon/boj-extended) [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/mfcaadoifdifdnigjmfbekjbhehibfel)](https://chrome.google.com/webstore/detail/boj-%ED%94%84%EB%A1%9C%ED%95%84-%EB%AC%B8%EC%A0%9C-%EB%B3%B4%EA%B8%B0/mfcaadoifdifdnigjmfbekjbhehibfel) ![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/mfcaadoifdifdnigjmfbekjbhehibfel?label=users%40chrome) ![Chrome Web Store Rating Count](https://img.shields.io/chrome-web-store/rating-count/mfcaadoifdifdnigjmfbekjbhehibfel) ![Chrome Web Store Ratings](https://img.shields.io/chrome-web-store/rating/mfcaadoifdifdnigjmfbekjbhehibfel) ![GitHub all releases](https://img.shields.io/github/downloads/joonas-yoon/boj-extended/total)
![Chrome 55+](https://img.shields.io/badge/chrome-55%2B-green?logo=googlechrome) ![Whale 1.4+](https://img.shields.io/badge/whale-1.4%2B-green?logo=googlechrome) ![Safari 14.0](https://img.shields.io/badge/safari-14.0+%20partial%20%7C%20v1.5.3-orange?logo=safari) ![FireFox 91.0.2](https://img.shields.io/badge/firefox-91.0.2%20partial%20%7C%20v1.7.5.1-orange?logo=firefox) [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fjoonas-yoon%2Fboj-extended)](#)

[![Chrome Web Store](docs/images/chrome-web-store.png)](https://chrome.google.com/webstore/detail/boj-%ED%94%84%EB%A1%9C%ED%95%84-%EB%AC%B8%EC%A0%9C-%EB%B3%B4%EA%B8%B0/mfcaadoifdifdnigjmfbekjbhehibfel) [![Naver Whale Store](docs/images/whalestore-sm.png)](https://store.whale.naver.com/detail/epdpeloboklojnaelckeihkghcgebhnp) [![FireFox Add-ONS](docs/images/firefox-sm.png)](https://addons.mozilla.org/ko/firefox/addon/boj-extended/)

## 미리 보기

|                    **유저 페이지**                     |                      **어두운 테마**                      |
| :----------------------------------------------------: | :-------------------------------------------------------: |
|   [![User Page](docs/images/screenshot-user.png)][1]   | [![Dark Theme](docs/images/screenshot-theme-dark.png)][2] |
|                     **채점 현황**                      |                       **넓게 보기**                       |
| [![Status Page](docs/images/screenshot-status.png)][3] |   [![Wide Screen](docs/images/screenshot-wide.png)][4]    |
|                    **문제 타이머**                     |                      **문제 타이머**                      |
|    [![Timer](docs/images/screenshot-timer2.png)][5]    |   [![Timer List](docs/images/screenshot-timer.png)][6]    |
|                        **설정**                        |                     **유저 비교(VS)**                     |
|   [![Option](docs/images/screenshot-option.png)][7]    |    [![Quick Search](docs/images/screenshot-vs.png)][8]    |
|                        **그룹**                        |                       **빠른 검색**                       |
| [![Groups](docs/images/screenshot-group-list.png)][9]  | [![Quick Search](docs/images/screenshot-search.png)][10]  |
|                    **예제 테스트**                     |                                                           |
|   [![Testing](docs/images/screenshot-test.png)][11]   |                                                           |

## 설치 및 사용

Google Chrome의 경우, 웹 스토어에서 최신 버전을 설치할 수 있습니다.

직접 설치하는 경우에는 브라우저마다 다르니, 각 브라우저의 설정에서 확인하시길 바랍니다.

<ul>
   <li>
      <details>
         <summary><strong>직접 설치하기 (Chrome)</strong></summary>
         <ul>
            <li><a href="https://www.howtogeek.com/120743/how-to-install-extensions-from-outside-the-chrome-web-store" target="_blank">How to Install Extensions From Outside the Chrome Web Store</a></li>
         </ul>
      </details>
   </li>
   <li>
      <details>
         <summary><strong>직접 설치하기 (Safari)</strong></summary>
         <ol>
            <li>
               '개발자용' 메뉴에서 '서명되지 않은 확장프로그램 허용' 옵션 체크<br/>
               (개발자용 메뉴 활성화: 환경설정 - 고급 - 메뉴 막대에서 개발자용 메뉴 보기)
            </li>
            <li>
               (NOTE) Safari의 정책으로 1.5.3 버전까지만 지원됩니다. <br/>
               <a href="https://github.com/joonas-yoon/boj-extended/releases/download/v1.5.8/boj-extended-for-safari-1.5.3.dmg" target="_blank">dmg 파일</a>을 다운 받아 실행 후 boj extension을 애플리케이션 폴더로 복사 및 실행<br/>
               (애플리케이션 폴더 내부로 복사한 파일을 실행해야 합니다.)
            </li>
            <li>
               사파리 확장프로그램 설정에 추가된 BOJ extension 체크
            </li>
            <li>
               <a href="https://www.acmicpc.net" target="_blank">백준 온라인 저지 사이트</a>에 접속 후 주소창 왼쪽에 나타난 BOJ extension 클릭 후<br/>
               <i>'이 웹페이지에서 항상 허용'</i> 선택
            </li>
         </ol>
      </details>
   </li>
   <li>
      <details>
         <summary><strong>FireFox 공지사항</strong></summary>
         <ul>
            <li><a href="https://github.com/joonas-yoon/boj-extended/issues/136">이슈#136</a> 스레드를 참고해주시길 바랍니다.</li>
         </ul>
      </details>
   </li>
</ul>

## 업데이트 내역

[▶ 자세히 보기](UPDATENOTE.md)

## Contribute

Issue와 Pull Request는 언제나 환영합니다!

Pull request를 작성하실 예정이라면, [기여 가이드라인](CONTRIBUTING.md) 문서를 확인해주세요!

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
[10]: https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/docs/images/screenshot-search.png
[11]: https://raw.githubusercontent.com/joonas-yoon/boj-extended/main/docs/images/screenshot-test.png
