const config = require('../../config');

module.exports = {imageObject, imageTypeFromFile};

function imageObject(image) {
    const obj = {};
    const baseUrl = config.s3.base + '/' + image.id;
    if(image.small) obj.small = baseUrl + '_s.jpg';
    if(image.medium) obj.medium = baseUrl + '_m.jpg';
    if(image.large) obj.large = baseUrl + '_l.jpg';
    return obj;
}

function imageTypeFromFile(file) {
    // check mime-type first
    switch(file.mimetype) {
        case 'image/jpeg': return 'jpg';
        case 'image/png': return 'png';
        case 'image/gif': return 'gif';
    }

    // check name of the file on the user's computer
    const name = file.originalname.toLowerCase();
    if(name.endsWith('gif')) return 'gif';
    if(name.endsWith('png')) return 'png';

    // fallback to jpg
    return 'jpg';
}
