"use strict";

const accValid = {
    userName: {
        min: 1,
        max: 25
    },
    firstName: {
        min: 1,
        max: 25
    },
    lastName: {
        min: 1,
        max: 200
    },
    passw: {
        min: 1,
        max: 200
    }
}

const bookValid = {
    ISBN: {
        min: 0,
        max: 15
    },
    title: {
        min: 0,
        max: 255
    },
    publicationYear: {
        min: 0,
        max: 10
    },
    publicationInfo: {
        min: 0,
        max: 255
    },
    pages: {
        min: 0,
        max: 255
    }

}
const classifications = {
    signum: {
        min: 0,
        max: 50
    },
    description: {
        min: 0,
        max: 255
    }
}

const authorVal = {
    firstName: {
        min: 0,
        max: 50
    },
    lastName: {
        min: 0,
        max: 50
    },
    birthYear: {
        min: 0,
        max: 10
    }
}

exports.accValid = accValid
exports.bookValid = bookValid
exports.classifications = classifications
exports.authorVal = authorVal