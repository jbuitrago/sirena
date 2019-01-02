
exports.createResponse = function (statusCode, body){

    let response = {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(body)
    }

    return response;
}