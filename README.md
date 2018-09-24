
# wrld.time.js
wrld.time.js allows for the use of heatmaps on a WRLD3D map.
## Setup/Installation
### Easy
This Guide will get anyone up and running. Our repository includes a website to show you how our plugin works and some of its features.
#### Setup
Clone this repository and make this the root of your project.
navigate to the following in your web browser:

    http://path/to/root/website/
    
The dependencies are already included in the website so there is nothing to worry about!

### Advanced
This setup guide is tailored to more experienced users.
#### Setup
Clone this repository and unzip into your chosen directory.
Include the following dependencies in your websites files.

#### Dependencies
wrld.time.js includes several additional dependencies. These are included to help get you up and running as quickly as possible using our built in examples. Append these to the top of your file.

##### Standard leaflet CSS

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet.css" />
    
##### Wrld.js
This is the main dependency. To make use of the dev kit and its features go to https://wrld3d.com/wrld.js/latest/docs/examples/

    <script src="https://cdn-webgl.wrld3d.com/wrldjs/dist/latest/wrld.js"></script>
    
##### Leaflet.heat and simpleheat
Both dependencies are included in the main wrld.time.js file

##### wrld.time.js Custom Style sheet
  this style sheet also has custom easyButton templates
  
    <link rel="stylesheet" href="wrld.time.css" />

  
##### easyButton and Font Awesome
These stylesheets are used purely for our examples, buttons are in fact not even required! The associated javascript is already included.

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.EasyButton/2.3.0/easy-button.css" rel="stylesheet"><link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">


#### Including Your Dataset
The library makes use of the standardised GeoJSON format. The simplest way to include your dataset is to do so locally, assigning the data to a javascript array in a separate file and adding it the main root repository: 

##### index.html

     <script src="dataset.json"></script>

##### dataset.json

        var dataset = {
      "type": "FeatureCollection",
      "features": [
        {
          "geometry": {
            "type": "Point",
            "coordinates": [
              56.46840475301886,
              -2.956357600297241
            ]
          },
          "type": "Feature",
          "id": 1,
          "properties": {
            "date": "2017-12-31",
            "town": "Dundee"
          }
        }
      ]
    }
    
The above GeoJSON example generates a single coordinate on the map. It has a unique date property within it. This is important as it allows the wrld.time library to effectively time sequence the data. Further properties may be included where required.   

#### Included Tools

# Credits
 - WRLD3D - https://wrld3d.com/wrld.js/latest/docs/api/
 - Leaflet.heat - https://github.com/Leaflet/Leaflet.heat
 - simpleheat - https://github.com/mourner/simpleheat
 - Leaflet.easyButton - https://github.com/CliffCloud/Leaflet.EasyButton



