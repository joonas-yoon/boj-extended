## 1.9.5

**Fixes**

- 다크모드에서 유저 티어가 잘못 표시되는 버그 수정 [(#153)](https://github.com/joonas-yoon/boj-extended/issues/153)
- 다크모드에서 사이트 로고가 잘못 표시되는 버그 수정 [(#161)](https://github.com/joonas-yoon/boj-extended/issues/161)
- 그룹에서 "파일" 하이퍼링크 수정 [(#159)](https://github.com/joonas-yoon/boj-extended/issues/159)
- 올바르지 않은 위치에 유저 티어가 표시되는 현상 수정 [(#155)](https://github.com/joonas-yoon/boj-extended/issues/155)
- 유저 조회를 위한 solved.ac API 엔드포인트 변경 [(#162)](https://github.com/joonas-yoon/boj-extended/issues/162)

## 1.9.4.2

**Fixes**

- 잘못된 접근자 사용 수정
- 유저 정보 관련 solved.ac API 연동 복구

## 1.9.4.1

**Fixes**

- solved.ac API 접근 방법 수정 [(#148)](https://github.com/joonas-yoon/boj-extended/issues/148)

## 1.9.4

**Changes**

- solved.ac API 업데이트로 인한 사용 불가 안내 [(#138)](https://github.com/joonas-yoon/boj-extended/issues/138)
- - ![image](https://user-images.githubusercontent.com/9527681/223463527-3e62f76b-d7ba-4e11-9d38-0175afc258a1.png)
- 코드 에디터 색상의 시인성 개선 [(#135)](https://github.com/joonas-yoon/boj-extended/issues/135)

**Fixes**

- 옵션 페이지 버그 수정 [(#140)](https://github.com/joonas-yoon/boj-extended/issues/140)

## 1.9.3.1

**Changes**

- 일부 오래된 파일 제거
- 디렉토리 구조 업데이트

## 1.9.3

**Features**

- '문제 번호'와 '문제 제목' 보기를 체크 박스로 변경
- - thanks to [@VertexToEdge](https://github.com/VertexToEdge)
- - ![image](https://user-images.githubusercontent.com/9527681/199667796-7eca16ac-5b26-43a4-85fe-eabf65c5c6c3.png)

**Fixes**

- 같은 페이지에서 마지막으로 본 페이지를 표시하던 버그 수정
- 캐시 업데이트 이전에 문제 색상이 변경되지 않던 버그 수정

## 1.9.2

**Features**

- `unlimitedStorage` 권한 추가

**Fixes**

- 옵션 페이지의 문제 난이도 예시 버그 수정
- solved.ac API 요청 횟수를 줄이기 위한 로컬 캐싱
- - 유저 티어 불러오기 관련 [(#122)](https://github.com/joonas-yoon/boj-extended/issues/122)
- - 유저 페이지에서 문제 정보의 소스를 solved.ac로 변경하고 캐싱 적용

## 1.9.1

**Features**

- 유저 페이지
- - 문제의 난이도와 그 색상을 표시하는 옵션 추가 (옵션 페이지에서 설정 가능)
- - ![image](https://user-images.githubusercontent.com/9527681/194349706-91a7f929-4790-4301-b842-3306d2c9c340.png)

**Fixes**

- 유저 프로필 페이지의 동작을 최적화
- - 평균 5200 밀리초에 렌더링되던 동작들이 평균 3200 밀리초로 감소
- - 체감 속도는 120 밀리초에서 1초 사이 (CSSOM 먼저 업데이트 후, DOM 트리 변경으로)
- `db.json` 버전을 `1.1.0`으로 올리고 디렉토리를 변경 (`/db/v1.1json`)
- - 문제 난이도 필드 추가
- DOM 노드 생성 함수의 버그 수정

## 1.9.0

**Features**

- 유저의 solved.ac 티어 표시 기능 [(#115)](https://github.com/joonas-yoon/boj-extended/issues/115)
- - thanks to [@spotky1004](https://github.com/spotky1004)
- - 연동되지 않은 사용자는 물음표 티어로 표시
- - ![image](https://user-images.githubusercontent.com/9527681/193469068-7c85cbc2-646d-4cdc-8521-f7334028910a.png)
- - ![image](https://user-images.githubusercontent.com/9527681/193469078-56d57942-245f-4707-94af-9cd5997d3874.png)
- - ![image](https://user-images.githubusercontent.com/9527681/193470404-b07d865e-271b-4e37-8d42-1012994cd12b.png)

## 1.8.4.1

**Fixes**

- 빠른 검색 단축키 버그 수정 ([#113](https://github.com/joonas-yoon/boj-extended/issues/113))

## 1.8.4

**Features**

- 폰트 설정 추가
- - ![image](https://user-images.githubusercontent.com/9527681/185799041-5cb4ec91-212a-4cb1-ac03-d36213020b05.png)
- - ![image](https://user-images.githubusercontent.com/9527681/185799019-c55567ff-a306-4d4b-ab62-6600eac0a6ac.png)

**Fixes**

- rigel 테마에서 문제 링크의 색상 수정
- 퍼센트 표시
- - 런타임 오류 시 버그 수정 [(#78)](https://github.com/joonas-yoon/boj-extended/issues/78)
- - - ![](https://user-images.githubusercontent.com/9527681/185526258-4292730f-a713-48a4-9f45-11ccd2c39d1b.gif)
- - 부분 점수에서도 표시되도록 변경 [(#74)](https://github.com/joonas-yoon/boj-extended/issues/74)
- - - ![](https://user-images.githubusercontent.com/9527681/185736731-6abd17a7-4a36-4e80-b8ac-75b615778ae6.png)
- 옵션 페이지에서 "결과 바꾸기"가 저장이 안 되던 버그 수정
- 일부 함수 최적화

## 1.8.3.1

**Features**

- 마지막으로 본 페이지 알림
- - ![](https://user-images.githubusercontent.com/9527681/185457113-4550612a-f3b7-4885-bf90-2e3b1dcd28df.png)
- - (1) 크롬 탭을 종료하고 사이트에 새로 접속한 경우
- - (2) 4시간 이상 지나고 새로운 페이지를 접근한 경우 (다른 컴퓨터에서도 가능)

**Fixes**

- 확장 프로그램을 최초로 실행할 때, 테마가 시스템 설정을 따르도록 변경
- (hotfix) 런타임 오류 메시지 코드가 반영이 안 되었던 것을 수정

## 1.8.3

**Restores**

- 유저 VS 페이지 복구
- 게시글 개수 표시 복구
- 문제 해결 여부에 따른 색상 표시 복구

**Changes**

- 유저 페이지
- - 문제 표시 UI 변경
- - - ![](https://user-images.githubusercontent.com/9527681/185422492-2f19157e-a732-4934-9bcc-b67875997b55.png)
- - VS 버튼에 배경 효과 추가
- - - ![](https://user-images.githubusercontent.com/9527681/185434073-a015164b-d027-4b08-8b05-709250ca2863.png)

## 1.8.2

**Features**

- 새 테마 추가 (`Rigel`)
- - ![](https://user-images.githubusercontent.com/9527681/166296279-c25bea15-679e-4672-a776-8cd0ed8cb73e.png)
- 런타임 오류 결과에 간략한 메시지 툴팁 추가
- - ![](https://user-images.githubusercontent.com/9527681/184939662-953b28ea-b36e-4b68-a78b-f26cc792c6c9.gif)

**Changes**

- 디렉토리 구조 리팩토링
- 사용하지 않는 파일과 변수들 삭제

## 1.8.1

**Notice**

- 테마 기능 업데이트로 생긴 버그 때문에 `1.8.0`을 `1.7.6`으로 되돌림 [(#90)](https://github.com/joonas-yoon/boj-extended/issues/90)

## 1.8.0

**Features**

- 새 테마 추가
- - 시스템에 따른 자동 설정
- - `Rigel`
- - 테마 선택 UI 변경 (드롭다운)

## 1.7.8.1

**Fixes**

- 그룹 페이지 업데이트 [(#87)](https://github.com/joonas-yoon/boj-extended/issues/87)
- - **멤버** 탭 삭제에 따라 관련 기능 삭제
- - 비로그인 상태에서 보이는 탭 변경
- - 문제집 URL 변경

## 1.7.7

**Fixes**

- 프로필 화면의 문제 제목 표시 오류 수정 [(#83)](https://github.com/joonas-yoon/boj-extended/issues/83)
- 백그라운드 서비스 워커에서 설정 파일을 불러오는 경로 수정

**Removes**

- 유저 VS 기능 삭제

## 1.7.6

**Features**

- Manifest Version 3로 변경 [(docs)](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration/)
- - Google Analytics 삭제

**Deprecated**

- 게시글 개수 표시 삭제 [(#80)](https://github.com/joonas-yoon/boj-extended/issues/80)
- 문제 해결 여부에 따른 색상 표시 삭제 [(#80)](https://github.com/joonas-yoon/boj-extended/issues/80)

## 1.7.5.2

**Fixes**

- 게시글 개수 버그 수정

## 1.7.5.1

`1.7.4`, `1.7.5`와 동일 (배포 자동화 테스트를 위한 단순한 버전 업)

[`chrome-webstore-upload-cli`](https://www.npmjs.com/package/chrome-webstore-upload-cli)를 사용하여 크롬 웹스토어에 자동으로 배포되는 프로세스 추가

**Fixes**

- 문제와 연결된 질문 게시글의 개수 파싱 수정 및 효율화 [(#67)](https://github.com/joonas-yoon/boj-extended/issues/67)

## 1.7.3

2022/01/19

**Fixes**

- 색상이 엉뚱한 곳에도 적용되는 것 수정 [(#64)](https://github.com/joonas-yoon/boj-extended/issues/64)

## 1.7.2

2022/01/18

**Features**

- 빠른 검색
- - 무한 스크롤 적용 (검색 결과는 최대 1,000개까지 표시됨)
- 모든 BOJ 문제 링크에 문제 색상 반영되도록 변경 [(#61)](https://github.com/joonas-yoon/boj-extended/issues/61)

**Fixes**

- 빠른 검색 시 마지막 상태를 저장 (탭 위치, 마지막 입력 텍스트 유지)

## 1.7.1

2022/01/12

**Features**

- 빠른 검색
- - 문제집 내부의 검색된 문제 표시
- - 탭키로 탭 변경 가능 (다음 탭: Tab, 이전 탭: Shift+Tab)

**Fixes**

- hotfix [(#59)](https://github.com/joonas-yoon/boj-extended/issues/59)

## 1.7.0

2022/01/07

**Features**

- 검색 페이지에도 문제 색상 적용 [(#54)](https://github.com/joonas-yoon/boj-extended/issues/54)
- 빠른 검색에 탭 추가 [(#55)](https://github.com/joonas-yoon/boj-extended/issues/55)
- ![](https://user-images.githubusercontent.com/9527681/148531868-98836957-908e-4a7e-b8d6-899eb05c4f6e.png)
- ![](https://user-images.githubusercontent.com/9527681/148532062-07326dbe-1bb1-448f-b94f-b8f8dc121683.png)

**Fixes**

- 어두운 테마
- - 대회 스코어보드에도 적용
- - 일부 색상 수정 (로그인 페이지, 상단 확장 메뉴, 빠른 검색의 배경 등)
- `localStorage` 를 사용하여 캐싱

## 1.6.1

2021/11/09

**Features**

- 빠른 검색 [(#48)](https://github.com/joonas-yoon/boj-extended/issues/48)
- - `ctrl` + `/` 또는 `alt` + `/`
- - ![](https://user-images.githubusercontent.com/9527681/140657019-eb299c53-1c07-4c0a-bb0b-e52f8cef537a.png)

## 1.5.11

2021/11/07

**Features**

- 알림 페이지에서 문제 색상 적용 [(#44)](https://github.com/joonas-yoon/boj-extended/issues/44)
- - ![](https://user-images.githubusercontent.com/9527681/140634324-9ea2582f-b36f-433a-907a-22b0614456f1.png)

**Fixes**

- 어두운 테마
- - 댓글 하이라이팅 [(#45)](https://github.com/joonas-yoon/boj-extended/issues/45)
- - 외부 대회 일정 ([#46](https://github.com/joonas-yoon/boj-extended/issues/46)
- - thanks to [@comment2](https://github.com/comment2)
- - ![](https://user-images.githubusercontent.com/86146642/139788933-c27009cb-c3b6-441e-b092-4bdfb47558be.png)

## 1.5.10

2021/10/21

**Features**

- 타이머에 시간 표기 추가 [(#41)](https://github.com/joonas-yoon/boj-extended/issues/41)
- - ![](https://user-images.githubusercontent.com/9527681/137610903-c7f39a95-009e-44bd-b474-1af98f9f481f.png)

**Fixes**

- 어두운 테마
- - 메모 작성에서 누락된 CSS 적용 [(#42)](https://github.com/joonas-yoon/boj-extended/issues/42)
- - 반전 필터 및 색상 조정
- - 부분 점수 버그 수정 [(#40)](https://github.com/joonas-yoon/boj-extended/issues/40)

**Changes**

- 채점현황의 결과 바꾸기 기본값 변경 [(#39)](https://github.com/joonas-yoon/boj-extended/issues/#39)

## 1.5.9

2021/10/03

**Features**

- 소스 코드(제출, 코드보기, 하이라이트)를 어두운 테마에서도 적용 [(#34)](https://github.com/joonas-yoon/boj-extended/issues/34) [(#38)](https://github.com/joonas-yoon/boj-extended/issues/38)
- - ![](https://user-images.githubusercontent.com/9527681/135277080-03645e22-b717-4b17-8e16-6a8b00ad68bc.png)
- - ![](https://user-images.githubusercontent.com/9527681/135742049-4ef88d4a-8c77-4faa-a7c3-82b04a6ca457.png)
- 재채점 페이지에도 문제 제목 적용 [(#25)](https://github.com/joonas-yoon/boj-extended/issues/25)
- - ![](https://user-images.githubusercontent.com/9527681/135744218-14f711c8-78ca-4919-af2a-f8613847d07a.png)

**Fixes**

- 결과 바꾸기
- - 재채점 결과 페이지에서 바뀐 결과가 두 번 출력되는 버그 수정 [(#36)](https://github.com/joonas-yoon/boj-extended/issues/36)
- - 숫자 포맷 제거 [(#37)](https://github.com/joonas-yoon/boj-extended/issues/37)

**Changes**

- 어두운 테마 색상 조정

## 1.5.8

2021/09/25

**Fixes**

- 제출 현황
- - 런타임 에러의 원인 도움말 요약이 표시되지 않던 버그 수정
- - 하이퍼 링크가 적용되지 않던 버그 수정 [(#35)](https://github.com/joonas-yoon/boj-extended/issues/35)
- 옵션 설정 페이지
- - 문제 타이머 버그 수정
- - 도움말 보기에 어두운 테마 적용 [(#33)](https://github.com/joonas-yoon/boj-extended/issues/33)
- - 창 너비에 따른 여백 수정 [(#31)](https://github.com/joonas-yoon/boj-extended/issues/31)

**Changes**

- 어두운 테마 색상 조정

## v1.5.7

2021/09/10

**Features**

- 옵션 페이지에 도움말과 미리 보기 추가

**Fixes**

- (hotfix) 채점 현황
- - 채점 텍스트가 변경되지 않던 현상 수정 [(#30)](https://github.com/joonas-yoon/boj-extended/issues/30)

## v1.5.6

2021/09/07

**Features**

- VS 페이지에도 문제 번호/제목 표시
- VS 페이지에서 '~만 맞았지만 만점을 받지 못한 문제'를 추가

**Changes**

- 유저 프로필의 VS 기본값을 로그인한 유저 닉네임 적용

## v1.5.5

2021/08/29

**Fixes**

- 어두운 테마
- - 언어 선택 dropdown [(#26)](https://github.com/joonas-yoon/boj-extended/issues/26)
- - ![](https://user-images.githubusercontent.com/9527681/131237431-cd38328f-c16e-4cf1-8162-32eab2749fa5.png)
- - 에디터에도 색상 반전 적용 [(#27)](https://github.com/joonas-yoon/boj-extended/issues/27)
- - ![](https://user-images.githubusercontent.com/9527681/131237270-7699f489-85f6-43e2-8a0f-8c3a9d54ff3d.png)

**Changes**

- 어두운 테마
- - 일부 버튼 색상 변경
- - 메뉴 네비게이션 색상 변경

## v1.5.4

2021/08/27

**Changes**

- 채점 현황
- - 퍼센트(%) 기록을 로컬에 저장하여 표시 (`localStorage`)
- - 부분 점수에도 퍼센트(%) 기록을 표시
- - ![](https://user-images.githubusercontent.com/9527681/128722599-c2dc230d-47f9-406e-a697-13682a87ad79.gif)
- 옵션
- - 페이지 레이아웃 수정

## v1.5.3

2021/08/09

**Features**

- 어두운 테마
- - 이미지를 어둡게 변환하여 표시 [(#20)](https://github.com/joonas-yoon/boj-extended/issues/20)
- 채점 현황
- - 채점이 종료되면 몇 퍼센트(%)에서 틀렸는 지 임시로 표시 (해당 페이지의 전역 변수)
- - thanks to [@zinccccc](https://www.acmicpc.net/user/zinccccc)
- 그룹
- - 그룹 목록에서 내부 메뉴로 바로 이동할 수 있는 링크 추가

**Fixes**

- 제출 현황에서 너비가 떨리는 현상 재수정 [(#18)](https://github.com/joonas-yoon/boj-extended/issues/18)
- - `display` 여부를 인라인 스타일에서 클래스로 변경
- 복사 버튼의 CSS 제거
- - 소스 보기 화면에서 다르게 보여서 제거
- 어두운 테마
- - 드롭 다운의 아이템 폰트 색상 변경 [(#21)](https://github.com/joonas-yoon/boj-extended/issues/21)
- - 일부 배경이 어둡게 남은 것 변경 (depth에 따른 밝기 조정)

## v1.5.2

2021/07/26

**Fixes**

- 제출 현황에서 너비가 떨리는 현상 수정 [(#18)](https://github.com/joonas-yoon/boj-extended/issues/18)
- - 제출 결과 너비를 고정

## v1.5.1

2021/07/25

**Features**

- 유저 프로필 페이지에 VS 버튼 추가

**Changes**

- VS 페이지에서 유저 아이디 클릭 시 프로필로 연결

## v1.5.0

20201/07/25

**Features**

- 유저 VS 추가
- - 과거 URL(`/vs/user1/user2`)를 그대로 지원
- - ![](https://user-images.githubusercontent.com/9527681/126895334-57f9167e-2dee-416f-ae28-57586d57a1ca.png)

## v1.4.6

20201/07/02

**Changes**

- 유저 프로필의 문제 표시 수 수정 [(#16)](https://github.com/joonas-yoon/boj-extended/issues/16)
- - 더보기 추가
- - ![](https://user-images.githubusercontent.com/9527681/117659307-c1f35700-b1d6-11eb-831c-dcc9c7ae5ff6.png)

**Fixes**

- 그룹 내의 스코어 보드에 CSS가 적용되지 않은 것 수정 [(#17)](https://github.com/joonas-yoon/boj-extended/issues/17)
- - ![](https://user-images.githubusercontent.com/9527681/124287962-957f0a00-db8b-11eb-9e11-15de40f12a55.png)

## v1.4.5

20201/05/05

**Features**

- 제출 결과 텍스트의 숫자 치환 추가 [(#15)](https://github.com/joonas-yoon/boj-extended/issues/15)
- - '채점 중'과 '부분 점수'의 텍스트 포맷에 숫자 사용 가능 (치환자는 `:number:`)

**Changes**

- 제출 현황의 컬럼 너비 수정

## v1.4.4

20201/02/21

**Changes**

- `db.json`에 업데이트 시간 추가
- 로컬 DB에 없는 문제 정보는 원격 저장소(github)에서 가져오도록 변경 [(#11)](https://github.com/joonas-yoon/boj-extended/issues/11)

**Fixes**

- CSS 일부 수정
- - 스크롤 바, 즐겨찾기 버튼, 복사 버튼
- 오타 수정

## v1.4.3

2021/02/06

**Features**

- 문제 화면에서 해당 문제의 질문 개수 표시

**Fixes**

- GA 코드 버그 수정
- 게시판에서 문제 제목 오류 수정

## v1.4.2

2021/01/31

**Features**

- Google Analytics 추가
- 게시판에서도 문제 제목 표시 [(#6)](https://github.com/joonas-yoon/boj-extended/issues/6)

**Changes**

- 어두운 테마를 약간 밝게 조정

**Fixes**

- 어두운 테마를 불러오는 방식 수정 [(#7)](https://github.com/joonas-yoon/boj-extended/issues/7)
- - `localStorage`로 깜빡임 현상 해결
- babel 빌드 설정 수정

## v1.4.1

2021/01/30

**Features**

- 문제 타이머 추가
- - ![](https://user-images.githubusercontent.com/9527681/105990512-ecb51600-60e5-11eb-8ce5-9d44adde2839.png)

**Fixes**

- `chrome.stroage.sync`의 불필요한 동기화를 줄임
- - Config 클래스의 버퍼를 먼저 참조하고, 변화가 생기면 동기화 (딜레이 낮춤)
- - background로 옮겨서 메시지 전달로 대응 [(#5)](https://github.com/joonas-yoon/boj-extended/issues/5)
- 제출 결과 텍스트의 원본을 유지 (숨김)

## v1.4.0

2021/01/27

**Features**

- 제출 결과 텍스트를 변경 가능
- - 일부 결과는 보류 (채점 중, 부분 점수, 런타임 에러)
- - ![](https://user-images.githubusercontent.com/33388801/134762385-966db4c5-d104-41c5-adaa-8b29bc7bce7f.png)
- 옵션 페이지 추가
- - '확장 프로그램의 옵션' 또는 'BOJ의 설정 페이지의 왼쪽 메뉴'에서 접근 가능
- ![](https://user-images.githubusercontent.com/33388801/134762398-66646b7f-b3af-4d89-9f85-489128a2989f.png)

## v1.3.1

2021/01/25

**Features**

- 넓게 보기 추가
- 채점 현황
- - 내 제출 결과에는 강조 표시 (파란색 굵은 수직선)
- - 런타임 오류의 도움말을 간단히 표시 (도움말에서 긁어옴)
- 그룹 멤버 정렬 추가

**Fixes**

- 어두운 테마 버그 수정

## v1.3.0

2021/01/25

**Features**

- 어두운 테마 추가 [(#1)](https://github.com/joonas-yoon/boj-extended/issues/1)
- - ![](https://user-images.githubusercontent.com/9527681/105626575-cdaf4d80-5e73-11eb-8ca4-30cb8cce0959.png)
- Github action으로 빌드 자동화

## v1.2.1

**Fixes**

- 코드 안정화

## v1.2.0

**Features**

- 채점 현황에도 문제 제목을 표시

## v1.1.0

2021/01/24

**Fixes**

- 코드 리팩토링
- Github action으로 문제 DB를 사이트와 동기화

## v1.0.0

2021/01/21

**Features**

- 유저 프로필 페이지에서 문제 번호와 문제 제목 표시
- `chrome.storage.sync`에 저장하여 설정 동기화
