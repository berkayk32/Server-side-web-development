const express = require('express')
const dal = require("../dal/books-repository")

exports.searchBooks = function(req) {
    return new Promise(function(resolve, reject) {

        return dal.searchBooks(req)
        .then(function(books) {
            resolve(books)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.getBookInfo = function(req) {
    return new Promise(function(resolve, reject) {
        return dal.getBookInfo(req)
        .then(function(bookInfo) {
            resolve(bookInfo)
        }).catch(function(error) {
            reject(error)
        })
    })
}

exports.createBook = function(req) {
    return new Promise(function(resolve, reject) {
        return dal.createBook(req)
        .then(function(newBook) {
            resolve(newBook)
        }).catch(function(error) {
            reject(error)
        })
    })
}


