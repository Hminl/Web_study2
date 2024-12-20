class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }
    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload));
        }
    }

    clear() {
        this.listeners = {};
    }
}

class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;     // 객체가 파괴되었는지 여부
        this.type = "";        // 객체 타입 (영웅/적)
        this.width = 0;        // 객체의 폭
        this.height = 0;       // 객체의 높이
        this.img = undefined;  // 객체의 이미지
    }

    rectFromGameObject() {
        return {
            top: this.y,
            left: this.x,
            bottom: this.y + this.height,
            right: this.x + this.width,
        };
    }


    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // 캔버스에 이미지 그리기
    }
}

class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 99;
        this.height = 75;
        this.type = 'Hero';
        this.cooldown = 0; // 초기화
        this.life = 3;
    }
    fire() {
        if (this.canFire()) { // 쿨다운 확인
            gameObjects.push(new Laser(this.x + 45, this.y - 10)); // 레이저 생성
            this.cooldown = 500; // 쿨다운 500ms 설정
            let id = setInterval(() => {
                if (this.cooldown > 0) {
                    this.cooldown -= 100;
                } else {
                    clearInterval(id); // 쿨다운 완료 후 타이머 종료
                }
            }, 100);
        }
    }
    canFire() {
        return this.cooldown === 0; // 쿨다운 상태 확인
    }

    decrementLife() {
        this.life--;
        if (this.life === 0) {
            this.dead = true;
        }
        if (this.life === 1) {
            this.img = damageHimg;
        }
    }

    incrementPoints() {
        points += 100;
    }

}

class HeroSub extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 55;
        this.height = 35;
        this.type = 'Hero';
        this.cooldown = 0; // 초기화
    }
    fire() {
        gameObjects.push(new Laser(this.x + 25, this.y - 10)); // 레이저 생성

    }

}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.type = "Enemy";
        // 적 캐릭터의 자동 이동 (Y축 방향)
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5;  // 아래로 이동
            } else {
                console.log('Stopped at', this.y);
                clearInterval(id); // 화면 끝에 도달하면 정지
            }
        }, 300);
    }
    Dead() {
        this.img = ShotImg;
        setTimeout(() => {
            this.dead = true;
        }, 200);
    }
}

class Boss extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 91;
        this.height = 91;
        this.type = "Enemy";
        this.life = 20;
        let id = setInterval(() => attackMeteor(), 5000);
    }

    Dead() {
        this.life -= 1;
        if (this.life === 0) {
            this.img = ShotImg;
            setTimeout(() => {
                this.dead = true;
            }, 200);
            clearInterval(attackMeteor());
        }

    }
}

class Laser extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 9), (this.height = 33);
        this.type = 'Laser';
        this.img = laserImg;
        let id = setInterval(() => {
            if (this.y > 0) {
                this.y -= 15;
            } else {
                this.dead = true;
                clearInterval(id);
            }
        }, 100)
    }
}

class Meteor extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 30;
        this.height = 30;
        this.type = 'Meteor';
        let id = setInterval(() => {
            if (this.y < canvas.height) {
                this.y += 5;  // 아래로 이동
            } else {
                console.log('Stopped at', this.y);
                this.dead = true;
                clearInterval(id); // 화면 끝에 도달하면 정지
            }
        }, 200);
    }
}

let onKeyDown = function (e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 37: // 왼쪽 화살표
        case 39: // 오른쪽 화살표
        case 38: // 위쪽 화살표
        case 40: // 아래쪽 화살표
        case 32: // 스페이스바
            e.preventDefault();
            break;
        default:
            break;
    }
};
window.addEventListener('keydown', onKeyDown);

window.addEventListener("keyup", (evt) => {
    if (evt.key === "ArrowUp") {
        eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
        eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
        eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
        eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    } else if (evt.keyCode === 32) {
        eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    } else if (evt.key === "Enter") {
        eventEmitter.emit(Messages.KEY_EVENT_ENTER);
    }
});

const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
    GAME_END_LOSS: "GAME_END_LOSS",
    GAME_END_WIN: "GAME_END_WIN",
    GAME_STAGE_END: "GAME_STAGE_END",
    KEY_EVENT_ENTER: "KEY_EVENT_ENTER",

};

let heroImg, enemyImg, laserImg, ShotImg, lifeImg, bossImg, damageHimg,
    canvas, ctx, gameLoopId, stageCount,
    gameObjects = [], hero, boss, meteor, enemy,
    stagesEnemy = [stage1enemy, stage2enemy, stage3enemy, stageboss],
    points = 0;
    eventEmitter = new EventEmitter();

