function addRandomPins(features, centerCoords, radius, number, indoorId) {
    for (var i = 0; i < number; i++) {
        var month = Math.floor(Math.random()*8)+1;
        var day = Math.floor(Math.random()*8)+1;
        features.push({
            "geometry": {
                "type": "Point", 
                "coordinates": generateRandomCoords(centerCoords, radius)
            },
            "type": "Feature", 
            "id": i, 
            "properties": {
                "date":  "2018-0" + month + "-0" + day, 
                "town": "Dundee",
                "indoorMapId": indoorId,
                "indoorMapFloorId": (indoorId) ? 2 : undefined
            }
        });
    }
}

function generateRandomCoords(centerCoords, radius) {
    return [
        centerCoords[0]+Math.random()*radius-(radius/2), 
        centerCoords[1]+Math.random()*radius-(radius/2),
    ]
}

function addRandomPolygons(features, centerCoords, radius, number, indoorId, sides = 3) {
    for (var i = 0; i < number; i++) {
        var month = Math.floor(Math.random()*8)+1;
        var day = Math.floor(Math.random()*8)+1;
        var coords = [];
        for (var j = 0; j < sides; j++) coords.push(generateRandomCoords(centerCoords, radius));

        features.push({
            "geometry": {
                "type": "Polygon", 
                "coordinates": [coords]
            },
            "type": "Feature", 
            "id": i, 
            "properties": {
                "date":  "2018-0" + month + "-0" + day, 
                "town": "Dundee",
                "indoorMapId": indoorId,
                "indoorMapFloorId": (indoorId) ? 2 : undefined
            }
        });
    }
}