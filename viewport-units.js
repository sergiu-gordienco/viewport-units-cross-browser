(function() {
	if (!Event.prototype.preventDefault) {
		Event.prototype.preventDefault=function() {
			this.returnValue=false;
		};
	}
	if (!Event.prototype.stopPropagation) {
		Event.prototype.stopPropagation=function() {
			this.cancelBubble=true;
		};
	}
	if (!Element.prototype.addEventListener) {
		var eventListeners=[];
		
		var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
			var self=this;
			var wrapper=function(e) {
				e.target=e.srcElement;
				e.currentTarget=self;
				if (listener.handleEvent) {
					listener.handleEvent(e);
				} else {
					listener.call(self,e);
				}
			};
			if (type=="DOMContentLoaded") {
				var wrapper2=function(e) {
					if (document.readyState=="complete") {
						wrapper(e);
					}
				};
				document.attachEvent("onreadystatechange",wrapper2);
				eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
				
				if (document.readyState=="complete") {
					var e=new Event();
					e.srcElement=window;
					wrapper2(e);
				}
			} else {
				this.attachEvent("on"+type,wrapper);
				eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
			}
		};
		var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
			var counter=0;
			while (counter<eventListeners.length) {
				var eventListener=eventListeners[counter];
				if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
					if (type=="DOMContentLoaded") {
						this.detachEvent("onreadystatechange",eventListener.wrapper);
					} else {
						this.detachEvent("on"+type,eventListener.wrapper);
					}
					eventListeners.splice(counter, 1);
					break;
				}
				++counter;
			}
		};
		Element.prototype.addEventListener=addEventListener;
		Element.prototype.removeEventListener=removeEventListener;
		if (HTMLDocument) {
			HTMLDocument.prototype.addEventListener=addEventListener;
			HTMLDocument.prototype.removeEventListener=removeEventListener;
		}
		if (Window) {
			Window.prototype.addEventListener=addEventListener;
			Window.prototype.removeEventListener=removeEventListener;
		}
	}
})();

if (typeof(window.getWindowSize) !== "function") {
	window.getWindowSize_v = {w:800,h:600};
	window.getWindowSize_limit	= {
		min	: {
			w	: false,
			h	: false
		},
		max	: {
			w	: false,
			h	: false
		}
	};
	window.getWindowSize_fRaw	= function(){	return {w:800,h:600} };
	((function(){
		if(typeof(window.innerWidth)=='number') {
			window.getWindowSize_fRaw = function(o){
				if(typeof(o) == "object" && ('window' in o))	return { w: o.window.innerWidth,h:o.window.innerHeight };
				return { w: window.innerWidth,h:window.innerHeight };
			}
		} else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			window.getWindowSize_fRaw = function(o){
				if(typeof(o) == "object" && ('document' in o))	return { w: o.document.documentElement.clientWidth,h: o.document.documentElement.clientHeight };
				return { w: document.documentElement.clientWidth,h: document.documentElement.clientHeight };
			}
		} else if(document.body && (document.body.clientWidth || document.body.clientHeight)){/*IE 4 compatible*/
			window.getWindowSize_fRaw = function(o){
				if(typeof(o) == "object" && ('document' in o))	return { w: o.document.body.clientWidth, h: o.document.body.clientHeight };
				return { w: document.body.clientWidth, h: document.body.clientHeight };
			}
		} else if(parseInt(navigator.appVersion)>3) {
			if(navigator.appName=="Netscape") {
				window.getWindowSize_fRaw = function(o){
					if(typeof(o) == "object" || !('window' in o))	return { w: o.window.innerWidth, h: o.window.innerHeight};
					return { w: window.innerWidth, h: window.innerHeight};
				}
			};
			if(navigator.appName.indexOf("Microsoft")!=-1) {
				window.getWindowSize_fRaw = function(o){
					if(typeof(o) == "object" && ('document' in o))	return { w: o.document.body.offsetWidth, h : o.document.body.offsetHeight };
					return { w : document.body.offsetWidth, h : document.body.offsetHeight };
				}
			}
		}
	})());
	window.getWindowSize_f	= function () {
		var size	= getWindowSize_fRaw();
		if (getWindowSize_limit.min.w !== false) {
			size.w	= Math.max( size.w, getWindowSize_limit.min.w );
		}
		if (getWindowSize_limit.min.h !== false) {
			size.h	= Math.max( size.h, getWindowSize_limit.min.h );
		}
		if (getWindowSize_limit.max.w !== false) {
			size.w	= Math.min( size.w, getWindowSize_limit.max.w );
		}
		if (getWindowSize_limit.max.h !== false) {
			size.h	= Math.min( size.h, getWindowSize_limit.max.h );
		}
		return size;
	};
	getWindowSize_v = ((function(){var e;try{return getWindowSize_f()}catch(e){return {w:240,h:360}}})());
	window.getWindowSize	= function (i){if(i)return getWindowSize_f();return getWindowSize_v;};
	setInterval(function() {
		getWindowSize_v = getWindowSize(true);
	}, 1000);
};


