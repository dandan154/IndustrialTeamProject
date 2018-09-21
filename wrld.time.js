/**
 * wrld.time.js - Time Series visualisation plugin
 */

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


/**
 * EasyButton creator Test
 */
L.Control.TestButton = L.Control.extend({

    /**
     * Control options
     */
    options: {
        position: 'topright',
    },

    /**
     * Called when the control is added to the map
     */
    onAdd: function(map) {
        // Create the button method
        var easyButton = new L.Control.EasyButton(
            //used to select the icon used on the button
           'fa-compass', 
           
           //function called when button is clicked
           function(){
               map.setCameraHeadingDegrees(45).setCameraTiltDegrees(0)
           },
           
           //Mouseover text
           'Move Camera to a Top Down Perspective'
         );

        return easyButton;
    }
});
