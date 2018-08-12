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

        let canvas = document.getElementById('canvas');

        joyX = -1;
        joyY = -1;
        joyMovement(joyX, joyY);

        // joyStickX = (window.innerWidth) * .07;
		// joyStickY = (window.innerHeight) * 0.55;

        let joystick;


        // let joystick = new VirtualJoystick({
        //     container: document.getElementById('joystick'),
        //     mouseSupport: true,
        //     limitStickTravel: true,
        //     stationaryBase: true, // to make the joystick appear anywhere, set to false and comment out BaseX and BaseY
        //           baseX: joyStickX, // this size is only good for mobile maybe not tablets
        //           baseY: joyStickY, // this size is only good for mobile maybe not tablets
        //     stickRadius: 25
        // });	

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

            }, 25);
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
                        joyMovement(joyX, joyY);
                            
                    }
                    else if(joyDirX == 'left' && joyDirY == 'down'){

                        joyX = 4;
                        joyY = 3;
                        joyMovement(joyX, joyY);
                            
                    }
                    else if(joyDirY == 'up' && joyDirX == 'right'){

                        joyX = 2;
                        joyY = 1;
                        joyMovement(joyX, joyY);
                            
                    }
                    else if(joyDirY == 'down' && joyDirX == 'right'){

                        joyX = 2;
                        joyY = 3;
                        joyMovement(joyX, joyY);
                            
                    }
                    else if(joyDirX == 'left'){

                        joyX = 4;
                        joyY = 0;
                        joyMovement(joyX, joyY);		
                            
                    }
                    else if(joyDirX == 'right'){

                        joyX = 2;
                        joyY = 0;
                        joyMovement(joyX, joyY);													
                            
                    }
                    else if(joyDirY == 'up'){

                        joyX = 0;
                        joyY = 1;
                        joyMovement(joyX, joyY);	
                            
                    }
                    else if(joyDirY == 'down'){

                        joyX = 0;
                        joyY = 3;	
                        joyMovement(joyX, joyY);							
                            
                    }
                
                }
        }, 120);
		
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

                // joyStick_X = (window.innerWidth) * .91;
                // joyStick_Y = (window.innerHeight) * .55;	
                joyStickX = (window.innerWidth) * .07;
                joyStickY = (window.innerHeight) * 0.55;

                if(joystick != undefined){

                    joystick.destroy();
                }   

                joystick = new VirtualJoystick({
                    container: document.getElementById('joystick'),
                    mouseSupport: true,
                    limitStickTravel: true,
                    stationaryBase: true, // to make the joystick appear anywhere, set to false and comment out BaseX and BaseY
                            baseX: joyStickX, // this size is only good for mobile maybe not tablets
                            baseY: joyStickY, // this size is only good for mobile maybe not tablets
                    stickRadius: 25
                });   
            
                if(canvas.width >= 241){
                    
                    
                }
                
                if(canvas.width <= 300){
                    
                    document.getElementById('joystick').style.display = 'inline-block';
                    document.getElementById('rotation-message').style.display = 'none';
                }
                if(canvas.width >= 350){

                    document.getElementById('joystick').style.display = 'none';
                    document.getElementById('rotation-message').style.display = 'block';
                    
                }		
                if(canvas.width > 350 && canvas.width <= 595){
                    
                 }
                 if(canvas.width >= 596){
        
                 }	
                
                redraw();
            }
        
    }

}());