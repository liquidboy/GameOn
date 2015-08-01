function lSend(socket, varID, varData) {
    // Check if socket is still connected
    if (socket.readyState != 1) {
        return false;
    }

    var obj = { id: varID, data: varData };

    var jsonString = JSON.stringify(obj, null);

    //console.log( "Sending " + jsonString );

    socket.send(jsonString);

    return true;
}
