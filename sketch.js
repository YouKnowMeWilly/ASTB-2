//enums object assigns names to values used throught the program for easier readability
const enums = {
    //TRUE and FALSE enums are defined as 0 and 1
    //because many options in the settings use sliders as boolean switches
    //Sliders take 2 numbers as arguments, so rather than true and false they use 0 and 1 as boolean values
    TRUE: 1,
    FALSE: 0,
    menu: {
        START: 0,
        PLAY: 1,
        INSTRUCT: 2,
        SETTINGS_1: 3,
        SETTINGS_2: 4,
        GAME_OVER: 5
    },
    ear: {
        RIGHT: 0,
        LEFT: 1
    },
    input: {
        l: 76,
        MOUSE_R: "MOUSE_right",
        MOUSE_L: "MOUSE_left",
        NONE: "NONE"
    }
};

let leftEarSounds;
let rightEarSounds;
let leftEarReactSounds;
let rightEarReactSounds;

//Jantzen:
let x, y, r, r2, r3;
let squareX = 400;
let squareY = 400;
let barX, barY;
let throtY;

let menuOption = enums.menu.START;

let curDist = 0;
let runningAvg = 0;
let runningTotal = 0;
let throtCurDist = 0;
let throtRunningAvg = 0;
let throtRunningTotal = 0;
let samples = 0;

//Default game time
let timer = 200;
let timeBuffer = timer;

let ax = 0;
let ay = 0;
let vx = 5;
let vy = 5;
let vMul = 0.3;
let aThrottle = 0;
let vThrottle = 5;
let throttleMul = 0.5 * 0.75;
let vThrottleMax = 9;
let vTargetMax = 9;

let audioCues = enums.FALSE;
let musicToggle = 0;

let haveInitSetting = 0;

let cueTotal = 0;
let cueCorrect = 0;
let cueState = 0;
let dontReact = 0;
let needClick = 0;

let firstStart = true;


//Ear to play first cue in
let cueEar = Math.round(Math.random());

//Whether the game is currently running or not
let ingame = false;

//Whether to enable debug text on the game screen
let debugToggle = enums.TRUE;

//Variable stores the key code of the last input the user entered
let lastInput = 'NONE';
let currentInput = "NONE";

//Whether the game needs to announce the first ear to listen to
let announcedFirstEar = enums.FALSE;

//Interval(in seconds) of how often to swap listening ears
let earSwapInterval = 10;

//Interval(in seconds) of how often to play a cue
let cueInterval = 5;

//Stores the number of frames since clicking play
let playTimeFrames = 0;

//Variables counting cues
let totalCues = 0;
let hitCues = 0;
let missedCues = 0;
let cueReactTimer = 0;




