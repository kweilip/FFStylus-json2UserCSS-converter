const fs = require("fs-extra");

async function writeUserStyle(header, rules, code, filePath) {
  const userCSSContent = `
${header}

${rules} {

${code}

}`

  // return true .user.css is generated successfully
  return fs.writeFile(`./${filePath}`, userCSSContent.trim(), {encoding: 'utf8'}).then(() => true).catch(() => false)
}


module.exports = {
  writeUserStyle
}
