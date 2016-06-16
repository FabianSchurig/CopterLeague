module.exports = {
    // URL origin of the web server
    origin: 'http://localhost:8080',

    // PostreSQL connection URL
    db: 'postgres://user:password@localhost:port/database',

    // Used to secure session cookies. Set to a random string
    sessionSecret: 'octocat',

    // Facebook Authentication
    facebook: {
        clientID: 'FACEBOOK_APP_ID',
        clientSecret: 'FACEBOOK_APP_SECRET'
    },

    // Google Maps Key
    googleMaps: {
        APIKey: 'MAPS_KEY'
    },

    // Amazon AWS S3 Image Bucket
    s3: {
        region: 'eu-central-1',
        bucket: 'BUCKET_NAME',
        base: 'https://BUCKET.s3.REGION.amazonaws.com'
    }
};
