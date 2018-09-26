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
        this.options = {
            heatmap: options.heatmap || false,
            showIndoorPointsExternally: false,
            heatmapIntensity: options.heatmapIntensity || 50,
            indoorHeatmapIntensity: options.indoorHeatmapIntensity || 1,
            verticalPosition: options.verticalPosition || 'top',
            horizontalPosition: options.horizontalPosition || 'left'
        }
        this._map = map;

        if (typeof(data) == 'string') {
            // Load data from URL
            var req = new XMLHttpRequest();
            var url = data;

            req.onreadystatechange = (e) => {
                if (req.readyState == 4 && req.status == 200) {
                    let res = JSON.parse(req.responseText);
                    console.log(res);
                    this.setData(res);
                    this.displaySlider();
                }
            };
            req.open("GET", url, true);
            req.send();
        } else {
            this.setData(data);
            this.displaySlider();
        }


        // Handle indoor map interactions
        this._map.indoors.on('indoormapenter', () => {
            var changed = false;
            if (this._layer != undefined) {
                this._layer.options.indoorMapId = this._map.indoors.getActiveIndoorMap().getIndoorMapId();
                this._layer.options.indoorMapFloorId = this._map.indoors.getFloor().getFloorIndex();
                changed = true;
            }
            if (this._heatmapLayer != undefined) {
                this._heatmapLayer.options.indoorMapId = this._map.indoors.getActiveIndoorMap().getIndoorMapId();
                this._heatmapLayer.options.indoorMapFloorId = this._map.indoors.getFloor().getFloorIndex();
                this._heatmapLayer.options.intensityFactor = this.options.indoorHeatmapIntensity;
                changed = true;
            }
            if (changed) this.setupTimeLayer();
        }); 
        this._map.indoors.on('indoormapexit', () => {
            var changed = false;
            if (this._layer != undefined) {
                this._layer.options.indoorMapId = undefined;
                this._layer.options.indoorMapFloorId = undefined;
                changed = true;
            }
            if (this._heatmapLayer != undefined) { 
                this._heatmapLayer.options.indoorMapId = undefined;
                this._heatmapLayer.options.indoorMapFloorId = undefined;
                this._heatmapLayer.options.intensityFactor = this.options.heatmapIntensity;
                changed = true;
            }
            if (changed) this.setupTimeLayer();
        });
        this._map.indoors.on('indoormapfloorchange', this.setupTimeLayer.bind(this));
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
        if (this._container == undefined) {
            this._container = document.createElement('div');
            this._sliderContainer = document.createElement('div');
            this._slider = document.createElement('input');
            this._sliderTimestamp = document.createElement('span');
        }
        
        this._slider.type = 'range';
        this._slider.classList.add('time-slider');
        this._slider.addEventListener('input', this.setupTimeLayer.bind(this));
        this._slider.min = 0;
        this._slider.max = this._steps;

        this._sliderContainer.innerHTML = `Time:`;
        this._sliderContainer.append(document.creat)
        this._sliderContainer.append(this._slider);
        this._sliderContainer.classList.add('time-slider-container');

        this._container.append(this._sliderContainer);
        this._container.classList.add('time-container');
        switch (this.options.verticalPosition) {
            case 'top': this._container.style.alignItems = 'flex-start'; break;
            case 'bottom': this._container.style.alignItems = 'flex-end'; break;
        }
        switch (this.options.horizontalPosition) {
            case 'left': this._container.style.justifyContent = 'flex-start'; break;
            case 'center': this._container.style.justifyContent = 'center'; break;
            case 'right': this._container.style.justifyContent = 'flex-end'; break;
        }

        var wrldContainer = this._map._container.parentElement.parentElement;
        wrldContainer.style.position = 'relative';
        wrldContainer.append(this._container);
    }

    handleSliderChange() {
        
    }

    /**
     * Setup the time layer
     */
    setupTimeLayer() {
        if (this._layer != undefined) {
            this._layer.remove();
        }

        if (this.data == undefined) return;

        this._layer = L.geoJSON(this.data, {
            pointToLayer: function(geoJsonPoint, latlng) {
                var props = geoJsonPoint.properties;
                var opts = {};

                if (props.elevation != undefined) opts.elevation = props.elevation;
                if (props.elevationMode != undefined) opts.elevationMode = props.elevationMode;
                if (props.indoorMapId != undefined) opts.indoorMapId = props.indoorMapId;
                if (props.indoorMapFloorId != undefined) opts.indoorMapFloorId = props.indoorMapFloorId;

                return L.marker(latlng, opts);
            },
            filter: this.shouldShowFeature.bind(this)
        });
        if (Object.keys(this._layer._layers).length != 0)
            this._layer.addTo(this._map);

        // Heatmapping
        if (this.options.heatmap) {
            let heatmapPoints = [];
            this.data.features.forEach(feature => {
                if (this.shouldShowFeature(feature, true)) {
                    var coords = Array.from(feature.geometry.coordinates);
                    var tmp = coords[0];
                    coords[0] = coords[1];
                    coords[1] = tmp;
                    if (coords.length < 3) {
                        if (this._map.indoors.isIndoors()) {
                            console.log(coords);
                            coords[2] = this._map.indoors.getFloorHeightAboveSeaLevel(this._map.indoors.getFloor().getFloorIndex()) - this._map.getAltitudeAtLatLng(L.latLng(coords));
                        } else {
                            coords[2] = 1;
                        }
                    }
                    if (feature.properties.intensity) coords[3] = feature.properties.intensity;
                    if (feature.type = 'Point' && coords[0].length == undefined) {
                        heatmapPoints.push(coords);
                    }
                }
            });
            if (heatmapPoints.length > 0) {
                if (this._heatmapLayer != undefined) {
                    this._heatmapLayer.setLatLngs(heatmapPoints);
                } else {
                    this._heatmapLayer = L.heatLayer(heatmapPoints).addTo(this._map);
                }
            }
        }
    }

    /**
     * Returns true if the given feature should be displayed
     * @param {GeoJSON} feature the feature to test
     */
    shouldShowFeature(feature, heatmap = false) {
        // Heatmaps are handled outside of the GeoJSON layer
        var isIndoors = this._map.indoors.isIndoors();
        var featureIsIndoors = feature.properties.indoorMapId != undefined;

        if (!heatmap && this.options.heatmap && feature.geometry.type == 'Point') return false;

        if (isIndoors) {
            var floor = this._map.indoors.getFloor().getFloorIndex();
            if (!featureIsIndoors) return false;
            if (feature.properties.indoorMapFloorId != floor) return false;
        } else {
            if (!this.options.showIndoorPointsExternally && featureIsIndoors) return false;
        }

        return (new Date(feature.properties.date)) <= this._minDate.addDays((this._slider) ? this._slider.value : 0);
    }

}

function wrldTime(map, data, options) {
    return new WrldTime(map, data, options);
}