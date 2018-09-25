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

/**
 * Calculates the number of days from a given other date
 * @param {Date} other the other date
 */
Date.prototype.daysFrom = function(other) {
    return Math.round(Math.abs((this.getTime() - other.getTime())/(24*60*60*1000)));
}

/**
 * Returns the date that is the number of days from this date
 * @param {Date} days the number of days to add
 */
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

class WrldTime {

    constructor(map, data, options = {}) {
        this._map = map;
        this.setData(data);
        this.displaySlider();
    }

    /**
     * Sets the data for the time layer
     * @param {*} data the GeoJSON data
     */
    setData(data) {
        this.data = data;

        var _minDate, _maxDate, _steps;

        data.features.forEach(feature => {
            var date = new Date(feature.properties.date);

            if (_minDate == undefined) { _minDate = date; }
            if (_maxDate == undefined) { _maxDate = date; }
            
            if (date <= _minDate) _minDate = date;
            if (date >= _maxDate) _maxDate = date;
        });

        this._minDate = _minDate;

        this._steps = _minDate.daysFrom(_maxDate);

        this.setupTimeLayer();
    }

    /**
     * Display the slider
     */
    displaySlider() {
        this._sliderContainer = document.createElement('div');
        this._slider = document.createElement('input');

        this._slider.type = 'range';
        this._slider.classList.add('time-slider');
        this._slider.addEventListener('input', this.setupTimeLayer.bind(this));
        this._slider.min = 0;
        this._slider.max = this._steps;

        this._sliderContainer.innerHTML = `Time: [Time stamp]<br>`;
        this._sliderContainer.append(this._slider);
        this._sliderContainer.classList.add('time-container');

        this._map._container.parentElement.parentElement.append(this._sliderContainer);
    }

    /**
     * Setup the time layer
     */
    setupTimeLayer() {
        if (this._layer != undefined) {
            this._layer.remove();
        }

        this._layer = L.geoJSON(this.data, {
            filter: this.shouldShowFeature.bind(this)
        });
        this._layer.addTo(this._map);
    }

    /**
     * Returns true if the given feature should be displayed
     * @param {GeoJSON} feature the feature to test
     */
    shouldShowFeature(feature) {
        return (new Date(feature.properties.date)) <= this._minDate.addDays((this._slider) ? this._slider.value : 0);
    }

}

function wrldTime(map, data, options) {
    return new WrldTime(map, data, options);
}

//TODO: CSS - FIX BUTTON STYLING - font awesome
class WrldTimeUI{

    constructor(map, options={}){
        //Variables for button
        this._prevHeading = 0;
        this._prevTilt = 0;
        this._newHeading = 0;
        this._newTilt = 0;
        this._animateCamera = true;

        this._menu = this.createMenu(); 
        this._zoom = this.createZoom();
        this._toggle = this.createToggleBtn(map, this._menu);
        this._toggle.addTo(map); 
        this._zoom.addTo(map); 
        this._isActive = true; 
    }

    createToggleBtn(map, menu){
        


        var toggle = L.easyButton({
            id:'toggle',
            position: 'topleft',
            states: [{
              stateName: 'turn-on',
              icon: 'Turn Heatmap On <i class="fas fa-toggle-off"></i>',
              title: 'Turn On Heatmap',

              /**
               * This controls what happens when the button is clicked
               */
              onClick: function(control) {
                
                //Sets the previous heading and tilt for the camera when heatmap is toggled off
                this._prevHeading = map.getCameraHeadingDegrees();
                this._prevTilt = map.getCameraTiltDegrees();
                
                //This changes the view of the camera
                map.setView(map.getCenter(), map.getZoom(), {
                    headingDegrees: this._newHeading,
                    tiltDegrees: this._newTilt,
                    animate: this._animateCamera
                });

                menu.addTo(map); 

                //Changes the control state
                control.state('turn-off'); //This is the stateName this button changes to
              }
            }, {
              icon: 'Turn Heatmap Off <i class="fas fa-toggle-on"></i>',
              stateName: 'turn-off',
              title: 'Turn Off Heatmap',

              /**
               * This controls what happens when the button is clicked
               */
              onClick: function(control) {
                  
                //Sets the view the button toggles
                map.setView(map.getCenter(), map.getZoom(), {
                    headingDegrees: this._prevHeading,
                    tiltDegrees: this._prevTilt,
                    animate: this._animateCamera
                });

                menu.remove(map); 
                
                //Changes the button state
                control.state('turn-on'); //This is the stateName this button changes to
              }
            }]
        });

        return toggle; 
    }

    createMenu(){

        var menu = [
                
            //This is the colour button
            L.easyButton(
                '<i class="fas fa-paint-brush"></i>',
                function(){
                    //TODO edit heatmaps colours
                },
                'Change the colours of the heatmap',
                'colour-change-button'
            ),
            
            //This is the Opacity button
            L.easyButton(
                '<i class="fas fa-glasses"></i>',
                function(){
                    //TODO edit heatmaps opacity
                },
                'Change the Opacity of the heatmap',
                'opacity-button'
            ),
    
            //This is the manual birds eye view button
            L.easyButton(
                '<i class="fas fa-redo-alt"></i>',
                function(){
                    map.setView(map.getCenter(), map.getZoom(), {
                    headingDegrees: this._newHeading,
                    tiltDegrees: this._newTilt,
                    animate: this._animateCamera
                });
                },
                'Reset the view',
                'reset-view'
            )
        ];
    
        return L.easyBar(menu); 
    }

    createZoom(){
        var zoombuttons = L.control.zoom({
            position:'topright'
           })

        return zoombuttons; 
    }
}


function wrldTimeUI(map) {
    return new WrldTimeUI(map);
}