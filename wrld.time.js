/**
 * wrld.time.js - Time Series visualisation plugin
 */

L.Control.ViewButton = L.Control.extend({

    options: {
        position: 'topleft'
    },

    onAdd: function(map){
        var container = L.DomUtil.create('div', 'btn-container', this._container);
        container.style.width = '70px';
        container.style.height = '30px';

        L.DomEvent.addListener(container, 'click', function(){
            //TODO allow for going between the birds eye view and the main view
            map.setCameraHeadingDegrees(45).setCameraTiltDegrees(0);
        })

        L.DomEvent.addListener(container, 'mouseover', function(){
            //TODO prevent dragging on map when over element
            //map.dragging = false;
        });

        return container;
    }
});


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
        // Create the container
        var easyButton = new L.Control.EasyButton(
            /**
             * Choose the icon
             */   
           'fa-compass', 
           
           /**
            * Function EasyButton Carries out
            */
           function(){
               map.setCameraHeadingDegrees(45).setCameraTiltDegrees(0)
           },
           
           /**
            * This field is what text appears upon mouse hover
            */
           'Move Camera to a Top Down Perspective'
         );

        return easyButton;
    }
});

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
        this.options.markers.forEach(marker => {
            map.removeLayer(marker);
        });

        // Remove event listeners
        document.removeEventListener()
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
}

function topDownCamera()
{
    map.setCameraHeadingDegrees(45).setCameraTiltDegrees(0);
}
