import axios from 'axios';


let workTime = 0;
let breakTime = 0;
let timer;
let isWorking = true;
let isPaused = false;
let totalTime;
let elapsedTime = 0;  // 경과 시간 추적



// Start 버튼 클릭 이벤트
document.querySelector('.TimeBtn').addEventListener('click', startTimer);
document.querySelector('.StopBtn').addEventListener('click', toggleTimer);
document.querySelector('.ResetBtn').addEventListener('click', resetTimer);

function startTimer() {

  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('알림 권한이 허용되었습니다.');
      } else {
        console.log('알림 권한이 거부되었습니다.');
      }
    });
  }
  // 사용자 입력 받아오기
  workTime = parseInt(document.getElementById('w').value) * 60;  // work time (분 -> 초)
  breakTime = parseInt(document.getElementById('r').value) * 60; // break time (분 -> 초)
  
  // 유효성 검사
  if (isNaN(workTime) || isNaN(breakTime) || workTime <= 0 || breakTime <= 0) {
    alert('조건에 맞는 시간을 넣어주세요!');
    return;
  }

  totalTime = workTime;
  elapsedTime = 0;

  document.getElementById('pomodoro').style.display = "inline-block";
  document.getElementById('time-data').style.display = "none";
  
  // 타이머 시작
  document.querySelector('.time-text').textContent = `${Math.floor(workTime / 60)}:00`; // 작업 시간 표시
  timer = setInterval(countdown, 1000);
}

function countdown() {
  if (isWorking) {
    if (workTime > 0) {
      workTime--;
      elapsedTime++;
      document.querySelector('.time-text').textContent = `${Math.floor(workTime / 60)}:${workTime % 60}`;

      updateTimerAnimation(elapsedTime / totalTime);
    } else {
      isWorking = false;

      // Notification API로 알림 (work 시간이 끝났을 때)
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: '목표 시간이 끝났습니다. 휴식을 취하세요!',
        });
      }

      // Break 타이머 시작
      clearInterval(timer);
      setTimeout(startBreak, 1000);  // 1초 후 break 타이머 시작
    }
  } else {
    if (breakTime > 0) {
      breakTime--;
      elapsedTime++;
      document.querySelector('.time-text').textContent = `${Math.floor(breakTime / 60)}:${breakTime % 60}`;

      updateTimerAnimation2(elapsedTime / totalTime);
    } else {
      // Break 시간이 끝났을 때 알림
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: "휴식 시간이 끝났습니다. 새 목표를 정하세요!",
        });
      }

      isWorking = true;
      clearInterval(timer);
    }
  }
}

function startBreak() {
  totalTime = breakTime;
  elapsedTime = 0;
  timer = setInterval(countdown, 1000); // break 타이머 시작
}

// 타이머 애니메이션 (원형 배경을 채우는 함수)
function updateTimerAnimation(progress) {
  const rotation = progress * 360;  // 360도를 기준으로 진행률 계산
  document.querySelector('.timer').style.background = `conic-gradient(#7E6D53 ${rotation}deg, #ccc ${rotation}deg)`;
}

function updateTimerAnimation2(progress) {
  const rotation = progress * 360;  // 360도를 기준으로 진행률 계산
  document.querySelector('.timer').style.background = `conic-gradient(#4E7779 ${rotation}deg, #ccc ${rotation}deg)`;
}

function toggleTimer() {
  if (isPaused) {
    // 타이머가 멈춘 상태에서 RESTART 버튼을 누르면 타이머를 재시작
    document.querySelector('.StopBtn').textContent = "STOP";
    timer = setInterval(countdown, 1000);
    isPaused = false;
  } else {
    // 타이머가 진행 중일 때 STOP 버튼을 눌렀을 경우 타이머를 멈춤
    clearInterval(timer);
    document.querySelector('.StopBtn').textContent = "RESTART";
    isPaused = true;
  }
}

function resetTimer() {
  clearInterval(timer);
  document.querySelector('.time-text').textContent = "Set Time";
  isWorking = true;
  isPaused = false;  // 리셋하면 다시 시작할 준비 상태로 설정
  workTime = 0;
  breakTime = 0;
  document.getElementById('w').value = '';
  document.getElementById('r').value = '';
  document.querySelector('.StopBtn').textContent = "STOP";  // 버튼을 다시 "STOP"으로 변경
  document.getElementById('pomodoro').style.display = "none";
  document.getElementById('time-data').style.display = "block";
}

