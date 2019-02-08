
const Op = require('sequelize').Op

const Author = require("../models/author_model").Author
const Book = require("../models/book_model").Book
const Classification = require("../models/classification_model").Classification


exports.searchAuthors = function(req) {
    return new Promise(function(resolve, reject) {

        let findWhere = {
        
            order: [
                ['firstName', 'ASC']
            ],
            
            limit: req.query.limit,
            offset: req.query.offset,
            where: { },
            //include: [ Book ]
        }
        if (req.query.searchString !== "") {
    
            findWhere.where = {
                [Op.or]: [
                    {Id: {
                        [Op.like]: req.query.searchString, 
                        }
                    },
                    {firstName: {
                        [Op.like]: req.query.searchString, 
                        }
                    }
                ]
            }
        }
        Author.findAndCountAll(findWhere)
        .then((authors)=> {
            if (authors.rows.length > 0) {
                let authorslist = [ ]
                for (let i = 0, len = authors.rows.length; i < len; i++) {
                    authorslist.push({
                        Id: authors.rows[i].Id,
                        firstName: authors.rows[i].firstName,
                        lastName: authors.rows[i].lastName,
                        birthYear: authors.rows[i].birthYear,
                    })
                }
                authorslist.total = authors.count
                resolve(authorslist)
            } 
            else {
                const error = {
                    errors: [
                        {message: "No matches found."}
                    ]
                }
                reject(error)
            }
        }).catch((error)=> {
            if (error.errors.length = 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}

   
exports.getAuthorInfo = function(req) {
    return new Promise(function(resolve, reject) {

        Author.findOne({
            where: {
                Id: req.query.Id,
            }
        }).then((author)=> {
            if (author) {
                            
                let theAuthor = {
                    Id: author.Id,
                    firstName: author.firstName,
                    lastName: author.lastName,
                    birthYear: author.birthYear
                }
                resolve(theAuthor)
            }
            else {
                const error = {
                    errors: [
                        {message: "No matches found."}
                    ]
                }
                reject(error)
            }
        }).catch((error)=> {
            if (error.errors.length == "0") {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}


exports.authorDelete = function(req) {
    return new Promise(function(resolve, reject) {

        Author.destroy({
            where: {
                Id: req.query.Id,
            }
        }).then((author)=> {
            if (author) {
                resolve()
            }
            else {
                const error = {
                    errors: [
                        {message: "No matches found."}
                    ]
                }
                reject(error)
            }
        }).catch((error)=> {
            if (error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}


exports.createAuthor = function(req) {
    return new Promise(function(resolve, reject) {
        Author.create({
            firstName: req.body.firstName,
            lastName:req.body.lastName,
            birthYear:req.body.birthYear,
        }).then((author) => {
            if (author) {
                const newAuthor = {
                    Id: author.Id,
                    firstName: author.firstName,
                    lastName:author.lastName,
                    birthYear:author.birthYear,
                }
                return resolve(newAuthor)
            }
        }).catch((error) => {
            if (error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}


exports.editAuthorInfo = function(req) {
    return new Promise(function(resolve, reject) {
        Author.update({

            firstName:  req.body.firstName,
            lastName:   req.body.lastName,
            birthYear:  req.body.birthYear,
            
        },
        {where: {Id: req.body.Id}}
        ).then((affectedAuthors) => {
            if (affectedAuthors > 0) {
                return resolve(affectedAuthors)
            }
            const error = {
                errors: [
                    {message: "No matches found."}
                ]
            }
            reject(error)
        }).catch((error) => {
            if (error.errors.length == 0) {
                setTimeout(function() { throw error; });
            }
            return reject(error.errors)
        })
    })
}
