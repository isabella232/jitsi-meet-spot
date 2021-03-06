const { send401Error, send500Error, sendJSON } = require('./utils');

const roomInfoFailureRate = process.env.ROOM_INFO_FAILURE_RATE;

console.info('room-info failure rate: ' + roomInfoFailureRate);

function roomInfoController(spots, req, res){
    const authorization = req.headers['authorization'];

    if (authorization.indexOf('Bearer ') !== 0) {
        console.info(`Invalid token, "Authorization" header = ${authorization}`);
        send401Error(res, `Invalid token`);

        return;
    }

    const jwt = authorization.substring(7);

    if (roomInfoFailureRate && Math.random() < roomInfoFailureRate) {
        send500Error(res, "Randomly failed /room-info");

        return;
    }

    let spotRoom = null;

    // FIXME is there any better way to do this ? .filter/.find is any of this possible ?
    for (const room of spots.values()) {
        if (room.getAccessToken().accessToken === jwt
                || room.getShortLivedAccessToken().accessToken === jwt) {
            spotRoom = room;
            break;
        }
    }

    if (!spotRoom) {
        send401Error(res, `No spot room found for jwt: ${jwt}`);

        return;
    }

    sendJSON(res, {
        countryCode: spotRoom.countryCode,
        id: spotRoom.id,
        mucUrl: spotRoom.mucUrl,
        name: spotRoom.name
    });
}

module.exports = roomInfoController;
