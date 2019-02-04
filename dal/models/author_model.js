
const authorVal = require('./model_validator').authorVal

const Sequelize = require("../sequelize_settings").Sequelize
const db = require("../sequelize_settings").db

exports.Author = db.define('author', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: Sequelize.TEXT,
        validate: {
            len: {
                args: [authorVal.firstName.min, authorVal.firstName.max],
                msg: "First name must be between " + authorVal.firstName.min + " and " + authorVal.firstName.max + " characters long."
            }
        }
    },
    lastName: {
        type: Sequelize.TEXT,
        validate: {
            len: {
                args: [authorVal.lastName.min, authorVal.lastName.max],
                msg: "Last name must be between " + authorVal.lastName.min + " and " + authorVal.lastName.max + " characters long."
            }
        }
    },
    birthYear: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [authorVal.birthYear.min, authorVal.birthYear.max],
                msg: "Birthday must be between exactly " + authorVal.birthYear.min + " characters long."
            }
        }
    }

})