function preload () {

    alertLeft = loadSound('assets/left.mp3');
    alertRight = loadSound('assets/right.mp3');

    earSwitchAlert = [alertRight, alertLeft];

    soundFormats('wav', 'mp3');
    menuSound = loadSound('assets/music.mp3');
    startSound = loadSound('assets/misc_menu_4.wav');

    jet = loadImage("Yellow_jet.png");
    target = loadImage("Navy_target.png");
    greenTarget = loadImage("assets/Green_target.png");
    blueAngel = loadImage('assets/blue_angel.png');
    blueAngelFlipped = loadImage('assets/blue_angel_flipped.png');
    keyMap = loadImage('assets/keyMap.PNG');

    swapRight = loadSound('assets/right.mp3');
    swapLeft = loadSound('assets/left.mp3');
    emergencySound = loadSound('assets/emergency.mp3');

    oneLeft = loadSound('assets/1_Left.mp3');
    oneRight = loadSound('assets/1_Right.mp3');
    twoLeft = loadSound('assets/2_Left.mp3');
    twoRight = loadSound('assets/2_Right.mp3');
    threeLeft = loadSound('assets/3_Left.mp3');
    threeRight = loadSound('assets/3_Right.mp3');
    fourLeft = loadSound('assets/4_Left.mp3');
    fourRight = loadSound('assets/4_Right.mp3');
    fiveLeft = loadSound('assets/5_Left.mp3');
    fiveRight = loadSound('assets/5_Right.mp3');
    sixLeft = loadSound('assets/6_Left.mp3');
    sixRight = loadSound('assets/6_Right.mp3');
    sevenLeft = loadSound('assets/7_Left.mp3');
    sevenRight = loadSound('assets/7_Right.mp3');
    eightLeft = loadSound('assets/8_Left.mp3');
    eightRight = loadSound('assets/8_Right.mp3');
    nineLeft = loadSound('assets/9_Left.mp3');
    nineRight = loadSound('assets/9_Right.mp3');

    aLeft = loadSound('assets/A_Left.mp3');
    aRight = loadSound('assets/A_Right.mp3');
    bLeft = loadSound('assets/B_Left.mp3');
    bRight = loadSound('assets/B_Right.mp3');
    cLeft = loadSound('assets/C_Left.mp3');
    cRight = loadSound('assets/C_Right.mp3');
    dLeft = loadSound('assets/D_Left.mp3');
    dRight = loadSound('assets/D_Right.mp3');
    eLeft = loadSound('assets/E_Left.mp3');
    eRight = loadSound('assets/E_Right.mp3');
    fLeft = loadSound('assets/F_Left.mp3');
    fRight = loadSound('assets/F_Right.mp3');

    leftEarSounds = [twoLeft, fourLeft, sixLeft, eightLeft, oneLeft, threeLeft, fiveLeft, sevenLeft, nineLeft, aLeft, bLeft, cLeft, dLeft, eLeft, fLeft];
    rightEarSounds = [twoRight, fourRight, sixRight, eightRight, oneRight, threeRight, fiveRight, sevenRight, nineRight, aRight, bRight, cRight, dRight, eRight, fRight];

    leftEarReactSounds = [twoLeft, fourLeft, sixLeft, eightLeft];
    rightEarReactSounds = [oneRight, threeRight, fiveRight, sevenRight, nineRight];

}

function setup () {
    createCanvas(windowWidth, windowHeight);
    fullscreen(1);
    fancyFont = loadFont('assets/HighlandGothicFLF.ttf');
    textFont(fancyFont, 50);
    x = width / 2;
    y = height / 2;
    r = random(3, 6);
    r2 = random(3, 6);
    r3 = random(2, 5);
    barX = 50;
    barY = windowHeight - 400;
    throtY = windowHeight - 150;

    if(!!navigator.getGamepads()) {
        console.log("KUUUURRRP");
        console.log(navigator.getGamepads());
    }
}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight);
}

