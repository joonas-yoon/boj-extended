name: 버그 제보
description: 어떤 문제가 생겼는 지 알려주세요
title: ''
labels: '🐛 bug'
body:
  - type: markdown
    attributes:
      value: |
        👋 안녕하세요, 제보해주셔서 감사합니다!
 - type: textarea
    id: what
    attributes:
      label: What happens
      description: |
        어떤 일이 있었는지 간단하게 적어주세요
        
        개발자 도구(F12) - 콘솔(Console)에 나온 오류 메시지를 적어주시면, 더욱 정확하게 해결할 수 있습니다.
        
        스크린샷을 첨부해주시면, 더 좋습니다.
      placeholder: |
        여기에 작성해주세요
      render: markdown
    validations:
      required: true
 - type: dropdown
    id: os
    attributes:
      label: Operating System
      description: 사용하고 계신 운영체제(OS)를 선택해주세요.
      multiple: true
      options:
        - Linux
        - Windows
        - macOS
        - 그 외
    validations:
      required: true
 - type: textarea
    id: env
    attributes:
      label: 환경
      description: |
        ### Windows 사용자
        
        PowerShell 에서 아래 커맨드를 복사/붙여넣기한 결과를 적어주세요.
        ```
        " - OS: $([Environment]::OSVersion.Version)"
        " - Architecture: $((Get-AppxPackage -Name Microsoft.WindowsCalculator).Architecture)"
        ```
        
        ### macOS 사용자
        
        터미널에서 아래 3개의 커맨드 실행 결과를 적어주세요.
        ```
        system_profiler
        sw_vers
        uname
        ```
 - type: textarea
    id: appversion
    attributes:
      label: 확장 프로그램 버전
      description: |
        거의 다 끝났습니다!
        
        문제가 생긴 확장 프로그램의 버전을 적어주세요 :)
        
        Google Chrome의 경우에는, Chrome > 설정 > 확장 프로그램 관리 > BOJ Extended 세부정보 > 버전에서 확인하실 수 있습니다.
