function convertToJson(jsonObjects) {
    const jsonArray = [];
    jsonObjects.forEach((obj) => {
        jsonArray.push(obj.data);
    });

    return jsonArray;
}

module.exports = { convertToJson };