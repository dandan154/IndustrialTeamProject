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

        var _minDate, _maxDate;

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