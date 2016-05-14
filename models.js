const Sequelize = require('sequelize');
const config = require('./config');

const instance = new Sequelize(config.db, {
    define: {
        freezeTableName: true
    },
    logging: (process.env.NODE_ENV === "production" ? false : console.log)
});
module.exports.instance = instance;

// Model definitions
const pilot = instance.define('Pilot', {
    facebookId: {type: Sequelize.STRING, unique: true},
    googleId: {type: Sequelize.STRING, unique: true},
    alias: {type: Sequelize.STRING, allowNull: false, validate: {len: [3, 40]}},
	familyName: {type: Sequelize.STRING, allowNull: false, validate: {len: [3, 40]}},
	firstName: {type: Sequelize.STRING, allowNull: false, validate: {len: [3, 40]}},
    email: {type: Sequelize.STRING, unique: true, validate: {isEmail: true}},
	telephone: {type: Sequelize.STRING},
	notes: {type: Sequelize.STRING},
    password: {type: Sequelize.STRING},
    emailConfirmed: {type: Sequelize.BOOLEAN},
    emailConfirmToken: {type: Sequelize.UUID, unique: true},
    admin: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}
});

const event = instance.define('Event', {
	date: {type: Sequelize.DATE, allowNull: false, validate: {isDate: true}},
	deadline: {type: Sequelize.DATE, allowNull: false, validate: {isDate: true}},
	title: {type: Sequelize.STRING, allowNull: false, validate: {len: [3, 40]}},
	isCancelled: {type: Sequelize.BOOLEAN , allowNull: false}, 
	maxParticipants: {type: Sequelize.INTEGER, validate: {min: 1},
	location: {type: Sequelize.STRING},
	policy: {type: Sequelize.STRING},
	notes: {type: Sequelize.STRING},
	isOfficial: {type: Sequelize.BOOLEAN}	
});

const race = instance.define('Race', {
	sizeMulti: {type: Sequelize.STRING, allowNull: false},
	battery: {type: Sequelize.STRING, allowNull: false}
});

const result = instance.define('Result', {
	place: {type: Sequelize.INTEGER, allowNull: false}
});

const multi = instance.define('Multi', {
	size: {type: Sequelize.STRING, allowNull: false},
	battery: {type: Sequelize.STRING, allowNull: false},
	notes: {type: Sequelize.STRING}
});

const participation = instance.define('Participation', {
	isCreator: {type: Sequelize.BOOLEAN, allowNull: false}
});


// Associations
Multi.belongsTo(Pilot, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
Pilot.hasMany(Multi);

Participation.belongsTo(Event, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
Participation.belongsTo(Pilot, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});

Result.belongsTo(Race, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
Result.belongsTo(Pilot, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
Result.belongsTo(Multi, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});

Race.belongsTo(Event, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'});
Event.hasMany(Race);