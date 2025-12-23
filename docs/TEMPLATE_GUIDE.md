# 나만의 프로젝트 템플릿 만들기 가이드

현재 만드신 **Vibe Community**를 다른 프로젝트의 기초로 사용(Scaffolding)할 수 있도록 템플릿으로 만드는 가장 좋은 방법은 **[Cookiecutter](https://github.com/cookiecutter/cookiecutter)** 를 사용하는 것입니다.

이 방식을 사용하면 사용자가 터미널에서 명령어 한 줄로 프로젝트를 설치하고, 프로젝트 이름이나 데이터베이스 설정 등을 동적으로 입력받아 자동 생성할 수 있습니다.

---

## 1. Cookiecutter 방식 (추천 ⭐️)

Python 진영에서 가장 표준적으로 쓰이는 템플릿 도구입니다.

### 단계 1: 프로젝트 구조 변경
현재 프로젝트 폴더 상위에 새로운 폴더(예: `vibe-stack-template`)를 만들고, 그 안에 현재 프로젝트 내용물을 `{{cookiecutter.project_slug}}`라는 이름의 폴더 안으로 옮깁니다.

```
vibe-stack-template/
├── cookiecutter.json        <-- 설정 파일 (새로 생성)
└── {{cookiecutter.project_slug}}/  <-- 현재 프로젝트 코드들이 이 안으로 들어감
    ├── app/
    ├── frontend/
    ├── requirements.txt
    └── ...
```

### 단계 2: `cookiecutter.json` 작성
루트 경로에 `cookiecutter.json` 파일을 만들고 변수들을 정의합니다.

```json
{
  "project_name": "My Vibe Project",
  "project_slug": "{{ cookiecutter.project_name.lower().replace(' ', '_').replace('-', '_') }}",
  "author_name": "Your Name",
  "python_version": "3.11"
}
```

### 단계 3: 코드 내 변수 치환 (옵션)
코드 내부에서 프로젝트 이름이 하드코딩된 부분을 `{{cookiecutter.project_name}}`과 같이 템플릿 변수로 바꿔주면, 설치 시 입력한 값으로 자동 변경됩니다.
* 예: `config.py`의 `PROJECT_NAME = "{{cookiecutter.project_name}}"`

### 단계 4: GitHub에 업로드
이 `vibe-stack-template` 폴더를 GitHub 리포지토리(예: `your-id/vibe-template`)에 올립니다.

### 단계 5: 사용 방법 (터미널 명령어)
이제 다른 프로젝트에서 터미널을 열고 아래 명령어를 입력하면 설치됩니다.

```bash
# 1. cookiecutter 설치 (최초 1회)
pip install cookiecutter

# 2. 템플릿으로 프로젝트 생성
cookiecutter https://github.com/your-id/vibe-template
```
명령어를 치면 "project_name은 무엇입니까?" 하고 물어보고, 입력하면 그 이름으로 폴더가 짠 하고 만들어집니다! 🎉

---

## 2. GitHub Repository Template 방식 (가장 간편)

변수 치환 기능은 없지만, 가장 빠르게 적용할 수 있는 방법입니다.

1. 현재 프로젝트를 GitHub에 올립니다.
2. GitHub 리포지토리 **Settings** -> **General** -> **Template repository** 체크박스를 체크합니다.
3. 이제 다른 사용자가 이 리포지토리 메인 화면에서 **"Use this template"** 버튼을 누르거나, 아래 명령어로 복제할 수 있습니다.

```bash
# GitHub CLI 사용 시
gh repo create my-new-app --template your-id/vibe-community
```

---

## 3. 쉘 스크립트 설치 방식 (고급)

`curl` 명령어로 스크립트를 받아 실행하게 하는 방식(예: `create-react-app`, `oh-my-zsh`)입니다.

1. 설치 스크립트(`install.sh`)를 작성하여 저장소에 올립니다.
2. 사용자는 아래처럼 실행합니다.

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/your-id/vibe-community/main/install.sh)"
```

**추천:** 유지보수가 쉽고 확장이 편리한 **1번 Cookiecutter 방식**을 가장 추천드립니다.

---

## 💡 사용자가 도구를 설치하기 귀찮아한다면?

네, 기본적으로는 사용자가 `pip install cookiecutter`를 해야 합니다. 하지만 이 단계를 건너뛰게 할 수 있는 방법들이 있습니다.

### 방법 1: `pipx` 사용 (설치 없이 실행)
Python 3.x가 있는 환경이라면, 라이브러리를 전역에 설치하지 않고 바로 실행하는 `pipx`를 사용할 수 있습니다. (`npx`와 유사)

```bash
# 별도 설치 없이 바로 실행
pipx run cookiecutter https://github.com/your-id/vibe-template
```

### 방법 2: 쉘 스크립트 (One-Liner) 만들기
사용자에게 긴 명령어를 치게 하기보다, `install.sh` 파일을 하나 만들어서 제공하면 폼이 납니다.

1. `install.sh` 작성:
    ```bash
    #!/bin/bash
    # cookiecutter가 없으면 임시로 설치해서 실행하거나 pipx를 사용하는 스크립트
    if ! command -v cookiecutter &> /dev/null; then
        echo "Installing cookiecutter..."
        pip install -q cookiecutter
    fi
    cookiecutter https://github.com/your-id/vibe-template
    ```
2. 사용자는 아래 명령어만 입력:
    ```bash
    curl -sL https://raw.githubusercontent.com/your-id/vibe-template/main/install.sh | bash
    ```
이러면 사용자는 **복사 -> 붙여넣기 -> 엔터** 끝입니다! 😎

---

## 4. Node.js CLI 방식 (`npx create-vibe-app`) (⭐️ 유저가 본 그 방식)

가장 있어 보이고, 모던 웹 프레임워크들(`create-next-app`, `vite`)이 쓰는 방식입니다. 사용자에게 **"Node.js 명령어"** 처럼 보이는 것이 바로 이 `npx` 방식입니다.

### 원리
1. `create-vibe-app`이라는 이름으로 **npm 패키지**를 하나 만듭니다.
2. 이 패키지 안에는 단순히 템플릿을 다운로드하고 설치해 주는 **자바스크립트 스크립트**가 들어있습니다.
3. 사용자가 `npx create-vibe-app`을 치면, npm이 이 패키지를 임시로 받아 실행합니다.

### 만드는 법 (간단 요약)
1. 새 폴더 생성 (`mkdir create-vibe-app`)
2. `package.json` 생성 (`npm init -y`)
    ```json
    {
      "name": "create-vibe-app",
      "bin": "./index.js"
    }
    ```
3. `index.js` 작성 (터미널에서 입력을 받고, 깃헙에서 코드를 복사해오는 로직)
    ```javascript
    #!/usr/bin/env node
    const { execSync } = require('child_process');
    
    console.log("🍊 Vibe Community를 설치합니다...");
    // 1. git clone으로 템플릿 다운로드
    execSync('git clone https://github.com/your-id/vibe-community my-app');
    // 2. 의존성 설치 안내 등...
    console.log("완료! cd my-app && npm run dev");
    ```
4. `npm publish`로 배포

### 사용자는 이렇게 씁니다
```bash
npx create-vibe-app my-new-project
```
이 방식이 가장 **프로페셔널**해 보입니다. 프론트엔드/풀스택 프로젝트라면 이 방식을 강력 추천합니다! 👍
