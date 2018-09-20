	let calcDelta = Module.cwrap('calc_delta', 'number', ['number']);

	let  VirtualJoystick = function(opt){
		
			let opts			= opt			|| {};
			this._container		= opts.container	|| document.body;
			this._strokeStyle	= opts.strokeStyle	|| '#4b0082'; //white//'#333333';// this changes the color of the joystick
			this._stickEl		= opts.stickElement	|| _buildJoystickStick(this._strokeStyle);
			this._baseEl		= opts.baseElement	|| _buildJoystickBase(this._baseEl);
			this._mouseSupport	= opts.mouseSupport !== undefined ? opts.mouseSupport : false;
			this._stationaryBase	= opts.stationaryBase || false;
			this._baseX		= this._stickX = opts.baseX || 0;
			this._baseY		= this._stickY = opts.baseY || 0;
			this._limitStickTravel	= opts.limitStickTravel || false;
			this._stickRadius	= opts.stickRadius !== undefined ? opts.stickRadius : 100;
			this._useCssTransform	= opts.useCssTransform !== undefined ? opts.useCssTransform : false;
		
			this._container.style.position	= "absolute";
		
					this._container.appendChild(this._baseEl);
					this._baseEl.style.position	= "absolute";
					this._baseEl.style.display	= "none";
					this._baseEl.style.border = "1px solid white";
					this._baseEl.style.borderRadius = "50px";
					this._container.appendChild(this._stickEl);
					this._stickEl.style.position	= "absolute";
					this._stickEl.style.display	= "none";
		
					this._pressed	= false;
					this._touchIdx	= null;
					
					if(this._stationaryBase === true){
						this._baseEl.style.display	= "";
						this._baseEl.style.left		= (this._baseX - this._baseEl.width /2)+"px";
						this._baseEl.style.top		= (this._baseY - this._baseEl.height/2)+"px";
					}
					
					this._transform	= this._useCssTransform ? this._getTransformProperty() : false;
					this._has3d	= true;
					
					 function __bind(fn, me){ return function(){ return fn.apply(me, arguments); }; };
					this._$onTouchStart	= __bind(this._onTouchStart	, this);
					this._$onTouchEnd	= __bind(this._onTouchEnd	, this);
					this._$onTouchMove	= __bind(this._onTouchMove	, this);
					this._container.addEventListener( 'touchstart'	, this._$onTouchStart	, false );
					this._container.addEventListener( 'touchend'	, this._$onTouchEnd	, false );
					this._container.addEventListener( 'touchmove'	, this._$onTouchMove	, false );
					if( this._mouseSupport ){
						this._$onMouseDown	= __bind(this._onMouseDown	, this);
						this._$onMouseUp	= __bind(this._onMouseUp	, this);
						this._$onMouseMove	= __bind(this._onMouseMove	, this);
						this._container.addEventListener( 'mousedown'	, this._$onMouseDown	, false );
						this._container.addEventListener( 'mouseup'	, this._$onMouseUp	, false );
						this._container.addEventListener( 'mousemove'	, this._$onMouseMove	, false );
					}
		}
		
		
		VirtualJoystick.prototype.destroy	= function()
				{
					this._container.removeChild(this._baseEl);
					this._container.removeChild(this._stickEl);
		
					this._container.removeEventListener( 'touchstart'	, this._$onTouchStart	, false );
					this._container.removeEventListener( 'touchend'		, this._$onTouchEnd	, false );
					this._container.removeEventListener( 'touchmove'	, this._$onTouchMove	, false );
					if( this._mouseSupport ){
						this._container.removeEventListener( 'mouseup'		, this._$onMouseUp	, false );
						this._container.removeEventListener( 'mousedown'	, this._$onMouseDown	, false );
						this._container.removeEventListener( 'mousemove'	, this._$onMouseMove	, false );
					}
				}
		
				;(function(destObj){
					destObj.addEventListener	= function(event, fct){
						if(this._events === undefined) 	this._events	= {};
						this._events[event] = this._events[event]	|| [];
						this._events[event].push(fct);
						return fct;
					};
					destObj.removeEventListener	= function(event, fct){
						if(this._events === undefined) 	this._events	= {};
						if( event in this._events === false  )	return;
						this._events[event].splice(this._events[event].indexOf(fct), 1);
					};
					destObj.dispatchEvent		= function(event /* , args... */){
						if(this._events === undefined) 	this._events	= {};
						if( this._events[event] === undefined )	return;
						let tmpArray	= this._events[event].slice(); 
						for(let i = 0; i < tmpArray.length; i++){
							let result	= tmpArray[i].apply(this, Array.prototype.slice.call(arguments, 1))
							if( result !== undefined )	return result;
						}
						return undefined
					};
				})(VirtualJoystick.prototype);
		
				//////////////////////////////////////////////////////////////////////////////////
				//										//
				//////////////////////////////////////////////////////////////////////////////////

				VirtualJoystick.prototype.deltaX	= function(){ return calcDelta(this._stickX, this._baseX);	}
				VirtualJoystick.prototype.deltaY	= function(){ return calcDelta(this._stickY, this._baseY);	}
		
				VirtualJoystick.prototype.up	= function(){
					if( this._pressed === false )	return false;
					let deltaX	= this.deltaX();
					let deltaY	= this.deltaY();
					if( deltaY >= 0 )				return false;
					if( Math.abs(deltaX) > 2*Math.abs(deltaY) )	return false;
					return true;
				}
				VirtualJoystick.prototype.down	= function(){
					if( this._pressed === false )	return false;
					let deltaX	= this.deltaX();
					let deltaY	= this.deltaY();
					if( deltaY <= 0 )				return false;
					if( Math.abs(deltaX) > 2*Math.abs(deltaY) )	return false;
					return true;	
				}
				VirtualJoystick.prototype.right	= function(){
					if( this._pressed === false )	return false;
					let deltaX	= this.deltaX();
					let deltaY	= this.deltaY();
					if( deltaX <= 0 )				return false;
					if( Math.abs(deltaY) > 2*Math.abs(deltaX) )	return false;
					return true;	
				}
				VirtualJoystick.prototype.left	= function(){
					if( this._pressed === false )	return false;
					let deltaX	= this.deltaX();
					let deltaY	= this.deltaY();
					if( deltaX >= 0 )				return false;
					if( Math.abs(deltaY) > 2*Math.abs(deltaX) )	return false;
					return true;	
				}
		
				//////////////////////////////////////////////////////////////////////////////////
				//										//
				//////////////////////////////////////////////////////////////////////////////////
		
				VirtualJoystick.prototype._onUp	= function()
				{
					this._pressed	= false; 
					this._stickEl.style.display	= "none";
					
					if(this._stationaryBase == false){	
						this._baseEl.style.display	= "none";
					
						this._baseX	= this._baseY	= 0;
						this._stickX	= this._stickY	= 0;
					}
				}
		
				VirtualJoystick.prototype._onDown	= function(x, y)
				{
					this._pressed	= true; 
					
					this._stickX	= x;
					this._stickY	= y;
				}
		
				VirtualJoystick.prototype._onMove	= function(x, y)
				{
					if( this._pressed === true ){
						this._stickX	= x;
						this._stickY	= y;
					}	
				}
		
		
				//////////////////////////////////////////////////////////////////////////////////
				//		bind touch events (and mouse events for debug)			//
				//////////////////////////////////////////////////////////////////////////////////
		
				VirtualJoystick.prototype._onMouseUp	= function(event)
				{
					return this._onUp();
				}
		
				VirtualJoystick.prototype._onMouseDown	= function(event)
				{
					event.preventDefault();
					let x	= event.clientX;
					let y	= event.clientY;
					return this._onDown(x, y);
				}
		
				VirtualJoystick.prototype._onMouseMove	= function(event)
				{
					let x	= event.clientX;
					let y	= event.clientY;
					return this._onMove(x, y);
				}
		
				//////////////////////////////////////////////////////////////////////////////////
				//		comment								//
				//////////////////////////////////////////////////////////////////////////////////
		
				VirtualJoystick.prototype._onTouchStart	= function(event)
				{
					// if there is already a touch inprogress do nothing
					if( this._touchIdx !== null )	return;
		
					// notify event for validation
					let isValid	= this.dispatchEvent('touchStartValidation', event);
					if( isValid === false )	return;
					
					// dispatch touchStart
					this.dispatchEvent('touchStart', event);
		
					event.preventDefault();
					// get the first who changed
					let touch	= event.changedTouches[0];
					// set the touchIdx of this joystick
					this._touchIdx	= touch.identifier;
		
					// forward the action
					let x		= touch.pageX;
					let y		= touch.pageY;
					return this._onDown(x, y)
				}
		
				VirtualJoystick.prototype._onTouchEnd	= function(event)
				{
					// if there is no touch in progress, do nothing
					if( this._touchIdx === null )	return;
		
					// dispatch touchEnd
					this.dispatchEvent('touchEnd', event);
		
					// try to find our touch event
					let touchList	= event.changedTouches;
					for(let i = 0; i < touchList.length && touchList[i].identifier !== this._touchIdx; i++){
		
						// if touch event isnt found, 
					if( i === touchList.length)	{return}
					}
					
		
					// reset touchIdx - mark it as no-touch-in-progress
					this._touchIdx	= null;
		
				//??????
				// no preventDefault to get click event on ios
				event.preventDefault();
		
					return this._onUp()
				}
		
				VirtualJoystick.prototype._onTouchMove	= function(event)
				{
					// if there is no touch in progress, do nothing
					if( this._touchIdx === null )	return;
		
					// try to find our touch event
					let touchList	= event.changedTouches;
					for(var i = 0; i < touchList.length && touchList[i].identifier !== this._touchIdx; i++ );
					// if touch event with the proper identifier isnt found, do nothing
					if( i === touchList.length)	return;
					var touch	= touchList[i];
		
					event.preventDefault();
		
					var x		= touch.pageX;
					var y		= touch.pageY;
					return this._onMove(x, y)
				}
		
		
				//////////////////////////////////////////////////////////////////////////////////
				//		build default stickEl and baseEl				//
				//////////////////////////////////////////////////////////////////////////////////
		
				/**
				 * build the canvas for joystick base
				 */
				function _buildJoystickBase(stroke)
				{
					let canvas	= document.createElement( 'canvas' );
					canvas.width	= 50; //126 //100
					canvas.height	= 50; //126 //100
					
					let ctx		= canvas.getContext('2d');
					ctx.beginPath(); 
					ctx.strokeStyle = stroke; 
					ctx.lineWidth	= 3; //6				//40
					ctx.arc( canvas.width/2, canvas.width/2, 23, 0, Math.PI*2, true); 
					ctx.stroke();	
		
					ctx.beginPath(); 
					ctx.strokeStyle	= stroke; 
					ctx.lineWidth	= 2; 					//60
					ctx.arc( canvas.width/2, canvas.width/2, 33, 0, Math.PI*2, true); 
					ctx.stroke();
					
					return canvas;
				}
		
				/**
				 * build the canvas for joystick stick
				 */
				function _buildJoystickStick(stroke)
				{
					let canvas	= document.createElement( 'canvas' );
					canvas.width	= 86;
					canvas.height	= 86;
					let ctx		= canvas.getContext('2d');
					ctx.beginPath(); 
					ctx.strokeStyle	= stroke; 
					ctx.lineWidth	= 6; 
					ctx.arc( canvas.width/2, canvas.width/2, 40, 0, Math.PI*2, true); 
					ctx.stroke();
					return canvas;
				}
		
				//////////////////////////////////////////////////////////////////////////////////
				//		move using translate3d method with fallback to translate > 'top' and 'left'		
				//      modified from https://github.com/component/translate and dependents
				//////////////////////////////////////////////////////////////////////////////////
		
				VirtualJoystick.prototype._getTransformProperty = function() 
				{
					let styles = [
						'webkitTransform',
						'MozTransform',
						'msTransform',
						'OTransform',
						'transform'
					];
		
					let el = document.createElement('p');
					let style;
		
					for (let i = 0; i < styles.length; i++) {
						style = styles[i];
						if (null != el.style[style]) {
							return style;
						}
					}         
				}