function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            resolve(img);
        };
    })
}

function intersectRect(r1, r2) {
    return !(
        r2.left > r1.right || // r2가 r1의 오른쪽에 있음
        r2.right < r1.left || // r2가 r1의 왼쪽에 있음
        r2.top > r1.bottom || // r2가 r1의 아래에 있음
        r2.bottom < r1.top // r2가 r1의 위에 있음
    );
}




function initGame(stageCount) {
    gameObjects = [];
    stagesEnemy[stageCount]();
    //createEnemies();
    createHero();
    createHeroSub();
    let id = setInterval(() => herosub.fire(), 1000);
    let id2 = setInterval(() => herosub2.fire(), 1000);
    herosub.fire();
    herosub2.fire();
    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -= 10;
        herosub.y -= 10;
        herosub2.y -= 10;
    })
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += 10;
        herosub.y += 10;
        herosub2.y += 10;
    });
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= 10;
        herosub.x -= 10;
        herosub2.x -= 10;
    });
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += 10;
        herosub.x += 10;
        herosub2.x += 10;
    });
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        if (hero.canFire()) {
            hero.fire();
        }
    });
    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
        first.dead = true;
        second.Dead();
        hero.incrementPoints();
        if (isEnemiesDead()) {
            // 스테이지 완료 이벤트 발행 (payload 없음)
            eventEmitter.emit(Messages.GAME_END_WIN);
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
        enemy.dead = true;
        hero.decrementLife();
        if (isHeroDead()) {
            eventEmitter.emit(Messages.GAME_END_LOSS);
            return; // loss before victory
        }
        if (isEnemiesDead()) {
            eventEmitter.emit(Messages.GAME_END_WIN);

        }

    });

    eventEmitter.on(Messages.COLLISION_METEOR_HERO, (_, { meteor }) => {
        meteor.dead = true;
        hero.decrementLife();
        if (isHeroDead()) {
            eventEmitter.emit(Messages.GAME_END_LOSS);
            return; // loss before victory
        }
    });



    eventEmitter.on(Messages.GAME_END_WIN, () => {
        endGame(true, stageCount);
    });

    eventEmitter.on(Messages.GAME_END_LOSS, () => {
        endGame(false, stageCount);
    });



}

window.onload = async () => {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    heroImg = await loadTexture("assets/player.png");
    enemyImg = await loadTexture("assets/enemyShip.png");
    laserImg = await loadTexture("assets/laserRed.png");
    ShotImg = await loadTexture("assets/laserGreenShot.png");
    lifeImg = await loadTexture("assets/life.png");
    damageHimg = await loadTexture("assets/playerDamaged.png");
    bossImg = await loadTexture("assets/enemyUFO.png");
    meteorImg = await loadTexture("assets/meteorSmall.png");
    //pattern = ctx.createPattern(await loadTexture("assets/starBackground.png"), "repeat");

    stageCount = 0;
    initGame(stageCount);
    gameLoopId = setInterval(standardGameloop, 100);
};

function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));
}

function updateGameObjects() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy");
    const lasers = gameObjects.filter((go) => go.type === "Laser");
    const meteors = gameObjects.filter((go) => go.type === "Meteor");
    lasers.forEach((l) => {
        enemies.forEach((m) => {
            if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
                    first: l,
                    second: m,
                });
            }
        });
    });

    enemies.forEach(enemy => {
        const heroRect = hero.rectFromGameObject();
        if (intersectRect(heroRect, enemy.rectFromGameObject())) {
            eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
        }
    })
    meteors.forEach(meteor => {
        const heroRect = hero.rectFromGameObject();
        if (intersectRect(heroRect, meteor.rectFromGameObject())) {
            eventEmitter.emit(Messages.COLLISION_METEOR_HERO, { meteor });
        }
    })


    gameObjects = gameObjects.filter((go) => !go.dead);
}

// 라이프 표시 그리기
function drawLife() {
    const START_POS = canvas.width;
    for (let i = hero.life; i > 0; i--) {
        ctx.drawImage(lifeImg, START_POS - (45 * (i)), canvas.height - 37);
    }
}

function drawPoints() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    drawText("Points: " + points, 10, canvas.height - 20);
}

// 텍스트 그리기
function drawText(message, x, y) {
    ctx.fillText(message, x, y);
}

// 영웅 사망 판정
function isHeroDead() {
    return hero.life <= 0;
}

