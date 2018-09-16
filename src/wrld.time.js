/**
 * wrld.time.js - Time Series visualisation plugin
 */

L.Control.TimeSlider = L.Control.extend({

    /**
     * Control options
     */
    options: {
        position: 'bottomleft',
        layers: null,
        maxValue: -1,
        minValue: 0
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
        
    },

    /**
     * Called when the control is added to the map
     */
    onAdd: function(map) {
        this.options.map = map;

        // Create the container
        var sliderComponent = L.DomUtil.create('div', 'time-container', this._container);
        sliderComponent.innerHTML = `Time: [Time stamp]<br><input type="range" id="time-slider" />`;

        return sliderComponent;
    },

    /**
     * Called when the control is removed from the map
     */
    onRemove: function(map) {

    }
});

L.control.timeSlider = function(options) {
    return new L.Control.TimeSlider(options);
}