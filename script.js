document.addEventListener('DOMContentLoaded', () => {
    // 화면 요소들
    const startScreen = document.getElementById('start-screen');
    const characterSetup = document.getElementById('character-setup');
    const gameScreen = document.getElementById('game-screen');
    
    // 시작 화면 요소들
    const startButton = document.getElementById('start-button');
    
    // 캐릭터 설정 화면 요소들
    const playerNameInput = document.getElementById('player-name');
    const genderButtons = document.querySelectorAll('.gender-btn');
    const confirmSetupButton = document.getElementById('confirm-setup');
    const backToStartButton = document.getElementById('back-to-start');
    
    // 플레이어 정보 저장 변수
    let playerInfo = {
        name: '',
        gender: ''
    };
    
    // 시작 버튼 클릭 이벤트
    startButton.addEventListener('click', showCharacterSetup);
    
    // 캐릭터 설정 화면 표시
    function showCharacterSetup() {
        fadeTransition(startScreen, characterSetup, () => {
            // 입력 필드 초기화
            playerNameInput.value = '';
            playerNameInput.focus();
            genderButtons.forEach(btn => btn.classList.remove('selected'));
            updateConfirmButton();
        });
    }
    
    // 성별 버튼 이벤트
    genderButtons.forEach(button => {
        button.addEventListener('click', () => {
            genderButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            playerInfo.gender = button.dataset.gender;
            updateConfirmButton();
        });
    });
    
    // 이름 입력 이벤트
    playerNameInput.addEventListener('input', () => {
        playerInfo.name = playerNameInput.value.trim();
        updateConfirmButton();
    });
    
    // Enter 키로 다음 단계 진행
    playerNameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && confirmSetupButton.disabled === false) {
            startGame();
        }
    });
    
    // 확인 버튼 상태 업데이트
    function updateConfirmButton() {
        const isValid = playerInfo.name.length > 0 && playerInfo.gender !== '';
        confirmSetupButton.disabled = !isValid;
    }
    
    // 확인 버튼 클릭 이벤트
    confirmSetupButton.addEventListener('click', startGame);
    
    // 돌아가기 버튼 클릭 이벤트
    backToStartButton.addEventListener('click', () => {
        fadeTransition(characterSetup, startScreen);
    });
    
    // 게임 시작 함수
    function startGame() {
        if (confirmSetupButton.disabled) return;
        
        fadeTransition(characterSetup, gameScreen, () => {
            // 게임 초기화
            initializeGame();
        });
    }
    
    // 화면 전환 함수
    function fadeTransition(fromScreen, toScreen, callback) {
        fromScreen.style.opacity = '0';
        fromScreen.style.transition = 'opacity 0.5s ease-out';
        
        setTimeout(() => {
            fromScreen.style.display = 'none';
            
            // 게임 화면은 block, 나머지는 flex
            if (toScreen === gameScreen) {
                toScreen.style.display = 'block';
            } else {
                toScreen.style.display = 'flex';
            }
            
            toScreen.style.opacity = '0';
            toScreen.style.transition = 'opacity 0.5s ease-in';
            
            setTimeout(() => {
                toScreen.style.opacity = '1';
                if (callback) callback();
            }, 50);
        }, 500);
    }
    
    // 미션 완료 효과 표시 함수
    function showMissionComplete(mission) {
        const missionComplete = document.getElementById('mission-complete');
        const missionIcon = document.querySelector('.mission-icon');
        const missionTitle = document.querySelector('.mission-title');
        const missionDescription = document.querySelector('.mission-description');
        
        // 미션 정보 설정
        missionIcon.textContent = mission.icon;
        missionTitle.textContent = '미션 완료!';
        missionDescription.textContent = mission.title;
        
        // 미션 완료 팝업 표시
        missionComplete.style.display = 'flex';
        
        // 미션 창 닫기 함수
        const hideMission = () => {
            missionComplete.style.opacity = '0';
            setTimeout(() => {
                missionComplete.style.display = 'none';
                missionComplete.style.opacity = '1';
            }, 500);
        };
        
        // 클릭 시에만 미션 창 닫기 (자동 닫기 제거)
        missionComplete.addEventListener('click', hideMission, { once: true });
    }

    // 게임 초기화 함수
    function initializeGame() {
        console.log('플레이어 정보:', playerInfo); // 디버깅용
        
        // 플레이어 정보를 전역으로 설정 (나중에 스토리에서 사용할 수 있도록)
        window.gameData = {
            playerName: playerInfo.name,
            playerGender: playerInfo.gender
        };
        
        // 기존 게임 로직 시작
        showScene(0);
        updateButtonStates();
    }

    // 동적 텍스트 생성 함수
    function getDynamicText(text) {
        if (!window.gameData) return text;
        
        const { playerName, playerGender } = window.gameData;
        
        // 텍스트 내의 플레이스홀더 치환
        return text
            .replace(/\[PLAYER_NAME\]/g, playerName)
            .replace(/\[EX_RELATIONSHIP\]/g, playerGender === 'male' ? '여자친구' : '남자친구');
    }

    const story = [
        // 프롤로그: 알 수 없는 끌림
        { 
            background: './엘리베이터_배경.jpg', 
            text: "회사를 그만둔 지 일주일이 지났다. 더 이상 견딜 수 없었다. 매일 야근에 주말 근무, 상사의 무리한 요구들... 몸도 마음도 지쳐있었다." 
        },
        { 
            speaker: "[PLAYER_NAME]", 
            text: "이제 뭘 해야 하지?" 
        },
        { 
            text: "막막함 속에서 길을 걷다가 문득 '청년동'이라는 간판이 눈에 들어왔다. 갑자기 가슴이 두근거리며 묘한 끌림을 느꼈다." 
        },
        { 
            speaker: "[PLAYER_NAME]", 
            text: "청년동... 정말 오랜만이다." 
        },
        { 
            text: "예전에 자주 다니던 청년센터였다. 대학 졸업 후 진로를 고민하며 이곳에서 많은 시간을 보냈었는데... 취업하고 나서는 발길을 끊었다. 아니, 정확히는 그 전에 [EX_RELATIONSHIP]와 헤어지면서 이곳과 관련된 모든 것을 피하고 싶어했다." 
        },
        { 
            speaker: "[PLAYER_NAME]", 
            text: "연인과 헤어진 후로 이런 곳에 오면 자꾸 그때 생각이 난다. 특히 힘들 때마다..." 
        },
        { 
            text: "무언가가 나를 이곳으로 이끌고 있는 것 같았다. 새로운 시작이 필요한 지금, 이상하게도 이곳에서 답을 찾을 수 있을 것만 같았다." 
        },
        
        // 1장: 변화된 공간, 변하지 않은 따뜻함
        { 
            background: './청년동 로비.jpg', 
            text: "청년동의 유리문을 밀고 들어서니 완전히 달라진 모습에 놀랐다. 예전의 딱딱한 분위기는 사라지고, 따뜻한 우드톤과 밝은 조명으로 꾸며진 아늑한 공간이 펼쳐져 있었다." 
        },
        { 
            text: "오른쪽 라운지에서는 많은 청년들이 작업하고 있었고, 뒤쪽에서는 커피 향이 은은하게 풍겨왔다." 
        },
        { 
            speaker: "인포데스크 직원", 
            text: "안녕하세요, 출석 체크 부탁드려요." 
        },
        { 
            text: "인포데스크의 젊은 직원이 고개를 들더니 눈이 휘둥그레졌다." 
        },
        { 
            speaker: "미소", 
            text: "어? 혹시... [PLAYER_NAME]님? 정말 오랜만이시네요!" 
        },
        { 
            speaker: "미소", 
            text: "저 김미소예요. 몇 년 전까지만 해도 정말 자주 오셨는데..." 
        },
        { 
            speaker: "[PLAYER_NAME]", 
            text: "죄송해요. 기억이 잘..." 
        },
        { 
            speaker: "미소", 
            text: "아, 리모델링하면서 예전 기록들이 초기화돼서 새로 등록하셔야 해요." 
        },
        { 
            speaker: "미소", 
            text: "출석은 하루 두 번, 올 때 한 번 갈 때 한 번 찍으시면 1800포인트 적립돼요." 
        },
        { 
            speaker: "[PLAYER_NAME]", 
            text: "포인트요?" 
        },
        { 
            speaker: "미소", 
            text: "네, 청년동에서 쓸 수 있는 포인트예요. 자판기에서 음료나 간식 사 먹을 때 사용할 수 있어서 꽤 유용해요. 꼭 잊지 말고 나가실 때도 찍어주세요!" 
        },
        { 
            text: "출석 체크를 마치고 나니 미소가 말했다." 
        },
        { 
            speaker: "미소", 
            text: "그럼 천천히 둘러보세요! 공유공간도 많이 바뀌었거든요.",
            mission: {
                title: "인포데스크에서 출석 체크 완료 + 미소와의 첫 만남",
                icon: "🎮"
            }
        },
        
        // 기존 스토리 (우주와 규빈)
        { background: './철산 맥도날드.png', speaker: "우주", text: "아니, 남규빈 언제 오는 거야? ㅡㅡ" },
        { text: "전화벨이 울리고, 우주가 전화를 받는다." },
        { speaker: "우주", text: "야 너 어디야? 언제 와??" },
        { speaker: "규빈(전화)", text: "야, 미안. 오늘은 못 갈 거 같아. 갑자기 집에 일 생겨서." },
        { speaker: "우주", text: "뭐? 공간 예약까지 다 해놨는데? 밴드실 그냥 버리라고?" },
        { speaker: "규빈(전화)", text: "다음에 두 배로 할게. 진짜 미안하다." },
        { speaker: "우주", text: "하… 알았어. 근데 이 시간에 나 혼자 밴드실 가면 좀 웃기잖아." },
        { speaker: "규빈(전화)", text: "네가 뭐, 혼자 노래라도 하다 와." },
        { text: "우주는 투덜거리면서도 결국 짐을 챙겨 청년동으로 향했다." },

        // 2. 청년동 도착 – 로비 씬
        { background: './청년동 로비.jpg', text: "엘리베이터 문이 열리자 넓고 조용한 로비가 보인다." },
        { background: './청년동 로비.jpg', speaker: "우주", text: "오랜만이네… 진짜 몇 달 만이지?" },
        { background: './청년동 로비.jpg', text: "로비 한쪽에 인포데스크와 휴게 공간이 보이지만 사람은 거의 없다." },
        { background: './청년동 사물함.jpg', text: "우주는 사물함이 있는 구역으로 이동했다." },

        // 3. 사물함 씬
        { text: "사물함 구역에 도착한 우주가 자기 사물함 문을 열자, 안에 접힌 쪽지가 있다." },
        { background: './사물함_쪽지.png', text: "“우주야, 지난번에 도와줘서 고마웠어. 그거 보답하고 싶은데, 회의실 2번으로 와줄 수 있어? 내가 너한데 줄 편지를 적어놨어…!”" },
        { speaker: "우주", text: "회의실 2번…? 고마웠다고…? 편지…? 무슨 소리지…?" },
        { text: "우주는 호기심에 회의실 2번으로 향했다." },

        // 4. 회의실 2번 씬
        { background: './청년동 회의실 2번.jpg', text: "우주가 문을 열고 회의실 2번으로 들어갔다." },
        { text: "우주는 쪽지를 찾기 위해 주위를 둘러보며 집중하고 있었다." },
        { speaker: "설하", text: "여기서 뭐해?" },
        { speaker: "우주", text: "아… 이 쪽지 보고 왔는데." },
        { text: "우주가 쪽지를 보여주자, 설하가 다른 쪽지를 보여준다." },
        { speaker: "설하", text: "혹시 이거 찾고 있었어?" },
        { speaker: "우주", text: "그거 어디서 났어?" },
        { speaker: "설하", text: "음… 그냥 우연히?" },
        { text: "설하가 쪽지를 건넸다." },
        { text: "“회의실 2번으로 와.\n전에 네 텀블러 떨어뜨릴 뻔했을 때 잡아준 거 기억나?\n그때는 제대로 인사도 못 했네.”" },
        { text: "“로비라운지 냉장고에 네가 좋아하는 음료를 텀블러에 담아놨어.\n시간 나면 가져가.”" },
        { text: "둘은 로비라운지로 이동했다." },

        // 5. 로비라운지 냉장고 씬
        { background: './청년동 로비.jpg', text: "냉장고 앞에 선 우주와 설하." },
        { speaker: "우주", text: "이건 거 같은데…?" },
        { text: "검은색 텀블러를 꺼내자, 옆면에 포스트잇이 두 겹으로 붙어있다." },
        { text: "첫 번째 포스트잇: “네가 좋아했던 음료 맞지? 우대수 준비해놨어.”" },
        { speaker: "우주", text: "…우대수? 이건 나만 쓰는 표현인데… 어떻게 알았지?" },
        { speaker: "설하", text: "그럼 진짜 너 잘 아는 사람인가 보네." },
        { speaker: "설하", text: "근데, 우대수가 뭐야?" },
        { speaker: "우주", text: "메뉴명이 길어서 내가 줄여 부르는 거야. ‘우리 대추 수정과’의 준말." },
        { speaker: "설하", text: "그 정도면 너랑 꽤 가까운 사람인데… 누굴까?" },

        // 6. 두 번째 포스트잇 발견
        { speaker: "우주", text: "어? 포스트잇이 두 겹인데?" },
        { text: "우주가 첫 장을 떼고 읽었다." },
        { text: "두 번째 포스트잇: “이 텀블러, 그때 네가 떨어뜨릴 뻔한 거 내가 잡아준 거야. 그때 말 못 했는데, 네가 해준 게 생각보다 많더라. 다음 장소는 스페이스 D. 거기서 기다릴게.”" },
        { speaker: "우주", text: "이 정도면… 그냥 직접 나와서 얘기하지." },
        { speaker: "설하", text: "그러게… I 100퍼센트인가?" },
        { text: "둘은 웃으며 스페이스 D로 향했다." },

        // 7. 스페이스 D 씬
        { background: './청년동 회의실 2번.jpg', text: "스페이스 D에 도착하니, 문이 살짝 열려 있다." },
        { speaker: "우주", text: "여기네. 근데 문이 열려 있는데?" },
        { speaker: "설하", text: "안에 누가 있는 건가?" },
        { text: "둘이 조심스레 들어갔다. 테이블 위에 작은 상자가 놓여 있다." },
        { speaker: "우주", text: "또 단서인가 본데…" }
    ];

    let currentScene = 0;

    const backgroundLayer = document.getElementById('background-layer');
    const characterLayer = document.getElementById('character-layer');
    const speakerName = document.getElementById('speaker-name');
    const dialogueText = document.getElementById('dialogue-text');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');

    function showScene(sceneIndex) {
        const scene = story[sceneIndex];

        // 배경 변경 로직 개선 - 현재 장면 또는 이전 장면의 배경을 찾아서 적용
        let currentBackground = scene.background;
        
        // 현재 장면에 배경이 없으면 이전 장면들을 역순으로 검색하여 가장 최근 배경 찾기
        if (!currentBackground) {
            for (let i = sceneIndex - 1; i >= 0; i--) {
                if (story[i].background) {
                    currentBackground = story[i].background;
                    break;
                }
            }
        }
        
        // 배경이 있으면 적용
        if (currentBackground) {
            backgroundLayer.style.backgroundImage = `url('${currentBackground}')`;
        }

        // 캐릭터 변경 - 화자에 따라 자동으로 캐릭터 이미지 설정
        characterLayer.innerHTML = ''; // 이전 캐릭터 이미지 제거
        
        // scene.character가 명시적으로 지정된 경우 사용
        if (scene.character) {
            const charImg = document.createElement('img');
            charImg.src = scene.character;
            characterLayer.appendChild(charImg);
        } 
        // speaker가 있는 경우 자동으로 캐릭터 이미지 매칭
        else if (scene.speaker) {
            let characterImage = null;
            
            // 화자에 따른 캐릭터 이미지 자동 설정
            if (scene.speaker === "[PLAYER_NAME]") {
                // 플레이어는 캐릭터 이미지 표시하지 않음 (1인칭 시점)
                characterImage = null;
            } else if (scene.speaker === "우주") {
                // 특정 대사에서는 우주 이미지 표시하지 않음
                if (scene.text === "회의실 2번…? 고마웠다고…? 편지…? 무슨 소리지…?") {
                    characterImage = null; // 이미지 표시하지 않음
                } else {
                    // 새로운 우주 이미지 사용
                    characterImage = 'https://github.com/Jong2E/Meyeon-Si/blob/main/%EB%82%A8%EC%A3%BC%201.png?raw=true';
                }
            } else if (scene.speaker === "설하") {
                // 새로운 배경 제거된 설하 이미지 사용
                characterImage = 'https://github.com/Jong2E/Meyeon-Si/blob/main/%EC%97%AC%EC%A3%BC_%EC%AA%BD%EC%A7%80-removebg-preview%201.png?raw=true';
            } else if (scene.speaker === "규빈(전화)") {
                // 규빈 전화 이미지 사용
                characterImage = 'https://github.com/Jong2E/Meyeon-Si/blob/main/%EB%82%A8%EA%B7%9C%EB%B9%88_%EC%A0%84%ED%99%94.png?raw=true';
            } else if (scene.speaker === "미소" || scene.speaker === "인포데스크 직원") {
                // 미소 캐릭터 이미지 (임시로 설하 이미지 사용)
                characterImage = 'https://github.com/Jong2E/Meyeon-Si/blob/main/%EC%97%AC%EC%A3%BC_%EC%AA%BD%EC%A7%80-removebg-preview%201.png?raw=true';
            }
            
            if (characterImage) {
                const charImg = document.createElement('img');
                charImg.src = characterImage;
                
                // 캐릭터별 개별 스타일 적용
                if (scene.speaker === "우주") {
                    // 우주는 1.1 크기로 조정하고 살짝 아래로 이동
                    charImg.style.transform = 'scale(1.1) translateY(3%)';
                    charImg.style.transformOrigin = 'bottom center';
                } else if (scene.speaker === "설하") {
                    // 설하는 기본 크기 유지하고 살짝 아래로 이동
                    charImg.style.transform = 'scale(1.5) translateY(5%)';
                    charImg.style.transformOrigin = 'bottom center';
                } else if (scene.speaker === "규빈(전화)") {
                    // 규빈 전화 이미지는 설하와 같은 위치에 1.0 크기로 표시
                    charImg.style.transform = 'scale(1.0) translateY(5%)';
                    charImg.style.transformOrigin = 'bottom center';
                }
                
                // 로컬 이미지 로드 실패 시 GitHub URL로 대체
                charImg.onerror = function() {
                    console.log('Local image failed, trying GitHub URL...');
                    if (scene.speaker === "우주") {
                        // 새로운 우주 이미지 URL
                        this.src = 'https://raw.githubusercontent.com/Jong2E/Meyeon-Si/main/%EB%82%A8%EC%A3%BC%201.png';
                    } else if (scene.speaker === "설하") {
                        // 새로운 배경 제거된 설하 이미지 URL
                        this.src = 'https://raw.githubusercontent.com/Jong2E/Meyeon-Si/main/%EC%97%AC%EC%A3%BC_%EC%AA%BD%EC%A7%80-removebg-preview%201.png';
                    } else if (scene.speaker === "규빈(전화)") {
                        // 규빈 전화 이미지 URL
                        this.src = 'https://raw.githubusercontent.com/Jong2E/Meyeon-Si/main/%EB%82%A8%EA%B7%9C%EB%B9%88_%EC%A0%84%ED%99%94.png';
                    }
                };
                
                charImg.onload = function() {
                    console.log('Character image loaded successfully');
                };
                
                characterLayer.appendChild(charImg);
            }
        }

        // 화자 이름 및 대사 업데이트 (동적 텍스트 적용)
        if (scene.speaker) {
            speakerName.textContent = getDynamicText(scene.speaker);
            speakerName.style.display = 'block';
        } else {
            speakerName.style.display = 'none'; // 화자 없으면 숨김 (나레이션)
        }
        
        dialogueText.textContent = getDynamicText(scene.text);
        
        // 미션 완료 체크
        if (scene.mission) {
            showMissionComplete(scene.mission);
        }
    }

    // 다음 장면으로 이동하는 함수
    function nextScene() {
        currentScene++;
        if (currentScene < story.length) {
            showScene(currentScene);
            updateButtonStates();
        } else {
            // 엔딩 처리
            dialogueText.textContent = "- The End -";
            nextButton.style.display = 'none';
            prevButton.style.display = 'block';
        }
    }

    // 이전 장면으로 이동하는 함수
    function prevScene() {
        if (currentScene > 0) {
            currentScene--;
            showScene(currentScene);
            updateButtonStates();
            
            // 엔딩에서 돌아온 경우 다음 버튼 다시 표시
            if (nextButton.style.display === 'none') {
                nextButton.style.display = 'block';
            }
        }
    }

    // 버튼 상태 업데이트 함수
    function updateButtonStates() {
        // 첫 번째 장면에서는 이전 버튼 비활성화
        if (currentScene === 0) {
            prevButton.disabled = true;
        } else {
            prevButton.disabled = false;
        }
    }

    // 클릭 이벤트
    nextButton.addEventListener('click', nextScene);
    prevButton.addEventListener('click', prevScene);

    // Enter 키 이벤트 추가
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // 시작 화면에서는 캐릭터 설정으로
            if (startScreen.style.display !== 'none') {
                showCharacterSetup();
            }
            // 캐릭터 설정 화면에서는 이미 playerNameInput 이벤트에서 처리
            // 게임 화면에서는 다음 장면으로
            else if (gameScreen.style.display !== 'none' && currentScene < story.length) {
                nextScene();
            }
        }
    });

    // 게임은 시작 화면에서 시작하므로 여기서는 초기 로드하지 않음
    // initializeGame()에서 호출됨
});
