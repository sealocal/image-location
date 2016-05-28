var gpsTagNames = (function() {
  var tagNames = [];
  for (key in EXIF.GPSTags) {
    tagNames.push( EXIF.GPSTags[key] );
  }
  return tagNames;
})();

function gpsData(img) {
  var exif = EXIF.getAllTags(img);
  var gpsData = {};

  for ( i = 0; i < gpsTagNames.length; i++ ) {
    gpsData[gpsTagNames[i]] = exif[gpsTagNames[i]];
  }

  return gpsData;
}

function decimalDegrees(degMinSec) {
  if (degMinSec && degMinSec.length === 3) // if there is a degree value
      return degMinSec[0] + degMinSec[1] / 60.0 + degMinSec[2] / 3600.0;
}

function gpsLocation(gpsData) {
    if (
        gpsData && gpsData['GPSLatitudeRef'] && gpsData['GPSLongitudeRef'] &&
        gpsData['GPSLatitude'] && gpsData['GPSLatitudeRef']
    ) {

        // Convert NSEW directions to +/- (implicit +)
        var gpsLatSign = gpsData['GPSLatitudeRef'] === 'N' ? '' : '-';
        var gpsLongSign = gpsData['GPSLongitudeRef'] === 'E' ? '' : '-';

        // Convet DMS to decimal degrees
        var gpsLat  = decimalDegrees(gpsData['GPSLatitude']);
        var gpsLong = decimalDegrees(gpsData['GPSLongitude']);

        return gpsLatSign + gpsLat + ',' + gpsLongSign + gpsLong;
    }
}

// This is the only jQuery code in the extension.
// So, there is an opportunity to remove the dependency
// by re-writing this line in vanilla JasvaScript
// Wrap every image in a container div
$( 'img' ).wrap( '<div class="image-location-container"></div>' );

// Get all the images on the page
var images = document.images;

// Iterate over the images
for ( i = 0; i < images.length; i ++ ) {

  // Get the EXIF data for an image
  EXIF.getData(images[i], function() {

    // Check if the GPS data has enough information for a location.
    var data = gpsData(this);
    if ( data['GPSLatitude'] && data['GPSLatitudeRef'] && data['GPSLongitude'] && data['GPSLongitudeRef'] ) {
      // Add CSS style to the image,
      this.classList.add('image-location');
      // and alert the user
      alert( gpsLocation( data ) );
    }
  });

}

