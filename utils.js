/*
    Module: utils
    Utilities for various uses.
*/

const getValueOrFallback = (obj, key, fallback) => {
    return obj && obj[key] !== undefined ? obj[key] : fallback
}

const fs = require('fs-extra')
const errorLog = (error, origin) => {
    const msg = `error from: \n${origin} \n${error} \n`
    console.error(msg)
    fs.writeFileSync('error.log', msg, { flag: 'a' })
}

const limitChars = (str, chars) => {
    return str.length > chars ? str.slice(0, chars - 3) + '...' : str
}

module.exports = { getValueOrFallback, errorLog, limitChars }
