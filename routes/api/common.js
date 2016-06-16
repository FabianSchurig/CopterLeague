const config = require('../../config');

module.exports = {imageObject};

function imageObject(image) {
    const obj = {};
    const baseUrl = config.s3.base + '/' + image.id;
    if(image.small) obj.small = baseUrl + '_s.jpg';
    if(image.medium) obj.medium = baseUrl + '_m.jpg';
    if(image.large) obj.large = baseUrl + '_l.jpg';
    return obj;
}
