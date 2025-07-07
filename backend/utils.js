const crypto = require('crypto')
const path = require('path')

// Liste noire (fichiers dangereux)
const blockedExtensions = ['.exe', '.sh', '.php', '.bat', '.js']

function generateFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase()
  const id = crypto.randomBytes(5).toString('hex')
  return `${id}${ext}`
}

function isValidFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  return !blockedExtensions.includes(ext)
}

module.exports = { generateFilename, isValidFile }
