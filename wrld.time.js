/*
 (c) 2014, Vladimir Agafonkin
 simpleheat, a tiny JavaScript library for drawing heatmaps with Canvas
 https://github.com/mourner/simpleheat
*/
!function(){"use strict";function t(i){return this instanceof t?(this._canvas=i="string"==typeof i?document.getElementById(i):i,this._ctx=i.getContext("2d"),this._width=i.width,this._height=i.height,this._max=1,void this.clear()):new t(i)}t.prototype={defaultRadius:25,defaultGradient:{.4:"blue",.6:"cyan",.7:"lime",.8:"yellow",1:"red"},data:function(t,i){return this._data=t,this},max:function(t){return this._max=t,this},add:function(t){return this._data.push(t),this},clear:function(){return this._data=[],this},radius:function(t,i){i=i||15;var a=this._circle=document.createElement("canvas"),s=a.getContext("2d"),e=this._r=t+i;return a.width=a.height=2*e,s.shadowOffsetX=s.shadowOffsetY=200,s.shadowBlur=i,s.shadowColor="black",s.beginPath(),s.arc(e-200,e-200,t,0,2*Math.PI,!0),s.closePath(),s.fill(),this},gradient:function(t){var i=document.createElement("canvas"),a=i.getContext("2d"),s=a.createLinearGradient(0,0,0,256);i.width=1,i.height=256;for(var e in t)s.addColorStop(e,t[e]);return a.fillStyle=s,a.fillRect(0,0,1,256),this._grad=a.getImageData(0,0,1,256).data,this},draw:function(t){this._circle||this.radius(this.defaultRadius),this._grad||this.gradient(this.defaultGradient);var i=this._ctx;i.clearRect(0,0,this._width,this._height);for(var a,s=0,e=this._data.length;e>s;s++)a=this._data[s],i.globalAlpha=Math.max(a[2]/this._max,t||.05),i.drawImage(this._circle,a[0]-this._r,a[1]-this._r);var n=i.getImageData(0,0,this._width,this._height);return this._colorize(n.data,this._grad),i.putImageData(n,0,0),this},_colorize:function(t,i){for(var a,s=3,e=t.length;e>s;s+=4)a=4*t[s],a&&(t[s-3]=i[a],t[s-2]=i[a+1],t[s-1]=i[a+2])}},window.simpleheat=t}(),