function startMenu () {
    totalCues = 0;
    playTimeFrames = 0;
    timer = timeBuffer;
    lastInput = 'NONE';
    announcedFirstEar = false;
    ingame = false;
    keyCode = DELETE;
    textAlign(LEFT);
    exitPointerLock();
    cursor();
    fill('black');
    rect(windowWidth / 2 - 100, windowHeight / 2 - 200, 200, 75);
    rect(windowWidth / 2 - 100, windowHeight / 2 - 100, 200, 75);
    rect(windowWidth / 2 - 100, windowHeight / 2 - 0, 200, 75);
    stroke('#013993');
    strokeWeight(3);
    fill('#e4ac00');
    textSize(45);
    text("Jantzen and Mike's ASTB trainer... 'as real as it gets!'", windowWidth / 2 - 615, 100);

    if(mouseX > windowWidth / 2 - 100 && mouseX < windowWidth / 2 + 100) {
        if(mouseY > windowHeight / 2 - 200 && mouseY < windowHeight / 2 - 125) {
            fill('#e4ac00');
            rect(windowWidth / 2 - 100, windowHeight / 2 - 200, 200, 75);
        }
        else if(mouseY > windowHeight / 2 - 100 && mouseY < windowHeight / 2 - 25) {
            fill('#e4ac00');
            rect(windowWidth / 2 - 100, windowHeight / 2 - 100, 200, 75);
        }
        else if(mouseY > windowHeight / 2 - 0 && mouseY < windowHeight / 2 + 75) {
            fill('#e4ac00');
            rect(windowWidth / 2 - 100, windowHeight / 2 - 0, 200, 75);
        }
    }

    textSize(50 - 15);
    text('START', windowWidth / 2 - 67, windowHeight / 2 - 145);
    textSize(45 - 15);
    text('SETTINGS', windowWidth / 2 - 82, windowHeight / 2 + 55);
    textSize(40 - 18);
    text('INSTRUCTIONS', windowWidth / 2 - 90, windowHeight / 2 - 50);
    text('Laptop users: zoom your browser out to 67%', windowWidth / 2 - 240, windowHeight / 2 + 150);
    text('Press F11 to go fullscreen', windowWidth / 2 - 140, windowHeight / 2 + 215);
    image(blueAngelFlipped, windowWidth / 2 - 1000, 300);
    image(blueAngel, windowWidth / 2 + 140, 300);

    menuSound.setVolume(0.10, 0.25);

    if(!menuSound.isPlaying() && musicToggle == 1) {
        menuSound.play();
    }

}

function mouseClicked () {
    if(menuOption == enums.menu.START) {

        if(mouseX > windowWidth / 2 - 100 && mouseX < windowWidth / 2 + 100) {
            if(mouseY > windowHeight / 2 - 200 && mouseY < windowHeight / 2 - 125) {
                menuOption = enums.menu.PLAY;
                timer = timeBuffer;
                startSound.play();
            }
            else if(mouseY > windowHeight / 2 - 100 && mouseY < windowHeight / 2 - 25) {
                menuOption = enums.menu.INSTRUCT;
            }
            else if(mouseY > windowHeight / 2 - 0 && mouseY < windowHeight / 2 + 75) {
                menuOption = enums.menu.SETTINGS_1;
            }
        }
    }
    if(menuOption == enums.menu.SETTINGS_1) {
        if(mouseX > windowWidth - 210 && mouseX < windowWidth + 210) {
            if(mouseY > windowHeight / 2 - 340 && mouseY < windowHeight / 2 - 265) {
                menuOption = enums.menu.SETTINGS_2;
            }
        }
    }

}

function gameOver () {
    totalCues = 0;
    playTimeFrames = 0;
    lastInput = 'NONE';
    announcedFirstEar = false;
    ingame = false;
    textAlign(CENTER);
    textSize(100);
    text("Game Over", windowWidth / 2, windowHeight / 2 - 300);
    textSize(40);
    text("Your average distance from the target was: " + round(runningAvg), windowWidth / 2, windowHeight / 2 + 0);
    text("Your average distance from the throttle target was: " + round(throtRunningAvg), windowWidth / 2, windowHeight / 2 + 100);
    text("Try to get your scores as low as possible", windowWidth / 2, windowHeight / 2 + 200);
    text("Press backspace to return to the menu", windowWidth / 2, windowHeight / 2 + 300);
    if(audioCues == enums.TRUE) {
        text("You got " + cueCorrect + "/" + cueTotal + " cues correct", windowWidth / 2, windowHeight / 2 - 100);
    }
    if(keyCode == BACKSPACE) {
        throtRunningAvg = 0;
        runningAvg = 0;
        cueCorrect = 0;
        cueTotal = 0;
        keyCode = DELETE;
        clear();
        menuOption = enums.menu.START;
    }

}