// 화면 중앙에 메시지를 띄우는 메서드.
function displayMessage(message, color = "red") {
    ctx.font = "30px Arial";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function standardGameloop() {
    // 화면 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 게임 객체 그리기
    drawGameObjects(ctx);
    // 게임 객체 업데이트. 이 메서드 내에서 충돌 감지가 작동하고 있음.
    updateGameObjects();
    drawPoints();
    drawLife();

    if (isEnemiesDead()) eventEmitter.emit(Messages.GAME_END_WIN);
}


function endGame(win, stageCount) {
    clearInterval(gameLoopId);
    // 게임 화면이 겹칠 수 있으니, 200ms 지연
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (win && stageCount === 3) {
            displayMessage(
                "Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew"
            );
            eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
                stageCount = 0;
                points = 0;
                resetGame(stageCount);
            });
        } else if (win && stageCount < 3) {
            displayMessage(
                "Stage Clear! Press [Enter] to start next stage"
            );
            eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
                stageCount++;
                resetGame(stageCount);
            });
        } else if (!win) {
            displayMessage(
                "You died !!! Press [Enter] to start a new game Captain Pew Pew"
            );
            eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
                stageCount = 0;
                points = 0;
                resetGame(stageCount);
            });
        }
    }, 200)
}

function resetGame(stageCount) {
    if (gameLoopId) { clearInterval(gameLoopId); } // 게임 루프 중지, 중복 실행 방지}
    eventEmitter.clear(); // 모든 이벤트 리스너 제거, 이전 게임 세션 충돌 방지
    initGame(stageCount); // 게임 초기 상태 실행
    gameLoopId = setInterval(standardGameloop, 100);

}

function isEnemiesDead() {
    const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
    return enemies.length === 0;
}

function createHero() {
    hero = new Hero(
        canvas.width / 2 - 45,
        canvas.height - canvas.height / 4
    );
    hero.img = heroImg;
    gameObjects.push(hero);
}

function createHeroSub() {
    herosub = new HeroSub(
        canvas.width / 2 - 105,
        canvas.height - (canvas.height / 4) + 25
    );

    herosub2 = new HeroSub(
        canvas.width / 2 + 60,
        canvas.height - (canvas.height / 4) + 25
    )

    herosub2.img = heroImg;
    herosub.img = heroImg;
    gameObjects.push(herosub2);
    gameObjects.push(herosub);
}

function stage1enemy() {
    const MONSTER_TOTAL = 1;
    const MONSTER_WIDTH = MONSTER_TOTAL * 98;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;

    for (let x = START_X; x < STOP_X; x += 98) {
        for (let y = 0; y < 50 * 5; y += 50) {
            const enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
        }
    }
}

// 삼각형 배치
function stage2enemy() {
    const MONSTER_TOTAL = 5;
    for (let i = 0; i < MONSTER_TOTAL; i++) {
        const row = MONSTER_TOTAL - i;
        const startX = (canvas.width - row * 98) / 2;
        for (let j = 0; j < row; j++) {
            const x = startX + j * 98;
            const y = i * 50;
            const enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
        }
    }
}

// 물결 형태 배치
function stage3enemy() {
    const MONSTER_TOTAL = 10;
    for (let i = 0; i < MONSTER_TOTAL; i++) {
        const x = (canvas.width / MONSTER_TOTAL) * i;
        const y = Math.sin(i * 0.5) * 40 + 50;
        const enemy = new Enemy(x, y);
        enemy.img = enemyImg;
        gameObjects.push(enemy);
    }
}

function stageboss() {
    boss = new Boss((canvas.width - bossImg.width) / 2, (canvas.height - bossImg.height) / 4);
    boss.img = bossImg;
    gameObjects.push(boss);
}

function attackMeteor() {
    meteor = new Meteor(
        Math.random() * (canvas.width - 50), // 랜덤 x 좌표
        0 // 화면 밖에서 떨어지기 시작
    )
    meteor.img = meteorImg;
    gameObjects.push(meteor);
}

function createEnemies2(ctx, canvas, enemyImg) {
    MONSTER_TOTAL = 5;
    let MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
    let START_X = (canvas.width - MONSTER_WIDTH) / 2;
    let STOP_X = START_X + MONSTER_WIDTH;

    for (let y = 0; y < enemyImg.height * 5; y += enemyImg.height) {
        for (let x = START_X; x < STOP_X; x += enemyImg.width) {
            ctx.drawImage(enemyImg, x, y);
        }
        START_X += enemyImg.width * 0.5;
        STOP_X -= enemyImg.width * 0.5;
    }

}