/*
 (c) 2014, Vladimir Agafonkin
 Leaflet.heat, a tiny and fast heatmap plugin for Leaflet.
 https://github.com/Leaflet/Leaflet.heat
*/
L.HeatLayer=(L.Layer?L.Layer:L.Class).extend({initialize:function(t,i){this._latlngs=t,L.setOptions(this,i)},setLatLngs:function(t){return this._latlngs=t,this.redraw()},addLatLng:function(t){return this._latlngs.push(t),this.redraw()},setOptions:function(t){return L.setOptions(this,t),this._heat&&this._updateOptions(),this.redraw()},redraw:function(){return!this._heat||this._frame||this._map._animating||(this._frame=L.Util.requestAnimFrame(this._redraw,this)),this},onAdd:function(t){this._map=t,this._canvas||this._initCanvas(),t._panes.overlayPane.appendChild(this._canvas),t.on("moveend",this._reset,this),t.options.zoomAnimation&&L.Browser.any3d&&t.on("zoomanim",this._animateZoom,this),this._reset()},onRemove:function(t){t.getPanes().overlayPane.removeChild(this._canvas),t.off("moveend",this._reset,this),t.options.zoomAnimation&&t.off("zoomanim",this._animateZoom,this)},addTo:function(t){return t.addLayer(this),this},_initCanvas:function(){var t=this._canvas=L.DomUtil.create("canvas","leaflet-heatmap-layer leaflet-layer"),i=L.DomUtil.testProp(["transformOrigin","WebkitTransformOrigin","msTransformOrigin"]);t.style[i]="50% 50%";var a=this._map.getSize();t.width=a.x,t.height=a.y;var s=this._map.options.zoomAnimation&&L.Browser.any3d;L.DomUtil.addClass(t,"leaflet-zoom-"+(s?"animated":"hide")),this._heat=simpleheat(t),this._updateOptions()},_updateOptions:function(){this._heat.radius(this.options.radius||this._heat.defaultRadius,this.options.blur),this.options.gradient&&this._heat.gradient(this.options.gradient),this.options.max&&this._heat.max(this.options.max)},_reset:function(){var t=this._map.containerPointToLayerPoint([0,0]);L.DomUtil.setPosition(this._canvas,t);var i=this._map.getSize();this._heat._width!==i.x&&(this._canvas.width=this._heat._width=i.x),this._heat._height!==i.y&&(this._canvas.height=this._heat._height=i.y),this._redraw()},_redraw:function(){var t,i,a,s,e,n,h,o,r,d=[],_=this._heat._r,l=this._map.getSize(),m=new L.Bounds(L.point([-_,-_]),l.add([_,_])),c=void 0===this.options.max?1:this.options.max,u=void 0===this.options.maxZoom?this._map.getMaxZoom():this.options.maxZoom,f=1/Math.pow(2,Math.max(0,Math.min(u-this._map.getZoom(),12))),g=_/2,p=[],v=this._map._getMapPanePos(),w=v.x%g,y=v.y%g;for(t=0,i=this._latlngs.length;i>t;t++)if(a=this._map.latLngToContainerPoint(this._latlngs[t]),m.contains(a)){e=Math.floor((a.x-w)/g)+2,n=Math.floor((a.y-y)/g)+2;var x=void 0!==this._latlngs[t].alt?this._latlngs[t].alt:void 0!==this._latlngs[t][2]?+this._latlngs[t][2]:1;r=x*f,p[n]=p[n]||[],s=p[n][e],s?(s[0]=(s[0]*s[2]+a.x*r)/(s[2]+r),s[1]=(s[1]*s[2]+a.y*r)/(s[2]+r),s[2]+=r):p[n][e]=[a.x,a.y,r]}for(t=0,i=p.length;i>t;t++)if(p[t])for(h=0,o=p[t].length;o>h;h++)s=p[t][h],s&&d.push([Math.round(s[0]),Math.round(s[1]),Math.min(s[2],c)]);this._heat.data(d).draw(this.options.minOpacity),this._frame=null},_animateZoom:function(t){var i=this._map.getZoomScale(t.zoom),a=this._map._getCenterOffset(t.center)._multiplyBy(-i).subtract(this._map._getMapPanePos());L.DomUtil.setTransform?L.DomUtil.setTransform(this._canvas,a,i):this._canvas.style[L.DomUtil.TRANSFORM]=L.DomUtil.getTranslateString(a)+" scale("+i+")"}}),L.heatLayer=function(t,i){return new L.HeatLayer(t,i)};