function instructMenu () {
    ingame = false;
    image(keyMap, 420, -50);
    textSize(27);
    textAlign(CENTER);
    text("Goal: Align your plane with the target using the mouse,", windowWidth / 2, windowHeight / 2 - 100);
    text(" while aligning your throttle with the target using the 'w' and 's' keys", windowWidth / 2, windowHeight / 2 - 60);
    text("If you have audio cue training on (headphones required), there are 2 more controls:", windowWidth / 2, windowHeight / 2 + 0);
    textSize(20);
    text("1. Press 'e' when you hear an EVEN number in your LEFT ear", windowWidth / 2, windowHeight / 2 + 50);
    text("2. RIGHT click when you hear an ODD number in your RIGHT ear", windowWidth / 2, windowHeight / 2 + 100);
    textSize(30);
    text("Press Backspace to return", windowWidth / 2, windowHeight / 2 + 250);

    if(keyCode == BACKSPACE) {
        keyCode = DELETE;

        clear();
        menuOption = enums.menu.START;
    }
}

function settingsMenu () {
    //button to next settings page
    exitPointerLock();
    cursor();
    fill('black');
    rect(windowWidth - 210, windowHeight - (windowHeight - 10), 200, 75);

    if(mouseX > windowWidth - 210 && mouseX < windowWidth + 210) {
        if(mouseY > windowHeight / 2 - 340 && mouseY < windowHeight / 2 - 265) {
            fill('#e4ac00');
            rect(windowWidth - 210, windowHeight - (windowHeight - 10), 200, 75);
        }
    }

    fill('#e4ac00');
    textSize(50 - 15);
    text('MORE', windowWidth - 110, windowHeight - (windowHeight - 60));

    ingame = false;
    if(haveInitSetting == 0) {
        throtSlider = createSlider(5, 15, vThrottleMax);
        throtSlider.position(windowWidth / 2 - 100, 130);
        throtSlider.size(200);
        targetSlider = createSlider(5, 15, vTargetMax);
        targetSlider.position(windowWidth / 2 - 100, 230);
        targetSlider.size(200);
        timerSlider = createSlider(1, 300, timer);
        timerSlider.position(windowWidth / 2 - 100, 330);
        timerSlider.size(200);

        audioSlider = createSlider(enums.FALSE, enums.TRUE, audioCues);
        audioSlider.position(windowWidth / 2 - 100, 430);
        audioSlider.size(200);

        musicSlider = createSlider(0, 1, musicToggle);
        musicSlider.position(windowWidth / 2 - 100, 530);
        musicSlider.size(200);

        haveInitSetting = 1;
    }
    timer = timerSlider.value();
    timeBuffer = timer;
    vThrottleMax = throtSlider.value();

    vMul = 0.15 + ((targetSlider.value() - 5) / 10) * (0.45 - 0.15);
    throttleMul = 0.225 + ((throtSlider.value() - 5) / 10) * (0.525 - 0.225);

    vTargetMax = targetSlider.value();
    audioCues = audioSlider.value();
    musicToggle = musicSlider.value();

    fill('#e4ac00');
    textSize(18);
    textAlign(CENTER);
    text("Easy", windowWidth / 2 - 150, 145);
    text("Hard", windowWidth / 2 + 150, 145);
    text("Easy", windowWidth / 2 - 150, 245);
    text("Hard", windowWidth / 2 + 150, 245);
    text("Time:", windowWidth / 2 - 150, 345);
    text(timer + " seconds", windowWidth / 2 + 185, 345);
    //Cue training
    text("Off", windowWidth / 2 - 150, 445);
    text("On", windowWidth / 2 + 150, 445);
    //Music
    text("Off", windowWidth / 2 - 150, 545);
    text("On", windowWidth / 2 + 150, 545);

    textSize(25);
    textAlign(CENTER);
    text("Page One", windowWidth / 2, 25);
    textAlign(CENTER);

    textSize(35);
    textAlign(CENTER);
    text("Slide to adjust throttle speed", windowWidth / 2, 100);
    textAlign(CENTER);

    text("Slide to adjust target speed", windowWidth / 2, 200);
    textAlign(CENTER);

    text("Slide to adjust game time", windowWidth / 2, 300);
    textAlign(CENTER);

    text("Audio cue training", windowWidth / 2, 400);

    text("Music", windowWidth / 2, 500);

    fill('#e4ac00');
    textSize(25);
    textAlign(CENTER);
    text('Press Backspace to return', windowWidth / 2, windowHeight / 2 + 250);

    if(musicToggle == 0) {
        menuSound.stop();
    }

    if(keyCode == BACKSPACE) {
        keyCode = DELETE;

        targetSlider.remove();
        throtSlider.remove();
        audioSlider.remove();
        timerSlider.remove();
        musicSlider.remove();
        clear();
        menuOption = enums.menu.START;
        haveInitSetting = 0;
    }

}

