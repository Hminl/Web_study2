(()=>{"use strict";let e,t,n=0,o=0,c=!0,r=!1,i=0;function l(){c?n>0?(n--,i++,document.querySelector(".time-text").textContent=`${Math.floor(n/60)}:${n%60}`,function(e){const t=360*e;document.querySelector(".timer").style.background=`conic-gradient(#7E6D53 ${t}deg, #ccc ${t}deg)`}(i/t)):(c=!1,"granted"===Notification.permission&&new Notification("Pomodoro Timer",{body:"목표 시간이 끝났습니다. 휴식을 취하세요!"}),clearInterval(e),setTimeout(d,1e3)):o>0?(o--,i++,document.querySelector(".time-text").textContent=`${Math.floor(o/60)}:${o%60}`,function(e){const t=360*e;document.querySelector(".timer").style.background=`conic-gradient(#4E7779 ${t}deg, #ccc ${t}deg)`}(i/t)):("granted"===Notification.permission&&new Notification("Pomodoro Timer",{body:"휴식 시간이 끝났습니다. 새 목표를 정하세요!"}),c=!0,clearInterval(e))}function d(){t=o,i=0,e=setInterval(l,1e3)}document.querySelector(".TimeBtn").addEventListener("click",(function(){"granted"!==Notification.permission&&Notification.requestPermission().then((e=>{"granted"===e?console.log("알림 권한이 허용되었습니다."):console.log("알림 권한이 거부되었습니다.")})),n=60*parseInt(document.getElementById("w").value),o=60*parseInt(document.getElementById("r").value),isNaN(n)||isNaN(o)||n<=0||o<=0?alert("조건에 맞는 시간을 넣어주세요!"):(t=n,i=0,document.getElementById("pomodoro").style.display="inline-block",document.getElementById("time-data").style.display="none",document.querySelector(".time-text").textContent=`${Math.floor(n/60)}:00`,e=setInterval(l,1e3))})),document.querySelector(".StopBtn").addEventListener("click",(function(){r?(document.querySelector(".StopBtn").textContent="STOP",e=setInterval(l,1e3),r=!1):(clearInterval(e),document.querySelector(".StopBtn").textContent="RESTART",r=!0)})),document.querySelector(".ResetBtn").addEventListener("click",(function(){clearInterval(e),document.querySelector(".time-text").textContent="Set Time",c=!0,r=!1,n=0,o=0,document.getElementById("w").value="",document.getElementById("r").value="",document.querySelector(".StopBtn").textContent="STOP",document.getElementById("pomodoro").style.display="none",document.getElementById("time-data").style.display="block"}))})();