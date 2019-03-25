
const classificationsRepository = require("../dal/repositories/classification-repository")

const authorityLevel = require("../objects").authorityLevel

exports.findAll = function(options) {
    return classificationsRepository.findAll(options)
}

exports.findOne = function(classification) {
    try {
        return classificationsRepository.findOne(classification)
    }
    catch (error) {
        return Promise.resolve(null)
    }
}

exports.findByPk = function(classification) {
    return classificationsRepository.findByPk(classification)
}

exports.delete = function(authorityId, classification) {

    if (authorityId == undefined || authorityId < authorityLevel.SUPER) {
        throw [{message: "You do not have permission to do that."}]
    }

    return classificationsRepository.delete(classification)
}