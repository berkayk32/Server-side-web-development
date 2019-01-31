const express = require('express')
const Op = require('sequelize').Op

const db = require("./request_handler")


exports.searchBooks = function(req, callback) {

    let findWhere = {
        
        order: [
            ['title', 'ASC']
        ],
        
        limit: req.query.limit,
        offset: req.query.offset,
        where: { } 
    }
    if (req.query.searchString !== "") {

        findWhere.where = {
            [Op.or]: [
                {ISBN: {
                    [Op.like]: req.query.searchString, 
                    }
                },
                {title: {
                    [Op.like]: req.query.searchString, 
                    }
                }
            ]
        }
    }
    req.models.Book.findAndCountAll(findWhere)
    .then((books)=> {
        if (books.rows.length > 0) {
            let booksList = [ ]
            for (let i = 0, len = books.rows.length; i < len; i++) {
                booksList.push({
                    ISBN: books.rows[i].ISBN,
                    title: books.rows[i].title,
                    signId: books.rows[i].signId,
                    publicationYear: books.rows[i].publicationYear,
                    publicationInfo: books.rows[i].publicationInfo,
                    pages: books.rows[i].pages
                })
            }
            booksList.total = books.count
            callback(booksList)
        } 
        else {
            throw "No maches found."
        }
    }).catch((error)=> {
        throw error
    })
}
    
exports.getBookInfo = function(req, callback) {

    req.models.Book.findOne({
        where: {
            ISBN: req.query.ISBN,
        },
        include: [
            req.models.Classification
        ]
    })
    .then((book)=> {
        if (book) {
                        
            let theBook = {
                ISBN: book.ISBN,
                title: book.title,
                signId: book.signId,
                publicationYear: book.publicationYear,
                publicationInfo: book.publicationInfo,
                pages: book.pages
            }
            if (theBook.signId) {
                theBook.signId = {
                    signum: book.classification.signum,
                    description: book.classification.description
                }
            }
            callback(theBook)
        }
        else {
            throw "No maches found."
        }
    }).catch((error)=> {
        throw error
    })
}
    
exports.createBook = function(req) {
    return new Promise(function(resolve, reject) {
        req.models.Book.create({
                ISBN: req.body.ISBN,
                title: req.body.title,
                pages:req.body.pages,
                publicationInfo:req.body.publicationInfo,
                publicationYear:req.body.publicationYear,
            })
            .then((book) => {
                if (book) {
                    const newBook = {
                            ISBN: book.ISBN,
                            title: book.title,
                            signId: book.signId,
                            publicationYear: book.publicationYear,
                            publicationInfo: book.publicationInfo,
                            pages: book.pages
                        }
                    return resolve(newBook)
                }
            }).catch((error) => {
                if (error.errors.length == 0) {
                    setTimeout(function() { throw error; });
                }
                return reject(error.errors)
            })
    })
}