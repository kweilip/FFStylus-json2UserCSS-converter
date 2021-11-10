import fs from 'fs-extra'
import sanitize from "sanitize-filename";

function compileRules(urls, urlPrefixes, domains, regexps) {
  const rules = []
  rules.push(`url("${urls}")`)
  rules.push(`url-prefix("${urlPrefixes}")`)
  rules.push(`domain("${domains}")`)
  rules.push(`regexp("${regexps}")`)
  return `@-moz-document ${rules.join(', ')}`
}


function compileMetadata(name, filePath) {

  const templateMetadata = `
    /* ==UserStyle==
    @name           Customized {{name}}
    @version        1.0.0
    @description    A customized theme for {{name}}
    @updateURL      http://usercss.localhost/{{filePath}}
    ==/UserStyle== */
    `
  return templateMetadata
      .replace(/{{name}}/g, name)
      .replace(/{{filePath}}/g, filePath)
      .trim()
}

async function writeUserCSS(header, rules, code, filePath) {
  const userCSSContent = `
      ${header} 
      
      ${rules} {
      
      ${code}
      
      }`

  // return true .user.css is generated successfully
  return fs.writeFile(filePath, userCSSContent, {encoding: 'utf8'}).then(() => true).catch(() => false)
}


const pConversion = []
const jsonStyles = JSON.parse(fs.readJsonSync('./stylus-backup.json', {encoding: 'utf8'}))

for (const style of jsonStyles) {
  const name = style['name']

  if (name) {
    for (const section of style['sections']) {
      // populate metadata, rules, css contents with info from json
      const filePath = `./${sanitize(name)}.user.css`

      const header = compileMetadata(name, filePath)

      const rules = compileRules(section['urls'], section['urlPrefixes'], section['domains'], section['regexps'])

      const code = section['code']

      pConversion.push(writeUserCSS(header, rules, code, filePath))
    }
  }
}


await Promise.all(pConversion).then((results) => {
  // check how many promise returned true
  const successCount = results.filter(result => result).length

  console.log(` ${successCount} out of ${jsonStyles.length} converted successfully`)
})