function settingsMenu2 () {
    targetSlider.remove();
    throtSlider.remove();
    audioSlider.remove();
    timerSlider.remove();
    musicSlider.remove();
    ingame = false;

    if(haveInitSetting == 1) {
        //Slider for changing time between ear swap
        earSwapSlider = createSlider(1, 30, earSwapInterval);
        earSwapSlider.position(windowWidth / 2 - 100, 130);
        earSwapSlider.size(200);

        //Slider for changing the interval at which cues will play
        cueIntervalSlider = createSlider(5, 15, cueInterval);
        cueIntervalSlider.position(windowWidth / 2 - 100, 230);
        cueIntervalSlider.size(200);

        //Slider for toggling debug text on/off
        debugSlider = createSlider(enums.FALSE, enums.TRUE, debugToggle);
        debugSlider.position(windowWidth / 2 - 100, 330);
        debugSlider.size(200);

        haveInitSetting = 2;
    }

    earSwapInterval = earSwapSlider.value();
    debugToggle = debugSlider.value();
    cueInterval = cueIntervalSlider.value();

    fill('#e4ac00');
    textSize(18);
    textAlign(CENTER);

    //Swap timing
    text("Interval:", windowWidth / 2 - 150, 145);
    text(earSwapInterval + " seconds", windowWidth / 2 + 185, 145);

    //Cue interval
    text("Interval:", windowWidth / 2 - 150, 245);
    text(cueInterval + " seconds", windowWidth / 2 + 185, 245);

    //Debug toggle
    text("Off", windowWidth / 2 - 150, 345);
    text("on", windowWidth / 2 + 185, 345);

    textSize(25);
    textAlign(CENTER);
    text("Page Two", windowWidth / 2, 25);
    textAlign(CENTER);

    textSize(35);
    text("Interval to swap ears", windowWidth / 2, 100);

    text("Interval to play cues", windowWidth / 2, 200);

    textSize(35);
    text("Toggle Debug Text", windowWidth / 2, 300);

    fill('#e4ac00');
    textSize(25);
    textAlign(CENTER);
    text('Press Backspace to return to Page One', windowWidth / 2, windowHeight / 2 + 250);

    if(keyCode == BACKSPACE) {
        keyCode = DELETE;

        earSwapSlider.remove();
        debugSlider.remove();
        cueIntervalSlider.remove();
        clear();
        menuOption = enums.menu.SETTINGS_1;
        haveInitSetting = 0;
    }

}

function keyReleased () {
    keyCode = DELETE;
}

function keyPressed () {
    lastInput = key;
    currentInput = key;
    setTimeout(() => {
        currentInput = "NONE";
    }, 1000);
}



function mousePressed () {

    if(mouseButton === "right") {
        lastInput = enums.input.MOUSE_R;
        currentInput = enums.input.MOUSE_R;
    }
    else if(mouseButton === "left") {
        lastInput = enums.input.MOUSE_L;
        currentInput = enums.input.MOUSE_L;
    }
    setTimeout(() => {
        currentInput = "NONE";
    }, 1000);
}


