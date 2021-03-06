
const booksRepository = require("../dal/repositories/books-repository")
const classificationsReository = require("../dal/repositories/classification-repository")

const authorityLevel = require("../objects").authorityLevel

exports.findAll = function(options) {
    return booksRepository.findAll(options)
}
exports.findBooksByClassification = function(classification) {
    return booksRepository.findBooksByClassification(classification)
}

exports.create = async function(authorityId, book) {
    if (authorityId == undefined || authorityId < authorityLevel.MODERATOR) {
        return Promise.reject([{message: "You do not have permission to do that."}])
    }

    return booksRepository.create(book)
}

exports.findByPk = function(book) {
    return booksRepository.findByPk(book)
}

exports.update = function(authorityId, book, oldISBN) {
    
    if (authorityId == undefined || authorityId < authorityLevel.ADMIN) {
        return Promise.reject([{message: "You do not have permission to do that."}])
    }

    return booksRepository.update(book, oldISBN)
}

exports.delete = function(authorityId, book) {
    
    if (authorityId == undefined || authorityId < authorityLevel.ADMIN) {
        throw [{message: "You do not have permission to do that."}]
    }

    return booksRepository.delete(book)
    
}
