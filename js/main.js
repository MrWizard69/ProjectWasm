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
        let joystick;
        let canvas = document.getElementById('canvas');
        let chatting = false;

        joyX = -1;
        joyY = -1;
        joyMovement(joyX, joyY);

        //document.getElementById('play').style.display = 'none';

        initialize(); // this is the function that will look at the browser window size and will resize everything

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
		
            joyTouch = true; // the joystick was touched and now in the Update function it will be checking the direction of the joystick
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

        document.getElementById('openChat').addEventListener('click', tapChat);

        function tapChat(){

            document.getElementById('gameWrap').style.display = 'none';
            document.getElementById('dataChannelWrap').style.display = 'inline-block';
            chatting = true;
            document.getElementById('openChat').style.display = 'none';
            document.getElementById('closeChat').style.display = 'inline-block';
        }

        document.getElementById('closeChat').addEventListener('click', tapChatClose);

        function tapChatClose(){

            document.getElementById('gameWrap').style.display = 'inline-block';
            document.getElementById('dataChannelWrap').style.display = 'none';
            chatting = false;
            document.getElementById('openChat').style.display = 'inline-block';
            document.getElementById('closeChat').style.display = 'none';
        }

        //document.getElementById('play').addEventListener('click', tapPlay);

        function tapPlay(){

            //Module.requestFullscreen(true, false);
            //document.documentElement.webkitRequestFullScreen();
            //Module.requestFullscreen(false, false);

            if (!document.fullscreenElement) {  // current working methods
                if (document.documentElement.requestFullscreen) {
                    //document.documentElement.requestFullscreen();
                }
                else if (document.documentElement.webkitRequestFullscreen) {

                    document.documentElement.webkitRequestFullScreen();
                    Module.requestFullscreen(1, 1); // figure out how to full screen future Jordan!
                } 
            }

            // setTimeout(() => {
            //     Module.requestFullscreen(1, 1);
            // }, 300);

            // setTimeout(() => {
            //     document.documentElement.webkitRequestFullScreen();
            //     //Module.requestFullscreen(true, false);
            //     Module.requestFullscreen(true, false);
            // }, 200);

            // if (document.webkitExitFullscreen) {
            //     //console.log('here');
            //     //document.documentElement.webkitRequestFullScreen();
                
            //     //Module.requestFullscreen(1, 1);
            //     document.documentElement.webkitRequestFullScreen();
            //     Module.requestFullscreen(1, 1); 
            //     //Module.requestFullscreen(true, false);
            //     //document.webkitExitFullscreen();
            // }

            //Module.requestFullscreen(false, false);
            //document.documentElement.webkitRequestFullScreen();
            //Module.requestFullscreen(false, false);
            //document.documentElement.webkitRequestFullScreen();
            //document.documentElement.webkitRequestFullScreen();
            //Module.requestFullscreen(1, 1);
            //Module.requestFullscreen(1, 1);

            //console.log(window.innerWidth);

            //Module.requestFullscreen(true, false);
            //Module.requestFullscreen(true, false);
            //Module.requestFullscreen(1, 1);

            joystick = new VirtualJoystick({
                container: document.getElementById('joystick'),
                mouseSupport: true,
                limitStickTravel: true,
                stationaryBase: true, // to make the joystick appear anywhere, set to false and comment out BaseX and BaseY
                        baseX: joyStickX, // this size is only good for mobile maybe not tablets
                        baseY: joyStickY, // this size is only good for mobile maybe not tablets
                stickRadius: 25
            });

 
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
                document.getElementById('openChat').style.display = 'none';

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

                    joystick = new VirtualJoystick({
                        container: document.getElementById('joystick'),
                        mouseSupport: true,
                        limitStickTravel: true,
                        stationaryBase: true, // to make the joystick appear anywhere, set to false and comment out BaseX and BaseY
                                baseX: joyStickX, // this size is only good for mobile maybe not tablets
                                baseY: joyStickY, // this size is only good for mobile maybe not tablets
                        stickRadius: 25
                    });   
                    // if(canvas.width >= 241){
                        
                        
                    // }
                    if(canvas.width >= 350){

                        document.getElementById('joystick').style.display = 'inline-block';
                        document.getElementById('rotation-message').style.display = 'none';

                        if(chatting == false){
                            document.getElementById('openChat').style.display = 'inline-block';
                        }
                        else{
                            document.getElementById('closeChat').style.display = 'inline-block';
                        }
                        
                        
                        //document.getElementById('play').style.display = 'inline-block';
                        
                    }		
                    
                    if(canvas.width <= 300){
                        
                        document.getElementById('joystick').style.display = 'none';
                        document.getElementById('rotation-message').style.display = 'block';
                        //document.getElementById('openChat').style.display = 'none';
                        if(chatting == false){
                            document.getElementById('openChat').style.display = 'none';
                        }
                        else{
                            document.getElementById('closeChat').style.display = 'none';
                        }
                        //document.getElementById('play').style.display = 'none';

                        // if (document.exitFullscreen) {
						// 	document.exitFullscreen();
                        // }
                        // else if (document.webkitExitFullscreen) {
                        //     document.webkitExitFullscreen();
                        // }

                        // Module.exitFullscreen(1, 1);

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