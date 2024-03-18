
function toRadians(degrees: number) {
    return degrees * Math.PI / 180;
}

function toDegrees(radians: number) {
    return radians * 180 / Math.PI;
}

//lat2 = asin( sin(lat1)*cos(d/R) + cos(lat1)*sin(d/R)*cos(brng) )
//lon2 = lon1 + atan2( sin(brng)*sin(d/R)*cos(lat1), cos(d/R)-sin(lat1)*sin(lat2) )

export default function calculateNewCoordinates(lat1: number, lon1: number, distance: number, bearing: number) {
    let rLat1 = toRadians(lat1);
    let rLon1 = toRadians(lon1);
    let rBearing = toRadians(bearing);
    let lat2: number = 0;
    let lon2: number = 0;
    let earthRadius = 6371;

    lat2 = Math.asin(Math.sin(rLat1)*Math.cos(distance/earthRadius) + Math.cos(rLat1)*Math.sin(distance/earthRadius)*Math.cos(rBearing));
    lon2 = rLon1 + Math.atan2(Math.sin(rBearing)*Math.sin(distance/earthRadius)*Math.cos(rLat1), Math.cos(distance/earthRadius)-Math.sin(rLat1)*Math.sin(lat2));

    let dLat2 = toDegrees(lat2)
    let dLon2 = toDegrees(lon2)

    return { dLat2, dLon2 }
}
