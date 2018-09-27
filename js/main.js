(function () {

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
        let gameStarted = false;
        let isGamePaused = false;
        let joystick;
        let canvas = document.getElementById('canvas');
        //let chatting = false;
        //let goingFullScreen = false;

        joyX = -1;
        joyY = -1;
        joyMovement(joyX, joyY);

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
                    console.log("Gamepad connected at index " + gp.index + ": " + gp.id +
                    ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.");
                    controllerIndex = gp.index;
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

            document.getElementById('gameWrap').style.display = 'none';
            document.getElementById('dataChannelWrap').style.display = 'block';
            chatting = true;
            document.getElementById('openChat').style.display = 'none';
            document.getElementById('closeChat').style.display = 'inline-block';
            document.getElementById('rotation-message').style.display = 'none';
        }

        //document.getElementById('closeChat').addEventListener('click', tapChatClose);

        function tapChatClose(){

            document.getElementById('gameWrap').style.display = 'block';
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

            document.getElementById('joystick').style.display = 'block';
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
                document.getElementById('joystick').style.display = 'none';
                document.getElementById('play').style.display = 'none';
                document.getElementById('gameOptions').style.display = 'none';
                document.getElementById('title-area').style.display = 'none';
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

                    canvas.width = (window.innerWidth) * .72;

                    joystick = new VirtualJoystick({ // The math going on in here is hard on the CPU. Look into Dx and Dy values for manual mapping
                        container: document.getElementById('joystick'),
                        mouseSupport: true,
                        limitStickTravel: true,
                        stationaryBase: true, // to make the joystick appear anywhere, set to false and comment out BaseX and BaseY
                                baseX: joyStickX, // this size is only good for mobile maybe not tablets
                                baseY: joyStickY, // this size is only good for mobile maybe not tablets
                        stickRadius: 25
                    });   
                    if(canvas.width >= 600){

                        if(gameStarted == false){

                            document.getElementById('play').style.display = 'inline-block';
                            document.getElementById('gameOptions').style.display = 'inline-block';
                            document.getElementById('title-area').style.display = 'block';
                            document.getElementById('title-area').style.left = '15.5%';
                            document.getElementById('title-area').style.top = '12%';
                            document.getElementById('title-area').style.width = '55%';
                        }
                        if(gameStarted == true){

                            document.getElementById('joystick').style.display = 'block';
                        }

                        document.getElementById('close-opts').style.top = '-215%';
                    }
                    else if(canvas.width >= 350){
                        
                        document.getElementById('rotation-message').style.display = 'none';
                        document.getElementById('title-area').style.display = 'none';

                        // if(chatting == false){
                        //     document.getElementById('openChat').style.display = 'none';
                        // }
                        // else{
                        //     document.getElementById('closeChat').style.display = 'none';
                        // }
                        
                        if(gameStarted == false){

                            document.getElementById('play').style.display = 'inline-block';
                            document.getElementById('gameOptions').style.display = 'inline-block';
                        }
                        if(gameStarted == true){

                            document.getElementById('joystick').style.display = 'block';
                        }

                        document.getElementById('close-opts').style.top = '-93%';
                        
                    }		
                    
                    else if(canvas.width <= 300){
                        
                        document.getElementById('joystick').style.display = 'none';
                        document.getElementById('rotation-message').style.display = 'block';

                        if(gameStarted == false){

                            document.getElementById('title-area').style.display = 'block';
                            document.getElementById('title-area').style.left = '3%';
                            document.getElementById('title-area').style.top = '33%';
                            document.getElementById('title-area').style.width = 'auto';
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