const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏设置
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// 蛇的初始状态
let snake = [
    {x: 10, y: 10} // 蛇头位置
];
let snakeLength = 4; // 初始长度

// 食物位置
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};

// 移动方向
let dx = 0;
let dy = 0;

// 游戏状态
let score = 0;
let gameSpeed = 100; // 毫秒
let gameRunning = true;

// 键盘控制
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

// 游戏主循环
function gameLoop() {
    if (!gameRunning) return;
    
    setTimeout(() => {
        moveSnake();
        checkCollision();
        drawGame();
        gameLoop();
    }, gameSpeed);
}

// 移动蛇
function moveSnake() {
    // 添加新蛇头
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    // 如果吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 生成新食物
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        score += 10;
        // 每得50分增加速度
        if (score % 50 === 0 && gameSpeed > 50) {
            gameSpeed -= 5;
        }
    } else {
        // 没吃到食物则移除蛇尾
        snake.pop();
    }
}

// 碰撞检测
function checkCollision() {
    const head = snake[0];
    
    // 撞墙检测
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
    }
    
    // 撞自己检测
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束!', canvas.width/2, canvas.height/2 - 30);
    ctx.font = '20px Arial';
    ctx.fillText(`得分: ${score}`, canvas.width/2, canvas.height/2 + 20);
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });
    
    // 绘制食物
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    
    // 绘制分数
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText(`得分: ${score}`, 10, 20);
}

// 开始游戏
gameLoop();