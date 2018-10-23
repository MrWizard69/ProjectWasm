(function () {

    const supported = typeof WebAssembly === "object";

    if(supported == false){ // this checks if web assembly is supported in the browser

        document.getElementById('wasm-error').style.display = 'block';
        document.getElementById('load-text').style.display = 'none';
    }

    Module.onRuntimeInitialized = function() {

        let joyStickX = 0;
        let joyStickY = 0;
        let joyTouch = false;
        let joyDirY = '';
        let joyDirX = '';
        let joyX = 0;
        let joyY = 0;
        let joyMovement = Module.cwrap('assign_joy', 'number', ['number']);
        let gameStartQuit = Module.cwrap('start_quit_game', 'number', ['number']);
        let controllerConnect = Module.cwrap('connect_controller', 'number', ['number']);
        let isControllerConn = false;
        let gameStarted = false;
        let isGamePaused = false;
        let joystick;
        let canvas = document.getElementById('canvas');
        //let chatting = false;
        //let goingFullScreen = false;

        joyX = -1;
        joyY = -1;
        joyMovement(joyX, joyY);
        document.getElementById('game-wrap').style.display = 'block'; // when the game is loaded, display the game stage
        document.getElementById('load-box').style.display = 'none'; // when the game is loaded, hide the load screen
        document.getElementById('title-area').style.display = 'block';

        initialize(); // this is the function that will look at the browser window size and will resize everything

        let interval;

        function isControllerConntected(){

            if (!('ongamepadconnected' in window)) {

                interval = setInterval(pollGamepads, 500);
            }
        }

        
        isControllerConntected();
        
        function pollGamepads() {
            let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
            for (let i = 0; i < gamepads.length; i++) {

                let gp = gamepads[i];

                if (gp && gp.buttons.length > 0) {
                    console.log('Gamepad connected at index ' + gp.index + ': ' + gp.id +
                    '. It has ' + gp.buttons.length + ' buttons and ' + gp.axes.length + ' axes.');
                    controllerIndex = gp.index;
                    isControllerConn = true;
                    document.getElementById('joystick').style.display = 'none';
                    controllerLoop();
                    clearInterval(interval);
                }
            }
        }

        function controllerLoop() {
            let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
            if (!gamepads) {

                return;
            }
          
            let gp = gamepads[controllerIndex];

            //controller left joystick layout diagonal
            if(gp && gp.axes){

                if(gp.axes[0] > 0.5 && gp.axes[1] > 0.5) { //left/down

                    joyX = 2;
                }
                else if(gp.axes[0] < -0.5 && gp.axes[1] > 0.5) { //right/down
                    
                    joyX = 4;
                }
                else if(gp.axes[0] < -0.5 && gp.axes[1] < -0.5) { //right/up
                    
                    joyX = 4;
                }
                else if(gp.axes[0] > 0.5 && gp.axes[1] < -0.5) { //left/up

                    joyX = 2;
                }
                //controller right joystick layout diagonal
                else if(gp.axes[2] > 0.5 && gp.axes[3] > 0.5) { //left/down

                    joyX = 2;
                }
                else if(gp.axes[2] < -0.5 && gp.axes[3] > 0.5) { //right/down
                    
                    joyX = 4;
                }
                else if(gp.axes[2] < -0.5 && gp.axes[3] < -0.5) { //right/up
                    
                    joyX = 4;
                }
                else if(gp.axes[2] > 0.5 && gp.axes[3] < -0.5) { //left/up

                    joyX = 2;
                }
                //controller left joystick layout straight
                else if(gp.axes[0] > 0.5) { //left

                    joyX = 2;
                    joyY = 0;
                }
                else if(gp.axes[0] < -0.5) { //right
                    
                    joyX = 4;
                    joyY = 0;
                }
                else if(gp.axes[1] > 0.5) { //down

                    joyX = 0;
                    joyY = 3;
                }
                else if(gp.axes[1] < -0.5) { //up

                    joyX = 0;
                    joyY = 1;
                }
                //controller right stick layout straight
                else if(gp.axes[2] > 0.5) { //left

                    joyX = 2;
                    joyY = 0;
                }
                else if(gp.axes[2] < -0.5) { //right
                    
                    joyX = 4;
                    joyY = 0;
                }
                else if(gp.axes[3] > 0.5) { //down

                    joyX = 0;
                    joyY = 3;
                }
                else if(gp.axes[3] < -0.5) { //up

                    joyX = 0;
                    joyY = 1;
                }
                else { //stop moving
                
                    joyX = 0;
                    joyY = 0;
                }
                
                joyMovement(joyX, joyY);
                
            }

            if(gp && gp.buttons){

                //controller button layout
                if(gp.buttons[0].pressed === true){ // A button

                    console.log('button 0 pressed');
                }
                if(gp.buttons[1].pressed === true){ // B button

                    console.log('button 1 pressed');
                }
                if(gp.buttons[2].pressed === true){ // X button

                    console.log('button 2 pressed');
                }
                if(gp.buttons[3].pressed === true){ // Y button

                    console.log('button 3 pressed');
                }
                if(gp.buttons[4].pressed === true){ // left bumper

                    console.log('button 4 pressed');
                }
                if(gp.buttons[5].pressed === true){ // right bumper

                    console.log('button 5 pressed');
                }
                if(gp.buttons[6].pressed === true){ // left trigger

                    console.log('button 6 pressed');
                }
                if(gp.buttons[7].pressed === true){ // right trigger

                    console.log('button 7 pressed');
                }
                if(gp.buttons[8].pressed === true){ // option button

                    console.log('button 8 pressed');
                }
                if(gp.buttons[9].pressed === true){ // start button

                    console.log('button 9 pressed');
                }
                if(gp.buttons[10].pressed === true){ // click left joystick

                    console.log('button 10 pressed');
                }
                if(gp.buttons[11].pressed === true){ // click right joystick

                    console.log('button 11 pressed');
                }
                if(gp.buttons[12].pressed === true){ // up D-pad

                    console.log('button 12 pressed');
                }
                if(gp.buttons[13].pressed === true){ // down D-pad

                    console.log('button 13 pressed');
                }
                if(gp.buttons[14].pressed === true){ // left D-pad

                    console.log('button 14 pressed');
                }
                if(gp.buttons[15].pressed === true){ // right D-pad

                    console.log('button 15 pressed');
                }
            }
            
            start = requestAnimationFrame(controllerLoop);

            if(gp === null){

                console.log('Your controller got disconnected');
                isControllerConn = false;
                document.getElementById('joystick').style.display = 'block';
                window.cancelAnimationFrame(start);
                joystickTapEnd();
                isControllerConntected();
                
            }
          }

        document.getElementById('joystick').addEventListener('touchend', joystickTapEnd);
		
		function joystickTapEnd(){
		
            joyTouch = false;
            joyX = 0;
            joyY = 0;
            joyMovement(joyX, joyY);

            setTimeout(function(){

                joyX = -1;
                joyY = -1;
                joyMovement(joyX, joyY);

            }, 30);
		}

        document.getElementById('joystick').addEventListener('touchstart', joystickTap);
		
		function joystickTap(){

            if(gameStarted == true){

                joyTouch = true; // the joystick was touched and now in the Update function it will be checking the direction of the joystick
            }
            
        }

        setInterval(function(){

            if(joyTouch == true){
					
                if (joystick.up()) {
        
                    joyDirY = 'up';
                    joyDirX = '';
                            
                    if (joystick.right()) {
                            
                        joyDirX = 'right';
                    }
                            
                    if (joystick.left()) {
    
                        joyDirX = 'left';
                    }
                }
    
                if (joystick.down()) {
    
                    joyDirY = 'down';
                    joyDirX = '';
                            
                    if (joystick.right()) {
    
                        joyDirX = 'right';
                    }
                    if (joystick.left()) {
                            
                        joyDirX = 'left';
                    }
                }
                        
                if (joystick.right()) {
    
                    joyDirX = 'right';
                    joyDirY = '';
                            
                    if(joystick.up()){
                                
                        joyDirY = 'up';
                    }
                    if(joystick.down()){
                                
                        joyDirY = 'down';
                    }
                            
                }
                if (joystick.left()) {
    
                    joyDirX = 'left';
                    joyDirY = '';
                            
                    if(joystick.up()){
                                
                        joyDirY = 'up';
                    }
                    if(joystick.down()){
                                
                        joyDirY = 'down';
                    }
                }
                        
                if(joyDirX == 'left' && joyDirY == 'up'){ 

                    joyX = 4;
                    joyY = 1;
                            
                }
                else if(joyDirX == 'left' && joyDirY == 'down'){

                    joyX = 4;
                    joyY = 3;
                            
                }
                else if(joyDirY == 'up' && joyDirX == 'right'){

                    joyX = 2;
                    joyY = 1;
                            
                }
                else if(joyDirY == 'down' && joyDirX == 'right'){

                    joyX = 2;
                    joyY = 3;
                            
                }
                else if(joyDirX == 'left'){

                    joyX = 4;
                    joyY = 0;		
                            
                }
                else if(joyDirX == 'right'){

                    joyX = 2;
                    joyY = 0;											
                            
                }
                else if(joyDirY == 'up'){

                    joyX = 0;
                    joyY = 1;	
                            
                }
                else if(joyDirY == 'down'){

                    joyX = 0;
                    joyY = 3;								
                            
                }

                joyMovement(joyX, joyY);
                
            }
        }, 120); //120

        //document.getElementById('openChat').addEventListener('click', tapChat);

        function tapChat(){

            document.getElementById('game-wrap').style.display = 'none';
            document.getElementById('dataChannelWrap').style.display = 'block';
            chatting = true;
            document.getElementById('openChat').style.display = 'none';
            document.getElementById('closeChat').style.display = 'inline-block';
            document.getElementById('rotation-message').style.display = 'none';
        }

        //document.getElementById('closeChat').addEventListener('click', tapChatClose);

        function tapChatClose(){

            document.getElementById('game-wrap').style.display = 'block';
            document.getElementById('dataChannelWrap').style.display = 'none';
            chatting = false;
            document.getElementById('openChat').style.display = 'inline-block';
            document.getElementById('closeChat').style.display = 'none';
            document.getElementById('rotation-message').style.display = 'block';
        }

        document.getElementById('play').addEventListener('click', tapPlay);

        function tapPlay(){

            document.getElementById('play').style.display = 'none';
            document.getElementById('title-area').style.display = 'none';
            gameStarted = true;
            gameStartQuit(1); // 1-play, 0-quit
            startTouchControlls();
        }

        function startTouchControlls(){

            if(isControllerConn == false){

                document.getElementById('joystick').style.display = 'block';
            }
            else{

                document.getElementById('joystick').style.display = 'none';
            }
        }

        document.getElementById('gameOptions').addEventListener('click', optionTap);

        function optionTap(){

            document.getElementById('options-backdrop').style.display = 'block';
            document.getElementById('option-selections').style.display = 'block';
            isGamePaused = true;
        }

        document.getElementById('close-opts').addEventListener('click', optionClose);

        function optionClose(){

            document.getElementById('options-backdrop').style.display = 'none';
            document.getElementById('option-selections').style.display = 'none';
            isGamePaused = false;
        }

        function controllerCheck(){

            if(isControllerConn == false){

                document.getElementById('joystick').style.display = 'block';
            }
            else{

                document.getElementById('joystick').style.display = 'none';
            }
        }
		
        function initialize() {
            // Register an event listener to
            // call the resizeCanvas() function each time
            // the window is resized.
                window.addEventListener('resize', resizeCanvas, false);	
                
            // Draw canvas border for the first time.
                resizeCanvas();
            }
            
            // Display custom canvas.
            function redraw() {
                            
                
            }
            // Runs each time the DOM window resize event fires.
            // Resets the canvas dimensions to match window,
            // then draws the new borders accordingly.
            function resizeCanvas() {

                document.getElementById('rotation-message').style.display = 'none';
                document.getElementById('horizontal-device').style.display = 'none';
                document.getElementById('joystick').style.display = 'none';
                document.getElementById('play').style.display = 'none';
                document.getElementById('gameOptions').style.display = 'none';
                document.getElementById('title-area').style.display = 'none';
                document.getElementById('options-backdrop').style.display = 'none';
                document.getElementById('option-selections').style.display = 'none';
                document.getElementById('pause-message').style.display = 'none';
                controllerConnect(0);
                //document.getElementById('openChat').style.display = 'none';

                setTimeout(function(){

                    if(joystick != undefined){

                        joystick.destroy();
                        joystick = null;
                    }

                    // joyStick_X = (window.innerWidth) * .91;
                    // joyStick_Y = (window.innerHeight) * .55;	
                    joyStickX = (window.innerWidth) * .07;
                    joyStickY = (window.innerHeight) * 0.55;

                    joystick = new VirtualJoystick({
                        container: document.getElementById('joystick'),
                        mouseSupport: true,
                        limitStickTravel: true,
                        stationaryBase: true, // to make the joystick appear anywhere, set to false and comment out BaseX and BaseY
                                baseX: joyStickX, // this size is only good for mobile maybe not tablets
                                baseY: joyStickY, // this size is only good for mobile maybe not tablets
                        stickRadius: 25
                    });
                    
                    if(canvas.height >= 1050 && canvas.width >= 1000){ //BIG screens

                        if(isControllerConn == true){

                            controllerConnect(1);
                        }

                        if(gameStarted == false){

                            document.getElementById('play').style.display = 'inline-block';
                            document.getElementById('title-area').style.display = 'block';
                            document.getElementById('title-area').style.left = '17.5%';
                            document.getElementById('title-area').style.top = '12%';
                            document.getElementById('title-area').style.width = '55%';
                        }
                        if(gameStarted == true){

                            controllerCheck();
                            document.getElementById('rotation-message').style.width = '100%';
                            document.getElementById('pause-message').style.display = 'none';
                            isGamePaused = false;
                        }

                        document.getElementById('gameOptions').style.display = 'inline-block';
                        document.getElementById('close-opts').style.top = '-150%';
                    }
                    else if(canvas.height >= 1000 && canvas.width <= 1050){ //ipad pro in portrait

                        if(gameStarted == false){
                            
                            document.getElementById('play').style.display = 'none';
                            document.getElementById('gameOptions').style.display = 'none';
                            document.getElementById('title-area').style.display = 'block';
                            document.getElementById('title-area').style.left = '17.5%';
                            document.getElementById('title-area').style.top = '12%';
                            document.getElementById('title-area').style.width = '55%';
                            document.getElementById('rotation-message').style.display = 'block';
                            document.getElementById('rotation-message').style.fontSize = '2.2em';
                            document.getElementById('horizontal-device').style.display = 'block';
                            document.getElementById('image-rotate').style.left = '41%';
                        }
                        if(gameStarted == true){

                            document.getElementById('joystick').style.display = 'none';
                            document.getElementById('options-backdrop').style.display = 'block';
                            document.getElementById('horizontal-device').style.zIndex = '2';
                            document.getElementById('horizontal-device').style.display = 'block';
                            document.getElementById('rotation-message').style.display = 'block';
                            document.getElementById('rotation-message').style.position = 'absolute';
                            document.getElementById('rotation-message').style.zIndex = '3';
                            document.getElementById('rotation-message').style.color = 'white';
                            document.getElementById('rotation-message').style.width = '86%';
                            document.getElementById('rotation-message').style.left = '3%';
                            document.getElementById('rotation-message').style.fontSize = '2.2em';
                            document.getElementById('rotation-message').style.width = '94%';
                            document.getElementById('rotation-message').innerHTML = 'Rotate Your Device In Landscape To Continue';
                            document.getElementById('image-rotate').style.left = '41%';
                            document.getElementById('pause-message').style.display = 'block';
                            document.getElementById('pause-message').style.left = '19%';
                            document.getElementById('pause-message').style.width = '60%';
                            isGamePaused = true;
                        }

                        document.getElementById('close-opts').style.top = '-133%';
                    }
                    // else if(canvas.height >= 824 && canvas.height < 931 && canvas.width >= 824 && canvas.width < 931){ // special 'square' cases // width: 824 - 930(1) height: 824 - 930(1)
                        
                    //     document.getElementById('rotation-message').style.display = 'none';
                    //     document.getElementById('horizontal-device').style.display = 'none';
                    //     document.getElementById('title-area').style.display = 'block';
                    //     document.getElementById('gameOptions').style.display = 'inline-block';

                    //     // if(chatting == false){
                    //     //     document.getElementById('openChat').style.display = 'none';
                    //     // }
                    //     // else{
                    //     //     document.getElementById('closeChat').style.display = 'none';
                    //     // }
                        
                    //     if(gameStarted == false){

                    //         document.getElementById('play').style.display = 'inline-block';
                    //     }
                    //     if(gameStarted == true){

                    //         document.getElementById('joystick').style.display = 'block';
                    //         document.getElementById('options-backdrop').style.display = 'none';
                    //         document.getElementById('rotation-message').style.position = 'static';
                    //         document.getElementById('rotation-message').style.color = 'black';
                    //         document.getElementById('rotation-message').innerHTML = 'Rotate Your Device In Landscape To Play';
                    //         document.getElementById('rotation-message').style.fontSize = '1em';
                    //         document.getElementById('rotation-message').style.width = '100%';
                    //         document.getElementById('pause-message').style.display = 'none';
                    //         isGamePaused = false;
                    //     }
                    //     console.log('here');
                    //     document.getElementById('close-opts').style.top = '-69%';
                        
                    // }
                    else if(canvas.width >= 850 && canvas.height >= 850){ //ipad pro in landscape

                        if(isControllerConn == true){

                            controllerConnect(1);
                        }

                        if(gameStarted == false){

                            document.getElementById('play').style.display = 'inline-block';
                            document.getElementById('title-area').style.display = 'block';
                            document.getElementById('title-area').style.left = '17.5%';
                            document.getElementById('title-area').style.top = '12%';
                            document.getElementById('title-area').style.width = '55%';
                        }
                        if(gameStarted == true){

                            controllerCheck();
                            document.getElementById('rotation-message').style.width = '100%';
                            document.getElementById('pause-message').style.display = 'none';
                            isGamePaused = false;
                        }

                        document.getElementById('gameOptions').style.display = 'inline-block';
                        document.getElementById('close-opts').style.top = '-133%';
                    }
                    else if(canvas.width > 410 && canvas.width < 670 && canvas.height >= 741){ // ipad in portrait / iPhone X / Pixel 2 XL

                        if(gameStarted == false){

                            document.getElementById('play').style.display = 'none';
                            document.getElementById('gameOptions').style.display = 'none';
                            document.getElementById('title-area').style.display = 'block';
                            document.getElementById('title-area').style.left = '17.5%';
                            document.getElementById('title-area').style.top = '12%';
                            document.getElementById('title-area').style.width = '55%';
                            document.getElementById('rotation-message').style.display = 'block';
                            document.getElementById('rotation-message').style.fontSize = '1.2em';
                            document.getElementById('horizontal-device').style.display = 'block';
                            document.getElementById('image-rotate').style.left = '36%';
                        }
                        if(gameStarted == true){

                            document.getElementById('joystick').style.display = 'none';
                            document.getElementById('options-backdrop').style.display = 'block';
                            document.getElementById('horizontal-device').style.zIndex = '2';
                            document.getElementById('horizontal-device').style.display = 'block';
                            document.getElementById('rotation-message').style.display = 'block';
                            document.getElementById('rotation-message').style.position = 'absolute';
                            document.getElementById('rotation-message').style.zIndex = '2';
                            document.getElementById('rotation-message').style.color = 'white';
                            document.getElementById('rotation-message').style.left = '7%';
                            document.getElementById('rotation-message').style.fontSize = '1.5em';
                            document.getElementById('rotation-message').innerHTML = 'Rotate Your Device In Landscape To Continue';
                            document.getElementById('rotation-message').style.width = '86%';
                            document.getElementById('image-rotate').style.left = '37%';
                            document.getElementById('pause-message').style.display = 'block';
                            document.getElementById('pause-message').style.left = '19%';
                            document.getElementById('pause-message').style.width = '60%';
                            isGamePaused = true;
                        }

                        document.getElementById('close-opts').style.top = '-111%';
                    }
                    else if(canvas.width >= 593){ //ipad in landscape / iphone X / Pixel 2 XL

                        if(isControllerConn == true){

                            controllerConnect(1);
                        }

                        if(gameStarted == false){

                            document.getElementById('play').style.display = 'inline-block';
                            document.getElementById('title-area').style.display = 'block';
                            document.getElementById('title-area').style.left = '17.5%';
                            document.getElementById('title-area').style.top = '12%';
                            document.getElementById('title-area').style.width = '55%';
                        }
                        if(gameStarted == true){

                            controllerCheck();
                            document.getElementById('rotation-message').style.width = '100%';
                            document.getElementById('pause-message').style.display = 'none';
                            isGamePaused = false;
                        }

                        document.getElementById('gameOptions').style.display = 'inline-block';
                        document.getElementById('close-opts').style.top = '-111%';
                    }
                    else if(canvas.width >= 408 && canvas.height > 250){ // everyother device in landscape //better for smaller devices ->345 - 408 // 307 <- for iphone and early devices
                        
                        if(isControllerConn == true){

                            controllerConnect(1);
                        }

                        if(canvas.width == 432){ //this is for a special case

                            document.getElementById('title-area').style.display = 'block';
                            document.getElementById('title-area').style.left = '17.5%';
                            document.getElementById('title-area').style.top = '12%';
                            document.getElementById('title-area').style.width = '55%';
                            document.getElementById('play').style.display = 'none';
                            document.getElementById('gameOptions').style.display = 'none';
                            document.getElementById('rotation-message').style.display = 'block';
                            document.getElementById('horizontal-device').style.display = 'block';
                            document.getElementById('image-rotate').style.left = '33%';
                        }
                        else{

                            document.getElementById('title-area').style.display = 'none';
                            document.getElementById('gameOptions').style.display = 'inline-block';
                            document.getElementById('rotation-message').style.display = 'none';
                            document.getElementById('horizontal-device').style.display = 'none';
                        }

                        document.getElementById('rotation-message').style.fontSize = '1em';
                        //document.getElementById('rotation-message').style.display = 'none';
                        //document.getElementById('horizontal-device').style.display = 'none';
                        //document.getElementById('title-area').style.display = 'none';
                        //document.getElementById('gameOptions').style.display = 'inline-block';

                        // if(chatting == false){
                        //     document.getElementById('openChat').style.display = 'none';
                        // }
                        // else{
                        //     document.getElementById('closeChat').style.display = 'none';
                        // }
                        
                        if(gameStarted == false){

                            if(canvas.width != 432){

                                document.getElementById('play').style.display = 'inline-block';
                            }
                        }
                        if(gameStarted == true){

                            controllerCheck();
                            document.getElementById('options-backdrop').style.display = 'none';
                            document.getElementById('rotation-message').style.position = 'static';
                            document.getElementById('rotation-message').style.color = 'black';
                            document.getElementById('rotation-message').innerHTML = 'Rotate Your Device In Landscape To Play';
                            document.getElementById('rotation-message').style.fontSize = '1em';
                            document.getElementById('rotation-message').style.width = '100%';
                            document.getElementById('pause-message').style.display = 'none';
                            isGamePaused = false;
                        }

                        document.getElementById('close-opts').style.top = '-69%';
                        
                        
                    }
                    else if(canvas.width >= 340 && canvas.height > 250){ // for iphone and early devices in landscape
                        
                        if(isControllerConn == true){

                            controllerConnect(1);
                        }

                        if(canvas.width == 345 && canvas.height == 720){ //this is for a special case

                            document.getElementById('title-area').style.display = 'block';
                            document.getElementById('title-area').style.left = '17.5%';
                            document.getElementById('title-area').style.top = '12%';
                            document.getElementById('title-area').style.width = '55%';
                            document.getElementById('play').style.display = 'none';
                            document.getElementById('gameOptions').style.display = 'none';
                            document.getElementById('rotation-message').style.display = 'block';
                            document.getElementById('horizontal-device').style.display = 'block';
                            document.getElementById('image-rotate').style.left = '30%';
                        }
                        else{

                            document.getElementById('title-area').style.display = 'none';
                            document.getElementById('gameOptions').style.display = 'inline-block';
                            document.getElementById('rotation-message').style.display = 'none';
                            document.getElementById('horizontal-device').style.display = 'none';
                        }

                        document.getElementById('rotation-message').style.fontSize = '1em';

                        // document.getElementById('rotation-message').style.display = 'none';
                        // document.getElementById('horizontal-device').style.display = 'none';
                        // document.getElementById('title-area').style.display = 'none';
                        // document.getElementById('gameOptions').style.display = 'inline-block';

                        // if(chatting == false){
                        //     document.getElementById('openChat').style.display = 'none';
                        // }
                        // else{
                        //     document.getElementById('closeChat').style.display = 'none';
                        // }
                        
                        if(gameStarted == false){

                            if(canvas.width != 345 && canvas.height != 720){

                                document.getElementById('play').style.display = 'inline-block';
                            }
                            else if(canvas.height != 720){

                                document.getElementById('play').style.display = 'inline-block';
                            }
                            
                        }
                        if(gameStarted == true){

                            controllerCheck();
                            document.getElementById('options-backdrop').style.display = 'none';
                            document.getElementById('rotation-message').style.position = 'static';
                            document.getElementById('rotation-message').style.color = 'black';
                            document.getElementById('rotation-message').innerHTML = 'Rotate Your Device In Landscape To Play';
                            document.getElementById('rotation-message').style.fontSize = '1em';
                            document.getElementById('rotation-message').style.width = '100%';
                            document.getElementById('pause-message').style.display = 'none';
                            isGamePaused = false;
                        }

                        document.getElementById('close-opts').style.top = '-69%';
                        
                    }
                    else if(canvas.width >= 250){ // everyother device in portrate
                        
                        document.getElementById('joystick').style.display = 'none';
                        document.getElementById('rotation-message').style.display = 'block';
                        document.getElementById('horizontal-device').style.display = 'block';

                        if(gameStarted == false){

                            document.getElementById('title-area').style.display = 'block';
                            document.getElementById('title-area').style.left = '7.5%';
                            document.getElementById('title-area').style.top = '33%';
                            document.getElementById('title-area').style.width = '75%';
                            document.getElementById('option-selections').style.display = 'none';
                            document.getElementById('image-rotate').style.left = '24%';
                            document.getElementById('image-rotate').style.top = '54%';
                            document.getElementById('rotation-message').style.fontSize = '1em';
                        }

                        if(gameStarted == true){

                            document.getElementById('options-backdrop').style.display = 'block';
                            document.getElementById('image-rotate').style.zIndex = '2';
                            document.getElementById('image-rotate').style.left = '24%';
                            document.getElementById('rotation-message').style.position = 'absolute';
                            document.getElementById('rotation-message').style.zIndex = '2';
                            document.getElementById('rotation-message').style.color = 'white';
                            document.getElementById('rotation-message').style.left = '7%';
                            document.getElementById('rotation-message').innerHTML = 'Rotate Your Device In Landscape To Continue';
                            document.getElementById('rotation-message').style.fontSize = '1em';
                            document.getElementById('rotation-message').style.width = '86%';
                            document.getElementById('pause-message').style.display = 'block';
                            document.getElementById('pause-message').style.left = '10%';
                            document.getElementById('pause-message').style.width = '80%';
                            isGamePaused = true;
                        }

                        //document.getElementById('openChat').style.display = 'none';
                        // if(chatting == false){
                        //     document.getElementById('openChat').style.display = 'inline-block';
                        //     document.getElementById('rotation-message').style.display = 'block';
                        // }
                        // else{
                        //     document.getElementById('closeChat').style.display = 'inline-block';
                        // }
                        document.getElementById('play').style.display = 'none';
                        document.getElementById('gameOptions').style.display = 'none';

                    }
                    else if(canvas.width <= 250 && canvas.height > 250){ //iphone 5s portrate //problem area 600/799

                        document.getElementById('joystick').style.display = 'none';
                        document.getElementById('rotation-message').style.display = 'block';
                        document.getElementById('horizontal-device').style.display = 'block';

                        if(gameStarted == false){

                            document.getElementById('title-area').style.display = 'block';
                            document.getElementById('title-area').style.left = '7.5%';
                            document.getElementById('title-area').style.top = '15%';
                            document.getElementById('title-area').style.width = '75%';
                            document.getElementById('option-selections').style.display = 'none';
                            document.getElementById('image-rotate').style.left = '19%';
                            document.getElementById('image-rotate').style.top = '45%';
                            document.getElementById('rotation-message').style.fontSize = '1em';
                        }

                        if(gameStarted == true){

                            document.getElementById('options-backdrop').style.display = 'block';
                            document.getElementById('image-rotate').style.zIndex = '2';
                            document.getElementById('image-rotate').style.left = '19%';
                            document.getElementById('image-rotate').style.top = '45%';
                            document.getElementById('rotation-message').style.position = 'absolute';
                            document.getElementById('rotation-message').style.zIndex = '2';
                            document.getElementById('rotation-message').style.color = 'white';
                            document.getElementById('rotation-message').style.width = '86%';
                            document.getElementById('rotation-message').style.left = '7%';
                            document.getElementById('rotation-message').innerHTML = 'Rotate Your Device In Landscape To Continue';
                            document.getElementById('rotation-message').style.fontSize = '1em';
                            document.getElementById('pause-message').style.display = 'block';
                            document.getElementById('pause-message').style.left = '5%';
                            document.getElementById('pause-message').style.width = '89%';
                            isGamePaused = true;
                        }
                        document.getElementById('play').style.display = 'none';
                        document.getElementById('gameOptions').style.display = 'none';
                    }
                    // if(canvas.width >= 350){

                    //     document.getElementById('joystick').style.display = 'none';
                    //     document.getElementById('rotation-message').style.display = 'block';
                    //     console.log('here');
                        
                    // }		
                    // if(canvas.width > 350 && canvas.width <= 595){
                    //     console.log('here');
                    //  }
                    //  if(canvas.width >= 596){
            
                    //  }	
                    
                    redraw();

                }, 200);  
            }
        
    }

}());