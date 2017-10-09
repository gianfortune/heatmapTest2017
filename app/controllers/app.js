var heatmapApp = angular.module('heatmapApp', ['ngMaterial'])

heatmapApp.controller('heatmapController', class heatmapController {
  constructor ($scope) {
    // Define global variables
    this.startedDrawing = false
    let context = this
    this.mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(37.782551, -122.445368),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }
    // Creates new map object
    this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions)
    // Creates heatmap visualization layer
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.getPoints(),
      map: this.map
    })

    // Creates drawing manager object
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
      circleOptions: {
        fillColor: '#ffff00',
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1
      }
    })

    // drawingManager eventListener:  uses an anonymous function to get the coordinates
    //    of the user defined polygon.  Calls checkInsidePolygon() to change rendering of heatmap points
    // Inputs: drawingManager (obj), eventType (string), anonymousFunction (func)
    // Returns: null
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function(event) {
      var len = event.overlay.getPath().getLength();
      var htmlStr = "";
      let valueArray =[]
      for (var i = 0; i < len; i++) {
        let coord = event.overlay.getPath().getAt(i).toUrlValue(5).split(',')
        valueArray.push(new google.maps.LatLng(coord[0], coord[1]))
      }
      context.checkInsidePolygon(valueArray)
    })
  }

  // checkInsidePolygon():  takes in polygon coordinates to check each heatmap point
  //    to see if each point resides within the polygon
  // Inputs: coordinates (Array)
  // Returns: null
  checkInsidePolygon (coordinates) {
    this.heatmap.setMap(null)
    let heatMapCoord = this.getPoints()
    let newHeatMap = []
    let userPoly = new google.maps.Polygon({paths: coordinates})
    heatMapCoord.forEach((point) => {
      if(google.maps.geometry.poly.containsLocation(point, userPoly)) {
        newHeatMap.push(point)
      }
    })
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: newHeatMap,
      map: this.map
    })
  }

  // startDrawingTool():  sets Drawing mode for canvas
  // Inputs: null
  // Returns: null
  startDrawingTool () {
    this.startedDrawing = true
    this.drawingManager.setMap(this.map)
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
  }

  // hideDrawingTool():  removes Drawing mode for canvas
  // Inputs: null
  // Returns: null
  hideDrawingTool () {
    this.drawingManager.setDrawingMode(null)
    this.startedDrawing = false
  }

  // toggleHeatmap():  sets Map for canvas
  // Inputs: null
  // Returns: null
  toggleHeatmap() {
    this.heatmap.setMap(this.heatmap.getMap() ? null : this.map);
  }

  //changeGradient():  sets colors mode for heatmap layer
  // Inputs: null
  // Returns: null
  changeGradient() {
    let gradient = [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'
    ]
    this.heatmap.set('gradient', this.heatmap.get('gradient') ? null : gradient);
  }

  // getButtonClass():  gets button classes based upon state
  // Inputs: button code (string)
  // Returns: cssClass (string)
  getButtonClass (code) {
    switch (code){
      case '_TOGGLEHEAT':
        return this.heatmap.getMap() ? '' : 'md-warn'
      case '_GRADIENT':
        return this.heatmap.get('gradient') ? 'md-warn' : ''
      case '_RADIUS':
        return this.heatmap.get('radius') ?  'md-warn' : ''
      case '_OPACITY':
        return this.heatmap.get('opacity') ? 'md-warn' : ''
      default:
        return ''
    }
  }

  // changeRadius():  sets radius for heatmap Layer
  // Inputs: null
  // Returns: null
  changeRadius() {
    this.heatmap.set('radius', this.heatmap.get('radius') ? null : 20);
  }

  // changeOpacity():  sets opacity for heatmap layer
  // Inputs: null
  // Returns: null
  changeOpacity() {
    this.heatmap.set('opacity', this.heatmap.get('opacity') ? null : 0.2);
  }

  // getPoints():  gets raw data coordinates and transforms them to google LatLng objects
  // Inputs: null
  // Returns: returningArray (Array)
  getPoints() {
      let valueArray = this.getPointsRaw()
      let returningArray = []
      valueArray.forEach((coordinate) => {
        returningArray.push(new google.maps.LatLng(coordinate[0],coordinate[1]))
      })
      return returningArray
    }

  // getPointsRaw():  temporarily gets the raw array of coordinates
  // Inputs: null
  // Returns: coordinates (Array)
  getPointsRaw () {
    return [
    [37.782551, -122.445368],
    [37.782745, -122.444586],
    [37.782842, -122.443688],
    [37.782919, -122.442815],
    [37.782992, -122.442112],
    [37.783100, -122.441461],
    [37.783206, -122.440829],
    [37.783273, -122.440324],
    [37.783316, -122.440023],
    [37.783357, -122.439794],
    [37.783371, -122.439687],
    [37.783368, -122.439666],
    [37.783383, -122.439594],
    [37.783508, -122.439525],
    [37.783842, -122.439591],
    [37.784147, -122.439668],
    [37.784206, -122.439686],
    [37.784386, -122.439790],
    [37.784701, -122.439902],
    [37.784965, -122.439938],
    [37.785010, -122.439947],
    [37.785360, -122.439952],
    [37.785715, -122.440030],
    [37.786117, -122.440119],
    [37.786564, -122.440209],
    [37.786905, -122.440270],
    [37.786956, -122.440279],
    [37.800224, -122.433520],
    [37.800155, -122.434101],
    [37.800160, -122.434430],
    [37.800378, -122.434527],
    [37.800738, -122.434598],
    [37.800938, -122.434650]
   ]
  }
})