/*
  (c) 2018, CliffCloud
  Leaflet.easyButton.
  https://github.com/CliffCloud/Leaflet.EasyButton
*/
!function(){function o(t,i){this.title=t.title,this.stateName=t.stateName?t.stateName:"unnamed-state",this.icon=L.DomUtil.create("span",""),L.DomUtil.addClass(this.icon,"button-state state-"+this.stateName.replace(/(^\s*|\s*$)/g,"")),this.icon.innerHTML=function(t){var i;t.match(/[&;=<>"']/)?i=t:(t=t.replace(/(^\s*|\s*$)/g,""),i=L.DomUtil.create("span",""),0===t.indexOf("fa-")?L.DomUtil.addClass(i,"fa "+t):0===t.indexOf("glyphicon-")?L.DomUtil.addClass(i,"glyphicon "+t):L.DomUtil.addClass(i,t),i=i.outerHTML);return i}(t.icon),this.onClick=L.Util.bind(t.onClick?t.onClick:function(){},i)}L.Control.EasyBar=L.Control.extend({options:{position:"topleft",id:null,leafletClasses:!0},initialize:function(t,i){i&&L.Util.setOptions(this,i),this._buildContainer(),this._buttons=[];for(var s=0;s<t.length;s++)t[s]._bar=this,t[s]._container=t[s].button,this._buttons.push(t[s]),this.container.appendChild(t[s].button)},_buildContainer:function(){this._container=this.container=L.DomUtil.create("div",""),this.options.leafletClasses&&L.DomUtil.addClass(this.container,"leaflet-bar easy-button-container leaflet-control"),this.options.id&&(this.container.id=this.options.id)},enable:function(){return L.DomUtil.addClass(this.container,"enabled"),L.DomUtil.removeClass(this.container,"disabled"),this.container.setAttribute("aria-hidden","false"),this},disable:function(){return L.DomUtil.addClass(this.container,"disabled"),L.DomUtil.removeClass(this.container,"enabled"),this.container.setAttribute("aria-hidden","true"),this},onAdd:function(){return this.container},addTo:function(t){this._map=t;for(var i=0;i<this._buttons.length;i++)this._buttons[i]._map=t;var s=this._container=this.onAdd(t),e=this.getPosition(),n=t._controlCorners[e];return L.DomUtil.addClass(s,"leaflet-control"),-1!==e.indexOf("bottom")?n.insertBefore(s,n.firstChild):n.appendChild(s),this}}),L.easyBar=function(){for(var t=[L.Control.EasyBar],i=0;i<arguments.length;i++)t.push(arguments[i]);return new(Function.prototype.bind.apply(L.Control.EasyBar,t))},L.Control.EasyButton=L.Control.extend({options:{position:"topleft",id:null,type:"replace",states:[],leafletClasses:!0,tagName:"button"},initialize:function(t,i,s,e){this.options.states=[],null!=e&&(this.options.id=e),this.storage={},"object"==typeof arguments[arguments.length-1]&&L.Util.setOptions(this,arguments[arguments.length-1]),0===this.options.states.length&&"string"==typeof t&&"function"==typeof i&&this.options.states.push({icon:t,onClick:i,title:"string"==typeof s?s:""}),this._states=[];for(var n=0;n<this.options.states.length;n++)this._states.push(new o(this.options.states[n],this));this._buildButton(),this._activateState(this._states[0])},_buildButton:function(){if(this.button=L.DomUtil.create(this.options.tagName,""),"button"===this.options.tagName&&this.button.setAttribute("type","button"),this.options.id&&(this.button.id=this.options.id),this.options.leafletClasses&&L.DomUtil.addClass(this.button,"easy-button-button leaflet-bar-part leaflet-interactive"),L.DomEvent.addListener(this.button,"dblclick",L.DomEvent.stop),L.DomEvent.addListener(this.button,"mousedown",L.DomEvent.stop),L.DomEvent.addListener(this.button,"mouseup",L.DomEvent.stop),L.DomEvent.addListener(this.button,"click",function(t){L.DomEvent.stop(t),this._currentState.onClick(this,this._map?this._map:null),this._map&&this._map.getContainer().focus()},this),"replace"==this.options.type)this.button.appendChild(this._currentState.icon);else for(var t=0;t<this._states.length;t++)this.button.appendChild(this._states[t].icon)},_currentState:{stateName:"unnamed",icon:document.createElement("span")},_states:null,state:function(t){return"string"==typeof t?this._activateStateNamed(t):"number"==typeof t&&this._activateState(this._states[t]),this},_activateStateNamed:function(t){for(var i=0;i<this._states.length;i++)this._states[i].stateName==t&&this._activateState(this._states[i])},_activateState:function(t){if(t!==this._currentState){"replace"==this.options.type&&(this.button.appendChild(t.icon),this.button.removeChild(this._currentState.icon)),t.title?this.button.title=t.title:this.button.removeAttribute("title");for(var i=0;i<this._states.length;i++)L.DomUtil.removeClass(this._states[i].icon,this._currentState.stateName+"-active"),L.DomUtil.addClass(this._states[i].icon,t.stateName+"-active");L.DomUtil.removeClass(this.button,this._currentState.stateName+"-active"),L.DomUtil.addClass(this.button,t.stateName+"-active"),this._currentState=t}},enable:function(){return L.DomUtil.addClass(this.button,"enabled"),L.DomUtil.removeClass(this.button,"disabled"),this.button.setAttribute("aria-hidden","false"),this},disable:function(){return L.DomUtil.addClass(this.button,"disabled"),L.DomUtil.removeClass(this.button,"enabled"),this.button.setAttribute("aria-hidden","true"),this},onAdd:function(t){var i=L.easyBar([this],{position:this.options.position,leafletClasses:this.options.leafletClasses});return this._anonymousBar=i,this._container=i.container,this._anonymousBar.container},removeFrom:function(t){return this._map===t&&this.remove(),this}}),L.easyButton=function(){var t=Array.prototype.concat.apply([L.Control.EasyButton],arguments);return new(Function.prototype.bind.apply(L.Control.EasyButton,t))}}();

/**
 * wrld.time.js - Time Series visualisation plugin
 */

//LEGACY - EXAMPLE BUTTON
/*
L.Control.ViewButton = L.Control.extend({

    options: {
        position: 'topleft',
		width: '80px',			//in pixels
		height: '50px',			//in pixels
		animateCamera: true,	//determines if the camera instantly snaps to new orientation
		tilt: 0, 				//Camera Tilt when active
		heading: 0				//Camera Heading when active
    },

	initialize: function(display, options){
		this.setDisplayText(display);
		L.setOptions(this, options);


	},

	_displayText: "",

	_buttonState: false,

	_prevCamHeading: 0,

	_prevCamTilt: 0,

	getDisplayText(){
		return this._displayText;
	},

	setDisplayText(displayText){
		this._displayText = displayText;
	},

	getPrevCamHeading: function(){
		return this._prevCamHeading;
	},

	setPrevCamHeading: function(newHeading){
		this._prevCamHeading = newHeading;
	},

	getPrevCamTilt: function(){
		return this._prevCamTilt;
	},

	setPrevCamTilt: function(newTilt){
		this._prevCamTilt = newTilt;
	},

	getButtonState: function(){return this._buttonState;},

	setButtonState: function(newState){this._buttonState = newState;},

    onAdd: function(map){

        var container = L.DomUtil.create('input', 'btn-container', this._container);
        container.style.width = this.options.width;
        container.style.height = this.options.height;
		container.type = 'button';
		container.value = this.getDisplayText();

        L.DomEvent.addListener(container, 'click', function(){

			if(this.getButtonState() == false){

				this.setPrevCamHeading(map.getCameraHeadingDegrees());
				this.setPrevCamTilt(map.getCameraTiltDegrees());

				console.log(this.options.animateCamera);

				map.setView(map.getCenter(), map.getZoom(), {
					headingDegrees: this.options.heading,
					tiltDegrees: this.options.tilt,
					animate: this.options.animateCamera
				});

				this.setButtonState(true);

			}else{

				map.setView(map.getCenter(), map.getZoom(), {
					headingDegrees: this.getPrevCamHeading(),
					tiltDegrees: this.getPrevCamTilt(),
					animate: this.options.animateCamera
				});

				this.setButtonState(false);

			}
        }, this)

        L.DomEvent.addListener(container, 'mouseover', function(){
            //TODO prevent dragging on map when over element
            //map.dragging = false;
        });

        return container;
    }
})
*/

L.Control.TimeSlider = L.Control.extend({

    /**
     * Control options
     */
    options: {
        position: 'bottomleft',
        layers: undefined,
        minValue: 0,
        maxValue: -1,
    },

    /**
     * Event listeners
     */
    listeners: {
        mousedown: undefined,
        mouseup: undefined,
    },

    /**
     * Initialization
     */
    initialize: function(options) {
        L.Util.setOptions(this, options);
        this._layer = this.options.layer;
    },

    /**
     * Called when the position of the map is set or changes
     */
    setPosition: function(position) {
        var map = this._map;

        if (map) map.removeControl(this);

        this.options.position = position;

        if (map) map.addControl(this);

        return this;
    },

    /**
     * Called when the control is added to the map
     */
    onAdd: function(map) {
        this.options.map = map;

        // Create the container
        var sliderComponent = L.DomUtil.create('div', 'time-container', this._container);
        sliderComponent.innerHTML = `Time: [Time stamp]<br><input type="range" id="time-slider" />`;

        // TODO: Stop map from panning when a mousedown event fires, and resume panning on a mouseup.

        return sliderComponent;
    },

    /**
     * Called when the control is removed from the map
     */
    onRemove: function(map) {
        // Delete all layers associated with the slider
        //this.options.markers.forEach(marker => {
        //    map.removeLayer(marker);
        //});

        // Remove event listeners
        //document.removeEventListener()
    },

    /**
     * Initiate the slider
     */
    initializeSlider: function(slider) {

        /**
         * Data points are stored as
         * {
         *  "yyyy-mm-dd hh:mm:ss" => [ marker1, marker2 ]
         * }
         */

        // TODO: Handle slider change event and call handleSldierChangeEvent

    },

    handleSliderChangeEvent: function(e) {

    }
});

L.control.timeSlider = function(options) {
    return new L.Control.TimeSlider(options);
};
