let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext('2d')
    // 캔버스 호출 및 2D 드로잉 객체 호출

    var x = canvas.width/2;
    var y = canvas.height-30;
    var dx=1.5;
    var dy=-1.5;
    // 공의 좌표 x,y 값과 매 프레임마다 변화를 주는 미소 dx, dy 값 할당
    var ballRadius = 10;
    // 공의 반지름을 변수로 선언
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width-paddleWidth)/2;
    // 패들의 높이와 너비 선언 및 패들의 x좌표 시작점 정의
    var rightPressed = false;
    var leftPressed = false;
    // 키 업&다운 감지를 위해 변수로 false 값 할당

    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    // 벽돌의 세팅값 선언

    var bricks = [];
    for (var c=0; c<brickColumnCount; c++){
        bricks[c] = [];
        for (var r=0; r<brickRowCount; r++){
            bricks[c][r] = { x:0, y:0, status:1};
        }
    }
    // 벽돌을 2차원 배열로 구성해 x,y좌표와 충돌을 감지하는 status의 값들을 객체로 넣어줌

    var score = 0;
    // 점수값

    function drawBall(){
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    // Ball을 매 프레임마다 그려주는 함수
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    // 패들을 그려주는 함수
    function drawBricks() {
        for (var c=0; c<brickColumnCount; c++){
            for (var r=0; r<brickRowCount; r++){
                if (bricks[c][r].status == 1){
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath;
                }
            }
        }
    }
    // 충돌이 없을 경우 각 위치의 벽돌을 반복문을 통해 그려주는 함수
    function collisionDetection() {
        for (var c=0; c<brickColumnCount; c++){
            for (var r=0; r<brickRowCount; r++){
                var b = bricks[c][r];
                if(b.status==1){
                    if(x>b.x && x<(b.x+brickWidth) && y>b.y && y<b.y+brickHeight){
                        dy=-dy;
                        b.status=0;
                        score++;
                        if(score == brickColumnCount * brickRowCount) {
                            alert("You win, Congratulations!!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
    // 벽돌이 충돌했는지 검사하는 함수
    // 공의 x좌표와 y좌표를 벽돌의 x,y 값과 비교해 충돌이 일어나면 status 값을 0으로 할당
    function drawScore(){
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Score: ' + score, 8, 20);
        }

    function draw(){
        ctx.clearRect(0,0,canvas.width, canvas.height);

        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();

        x += dx;
        y += dy;

        if (y+dy < ballRadius ){
            dy = -dy;
        } else if (y+dy > canvas.height-ballRadius){
            if(x > paddleX && x < paddleX + paddleWidth){
                dy = -(1.1*dy);
                dx = 1.1*dx  ;
            }
            else {
            alert('GAME OVER');
            document.location.reload();
            }
        }
        if (x+dx < ballRadius || x+dx > canvas.width-ballRadius){
            dx = -dx;
        }
        // 공이 canvas를 벗어나면 작동하는 조건문 + 공이 패들에 닿으면 게임 over되지 않고 튕겨나가는 조건문
        
        if(rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 3;
        }
        else if(leftPressed && paddleX > 0 ) {
            paddleX += -3;
        }
        // 왼쪽, 오른쪽 방향키를 누르면 그 이벤트를 받아 패들이 좌우로 이동하는 조건문
        requestAnimationFrame(draw);
        
    }
    // 매 프레임마다 그려지는 공이 움직이게 보이기 위해 이전 프레임에 그려진 공을 삭제하고, 
    // 미소 dx,dy값을 부여해 매 프레임마다 위치를 변환.

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    // 키가 down or up 되면 작동하는 eventlistner 호출
    document.addEventListener("mousemove", mouseMoveHandler, false);
    // 마우스 움직임이 발생하면 작동하는 함수

    function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
    }
    function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
    }
    // eventlistener의 callback 함수 
    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    draw();
    // 1 밀리세컨드 마다 callback함수가 작동하게 하는 함수. setinterval 을 사용하다가
    // draw 함수안에 requestAnimationFrame함수를 넣어서 훨씬 더 부드럽게 작동이 가능
    // Game over가 되었을 때, setinterval함수를 종료하기 위해 setInterval을 변수로 선언 