function draw () {

    background(0);

    if(getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }

    if(menuOption == enums.menu.START) {
        firstStart = true;
        startMenu();
    }
    else if(menuOption == enums.menu.INSTRUCT) {
        instructMenu();
    }
    else if(menuOption == enums.menu.SETTINGS_1) {
        settingsMenu();
    }
    else if(menuOption == enums.menu.PLAY) {

        if(firstStart == true) {
            squareX = windowWidth / 2;
            squareY = windowHeight / 2;
            firstStart = false;
        }
        playGame();
    }
    else if(menuOption == enums.menu.GAME_OVER) {
        firstStart = true;
        gameOver();
    }
    else if(menuOption == enums.menu.SETTINGS_2) {
        settingsMenu2();
    }

}



function switchEar () {
    if(cueEar == enums.ear.RIGHT) {
        cueEar = enums.ear.LEFT;
    }
    else if(cueEar == enums.ear.LEFT) {
        cueEar = enums.ear.RIGHT;
    }
    earSwitchAlert[cueEar].play();
}


function randomSound (array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}




function runInterval (seconds, func) {
    if(playTimeFrames % (seconds * 60) === 0) {
        func();
    }
}

function playGame () {
    ingame = true;
    playTimeFrames++;
    if(timer <= 0.99) {
        menuOption = enums.menu.GAME_OVER;
        curDist = 0;
        runningTotal = 0;
        throtCurDist = 0;
        throtRunningTotal = 0;
        samples = 0;
        timer = timeBuffer;
        return;
    }

    textAlign(LEFT);
    requestPointerLock();
    noCursor();
    fill(0);
    stroke("#013993");
    rect(20, 100, 70, windowHeight - 200);
    strokeWeight(3);
    stroke("#013993");


    if(keyCode == BACKSPACE) {
        keyCode = DELETE;

        clear();
        menuOption = enums.menu.START;
    }

    if(menuSound.isPlaying()) {
        menuSound.setVolume(0);
    }




    if(audioCues == enums.TRUE) {

        if(!announcedFirstEar) {
            switchEar();
            announcedFirstEar = enums.TRUE;
        }

        runInterval(earSwapInterval, function() {
            switchEar();
        });


        runInterval(cueInterval, function() {
            let rightCue = randomSound(rightEarSounds);
            let leftCue = randomSound(leftEarSounds);

            //If odd number in right ear
            if(rightEarReactSounds.includes(rightCue) && cueEar == enums.ear.RIGHT) {
                setTimeout(() => {
                    if(lastInput === enums.input.MOUSE_R) {
                        console.log("Hit");
                        hitCues++;
                        lastInput = "NONE";
                    }
                    else {
                        console.log("Miss");
                        missedCues++;
                    }
                }, 1000);
            }
            else if(leftEarReactSounds.includes(leftCue) && cueEar == enums.ear.LEFT) {
                setTimeout(() => {
                    if(lastInput === enums.input.MOUSE_L) {
                        console.log("Hit");
                        hitCues++;
                        lastInput = "NONE";
                    }
                    else {
                        console.log("Miss");
                        missedCues++;
                    }
                }, 1000);
            }



            rightCue.play();
            leftCue.play();
            totalCues++;
        });




    }


    if(sqrt(pow(x - squareX, 2) + (pow(y - squareY, 2))) <= 40) {
        image(greenTarget, squareX, squareY, 50, 50);
    }
    else {
        image(target, squareX, squareY, 50, 50);
    }

    if(abs(barY - throtY) <= 40) {
        image(greenTarget, barX - 17, throtY, 50, 50);
    }
    else {
        image(target, barX - 17, throtY, 50, 50);
    }

    image(jet, x, y, 85, 37.5);
    image(jet, barX - 20, barY, 51, 22.5);

    fill('#e4ac00');
    textSize(35);
    text("Target: " + round(runningAvg), 10, 30);
    text("Throttle: " + round(throtRunningAvg), 10, 70);


    //dev info
    if(debugToggle) {
        textAlign(RIGHT);
        textSize(15);
        fill('#99CC00');
        stroke('#000000');
        //Play frames
        text(`Frame Count: ${playTimeFrames}`, windowWidth - 25, 25);

        //Current input
        text(`Last Input: ${currentInput}`, windowWidth - 25, 50);

        //Last input
        text(`Last Input: ${lastInput}`, windowWidth - 25, 75);

        //cue ear
        if(cueEar == enums.ear.RIGHT) {
            text(`Cue ear: RIGHT`, windowWidth - 25, 100);
        }
        else {
            text(`Cue ear: LEFT`, windowWidth - 25, 100);
        }

        //Cues
        text(`Total Cues: ${totalCues}`, windowWidth - 25, 125);
        text(`Hit Cues: ${hitCues}`, windowWidth - 25, 150);
        text(`Missed Cues: ${missedCues}`, windowWidth - 25, 175);

        fill('#e4ac00');
        textAlign(LEFT);
    }

    textSize(25);
    text("Press Backspace to return", windowWidth - 370, windowHeight - 10);
    text(timer, windowWidth / 2, 30);
    if(keyIsDown(UP_ARROW) || keyIsDown(87)) {
        throtY -= 5;
    }

    if(keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        throtY += 5;
    }

    squareY = squareY + (-movedY);
    squareX = squareX + (movedX);

    if(y < 150) {
        ax = random(-10, 10);
        ay = random(1, 10);

        vx = vx + ax;

        vy = abs(vy + ay);

    }
    if(y > windowHeight - 100) {
        ax = random(-10, 10);
        ay = random(-10, -1);

        vx = vx + ax;

        vy = -1 * abs(vy + ay);

    }
    if(x < 150) {
        ax = random(1, 10);
        ay = random(-10, 10);

        vx = abs(vx + ax);

        vy = vy + ay;

    }
    if(x > windowWidth - 100) {
        ax = random(-10, -1);
        ay = random(-10, 10);

        vx = -1 * abs(vx + ax);

        vy = vy + ay;

    }

    if(barY > windowHeight - 165) {
        aThrottle = random(-5, -1);
        vThrottle = vThrottle + aThrottle;
        vThrottle = -1 * abs(vThrottle);
    }

    if(barY < 100) {
        aThrottle = random(1, 5);
        vThrottle = vThrottle + aThrottle;
        vThrottle = abs(vThrottle);
    }

    if(throtY >= windowHeight - 150) {
        throtY = windowHeight - 150;
    }
    else if(throtY <= 110) {
        throtY = 110;
    }
    if(vThrottle < -vThrottleMax) {
        vThrottle = -vThrottleMax;
    }
    if(vThrottle > vThrottleMax) {
        vThrottle = vThrottleMax;
    }

    if(vx < -vThrottleMax) {
        vx = -vThrottleMax;
    }
    if(vx > vThrottleMax) {
        vx = vThrottleMax;
    }
    if(vy < -vThrottleMax) {
        vy = -vThrottleMax;
    }
    if(vy > vThrottleMax) {
        vy = vThrottleMax;
    }

    x = x + vx * vMul;
    y = y + vy * vMul;
    barY = barY + vThrottle * throttleMul;

    if(playTimeFrames % 40 == 0) {
        ax = random(-10, 10);
        ay = random(-10, 10);
        aThrottle = random(-5, 5);

        vx = vx + ax;
        vy = vy + ay;
        vThrottle = vThrottle + aThrottle;
    }

    if(playTimeFrames % 60 == 0) {
        timer--;
        if(floor(random(0, 3) == 1)) {
            vx = -vx;
        }

        if(floor(random(0, 3) == 1)) {
            vy = -vy;
        }
        if(floor(random(0, 2) == 1)) {
            vThrottle = -vThrottle;
        }

    }

    if(playTimeFrames % 30 == 0) {
        curDist = round(dist(x, y, squareX, squareY));
        throtCurDist = abs(barY - throtY);

        samples = samples + 1;
        runningTotal = runningTotal + curDist;
        throtRunningTotal = throtRunningTotal + throtCurDist;

        runningAvg = runningTotal / samples;
        throtRunningAvg = throtRunningTotal / samples;

    }
}