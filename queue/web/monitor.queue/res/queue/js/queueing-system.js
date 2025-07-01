function Blinker( elemid, duration ) {

       var _BLINKER_KEY_FLAG = 'rui-blinker-element';

	var _self = this; 
	var _elemid = elemid;  
	var _duration = duration || 5000; 

	var _DELAY = 390;
	var _cancelled; 
	var _period; 

	this._init = function() {
		_cancelled = 0; 
		_period = 0; 
	}
	this._hideElem = function() {
		var elemobj = $(_elemid);
		if (!elemobj.hasClass(_BLINKER_KEY_FLAG)) {
			this.stop(); 
			return; 
		} 

		elemobj.css({visibility: 'hidden'});
		elemobj.addClass('blinker-blink');
 
		if ( _period < _duration ) {
			setTimeout( _self._showElem, _DELAY ); 
			_period += _DELAY; 
		}
	}
	this._showElem = function() {
		var elemobj = $(_elemid);
		elemobj.css({visibility: 'visible'}); 
		
		if ( _cancelled == 0 ) { 
			if ( _period < _duration ) { 
				setTimeout( _self._hideElem, _DELAY ); 	
				_period += _DELAY; 
				return; 
			} 
		} 
		elemobj.removeClass('blinker-blink'); 
	} 
	this.start = function() { 
		var elemobj = $(_elemid);
		elemobj.addClass(_BLINKER_KEY_FLAG);

		this._init();
		this._hideElem(); 
		this._play(); 
	} 
	this.stop = function() { 
		_cancelled = 1; 

		var elemobj = $(_elemid);
		elemobj.removeClass(_BLINKER_KEY_FLAG);
		elemobj.removeClass('blinker-blink'); 
		elemobj.css({visibility: 'visible'}); 
	}
	this._play = function() {
		try {  
			var audio = document.createElement('audio');
			audio.setAttribute('src', '/res/queue/audio/ding.mp3');
			audio.play(); 
		} catch(e) {;} 
	} 
}; 
