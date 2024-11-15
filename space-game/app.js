function loadTexture(path) {
    return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
    resolve(img);
    };
    })
   }

   window.onload = async() => {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const heroImg = await loadTexture('assets/player.png')
    const enemyImg = await loadTexture('assets/enemyShip.png')
    const backImg = await loadTexture('assets/starBackground.png')

    ctx.fillStyle = ctx.createPattern(backImg,'repeat');
    ctx.fillRect(0,0, canvas.width, canvas.height);
    
    //메인 우주선
    ctx.drawImage(heroImg, canvas.width/2 - 45, canvas.height - (canvas.height/4));

   //보조 우주선
   ctx.drawImage(heroImg, canvas.width/2 + 65, canvas.height - (canvas.height/4) + 25, heroImg.width/2, heroImg.height/2);
   ctx.drawImage(heroImg, canvas.width/2 - 105, canvas.height - (canvas.height/4) + 25, heroImg.width/2, heroImg.height/2);

   //적
   //createEnemies(ctx, canvas, enemyImg);
   createEnemies2(ctx, canvas, enemyImg);
   };

   //적 함수
   function createEnemies(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    for (let x = START_X; x < STOP_X; x += enemyImg.width) {
    for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
    ctx.drawImage(enemyImg, x, y);
    }
    }
   }

   //적 함수2
   function createEnemies2(ctx, canvas, enemyImg) {
    const MONSTER_TOTAL = 5;

    const MONSTER_WIDTH = enemyImg.width;
    const MONSTER_HEIGHT = enemyImg.height;

    for (let i = 0; i < MONSTER_TOTAL; i++){
        const Row = MONSTER_TOTAL - i;

        const START_X = (canvas.width - (Row * MONSTER_WIDTH)) / 2;
        const y = i * MONSTER_HEIGHT;

        for(let j = 0; j < Row; j ++){
            const x = START_X + j * MONSTER_WIDTH;
            ctx.drawImage(enemyImg, x, y);
        }

    }}
   
   
   