function addRandomPins(features, centerCoords, radius, number, indoorId, indoorFloor = 0) {
    for (var i = 0; i < number; i++) {
        var month = Math.floor(Math.random()*8)+1;
        var day = Math.floor(Math.random()*8)+1;
        features.push({
            "geometry": {
                "type": "Point", 
                "coordinates": [
                    centerCoords[0]+Math.random()*radius-(radius/2), 
                    centerCoords[1]+Math.random()*radius-(radius/2),
                ]
            },
            "type": "Feature", 
            "id": i, 
            "properties": {
                "date":  "2018-0" + month + "-0" + day, 
                "town": "Dundee", 
                "intensity": 31,
                "indoorMapId": indoorId,
                "indoorMapFloorId": (indoorId) ? indoorFloor : undefined
            }
        });
    }
}