var viewportUnits	= ((function () {
	var cronTimer	= false;
	var config	= {
		refresh	: 900,
		onErrorStop	: false
	};
	var methods	= {};
	methods.functions	= {
		vh	: function (win, v) {
			return Math.round(win.h / 100 * (parseFloat(v) || 0))+'.01px';
		},
		vw	: function (win, v) {
			return Math.round(win.w / 100 * (parseFloat(v) || 0))+'.01px';
		},
		vmin	: function (win, v) {
			return Math.round(Math.min(win.h, win.w) / 100 * (parseFloat(v) || 0))+'.01px';
		},
		vmax	: function (win, v) {
			return Math.round(Math.max(win.h, win.w) / 100 * (parseFloat(v) || 0))+'.01px';
		}
	};
	methods.config	= function (conf) {
		var i;
		if (conf && typeof(conf) === "object") {
			for (i in config) {
				if (i in conf) {
					if (typeof(conf[i]) !== "undefined" && typeof(conf[i]) === typeof(config[i])) {
						config[i]	= conf[i];
					}
				}
			}
		}
		return config;
	};
	methods.styles	= function () {
		var list	= [];
		Array.prototype.slice.call(document.querySelectorAll('[application-style~="viewport-units"]')).forEach(function (node) {
			list.push(node);
		});
		// Array.prototype.slice.call(document.querySelectorAll('[style]')).forEach(function (node) {
		// 	list.push(node);
		// });
		return list;
	};
	methods.updateStyle	= function (css) {
		var win	= getWindowSize();
		// console.log(css.replace(/((?=[\d\.])[\d\.]+(vh|vmin|vw|vmax)(?![\/\*]))/gi, function (m0, m1, m2, offset, str) {
		// 	return m1 + '/*viewport-hack:'+m1+'*/';
		// }));
		return css.replace(/((?=[\d\.])[\d\.]+(vh|vmin|vw|vmax)(?![\/\*]))/gi, function (m0, m1, m2, offset, str) {
			return m1 + '/*viewport-hack:'+m1+'*/';
		}).replace(/(\D)([\d+\.]+(px|vh|vmin|vw|vmax))(\/\*viewport\-hack\:([\d\.]+)(vh|vmin|vw|vmax)\*\/)/gi, function (m0, m1, m2, m3, m4, m5, m6) {
			return m1 + ((methods.functions[m6.toLowerCase()])(win, m5)) + m4;
		});
	};
	methods.run		= function () {
		methods.styles().forEach(function (node) {
			if (node.matches('[application-style~="viewport-units"]')) {
				node.textContent	= methods.updateStyle(node.text || node.textContent || '');
			}
		});
		return methods;
	};
	methods.stop	= function () {
		var er;
		try {
			clearInterval(cronTimer);
		} catch(er) {}
		cronTimer	= false;
		return methods;
	};
	methods.start	= function () {
		methods.stop();
		cronTimer	= setInterval(function () {
			var er;
			try {
				methods.run();
			} catch(er) {
				console.log("viewportUnits.run error", er);
				if (config.onErrorStop) {
					methods.stop();
				}
			}
		}, config.refresh);
		return methods;
	};
	methods.init	= function (conf) {
		methods.stop();
		if (conf) {
			methods.config(conf);
		}
		methods.start();
		return methods;
	}

	window.on	= function (eventName, callback) {
		return window.addEventListener(eventName, callback, false);
	};

	window.on('orientationchange', function () {
		var er;
		try {
			if (cronTimer !== false) {
				methods.run();
			}
		} catch(er) {}
	});
	window.on('resize', function () {
		var er;
		try {
			if (cronTimer !== false) {
				methods.run();
			}
		} catch(er) {}
	});
	return methods;
})());
