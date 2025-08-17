document.addEventListener('DOMContentLoaded', () => {
    const story = [
        // 1. 철산 맥도날드 씬
        { background: 'https://github.com/Jong2E/Meyeon-Si/blob/5d404ae95dad2276f134eda9bc0f87f4c644429a/%EC%B2%A0%EC%82%B0%20%EB%A7%A5%EB%8F%84%EB%82%A0%EB%93%9C.png?raw=true', speaker: "우주", text: "아니, 남규빈 언제 오는 거야? ㅡㅡ" },
        { text: "전화벨이 울리고, 우주가 전화를 받는다." },
        { speaker: "우주", text: "야 너 어디야? 언제 와??" },
        { speaker: "규빈(전화)", text: "야, 미안. 오늘은 못 갈 거 같아. 갑자기 집에 일 생겨서." },
        { speaker: "우주", text: "뭐? 공간 예약까지 다 해놨는데? 밴드실 그냥 버리라고?" },
        { speaker: "규빈(전화)", text: "다음에 두 배로 할게. 진짜 미안하다." },
        { speaker: "우주", text: "하… 알았어. 근데 이 시간에 나 혼자 밴드실 가면 좀 웃기잖아." },
        { speaker: "규빈(전화)", text: "네가 뭐, 혼자 노래라도 하다 와." },
        { text: "우주는 투덜거리면서도 결국 짐을 챙겨 청년동으로 향했다." },

        // 2. 청년동 도착 – 로비 씬
        { background: 'https://github.com/Jong2E/Meyeon-Si/blob/main/%EC%B2%AD%EB%85%84%EB%8F%99%20%EB%A1%9C%EB%B9%84.jpg?raw=true', text: "엘리베이터 문이 열리자 넓고 조용한 로비가 보인다." },
        { background: 'https://github.com/Jong2E/Meyeon-Si/blob/main/%EC%B2%AD%EB%85%84%EB%8F%99%20%EB%A1%9C%EB%B9%84.jpg?raw=true', speaker: "우주", text: "오랜만이네… 진짜 몇 달 만이지?" },
        { background: 'https://github.com/Jong2E/Meyeon-Si/blob/main/%EC%B2%AD%EB%85%84%EB%8F%99%20%EB%A1%9C%EB%B9%84.jpg?raw=true', text: "로비 한쪽에 인포데스크와 휴게 공간이 보이지만 사람은 거의 없다." },
        { background: 'https://github.com/Jong2E/Meyeon-Si/blob/main/%EC%B2%AD%EB%85%84%EB%8F%99%20%EC%82%AC%EB%AC%BC%ED%95%A8.jpg?raw=true', text: "우주는 사물함이 있는 구역으로 이동했다." },

        // 3. 사물함 씬
        { text: "사물함 구역에 도착한 우주가 자기 사물함 문을 열자, 안에 접힌 쪽지가 있다." },
        { background: 'https://github.com/Jong2E/Meyeon-Si/blob/main/%EC%82%AC%EB%AC%BC%ED%95%A8_%EC%AA%BD%EC%A7%80.png?raw=true', text: "“우주야, 지난번에 도와줘서 고마웠어. 그거 보답하고 싶은데, 회의실 2번으로 와줄 수 있어? 내가 너한데 줄 편지를 적어놨어…!”" },
        { speaker: "우주", text: "회의실 2번…? 고마웠다고…? 편지…? 무슨 소리지…?" },
        { text: "우주는 호기심에 회의실 2번으로 향했다." },

        // 4. 회의실 2번 씬
        { text: "우주가 문을 열고 회의실 2번으로 들어갔다." },
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
        { text: "냉장고 앞에 선 우주와 설하." },
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
        { text: "스페이스 D에 도착하니, 문이 살짝 열려 있다." },
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

    function showScene(sceneIndex) {
        const scene = story[sceneIndex];

        // 배경 변경 (필요한 경우)
        if (scene.background) {
            backgroundLayer.style.backgroundImage = `url('${scene.background}')`;
        }

        // 캐릭터 변경 (필요한 경우)
        characterLayer.innerHTML = ''; // 이전 캐릭터 이미지 제거
        if (scene.character) {
            const charImg = document.createElement('img');
            charImg.src = scene.character;
            characterLayer.appendChild(charImg);
        }

        // 화자 이름 및 대사 업데이트
        if (scene.speaker) {
            speakerName.textContent = scene.speaker;
            speakerName.style.display = 'block';
        } else {
            speakerName.style.display = 'none'; // 화자 없으면 숨김 (나레이션)
        }
        
        dialogueText.textContent = scene.text;
    }

    nextButton.addEventListener('click', () => {
        currentScene++;
        if (currentScene < story.length) {
            showScene(currentScene);
        } else {
            // TODO: 엔딩 처리
            dialogueText.textContent = "- The End -";
            nextButton.style.display = 'none';
        }
    });

    // 초기 장면 로드
    showScene(0);
});
