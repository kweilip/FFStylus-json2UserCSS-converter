const fs = require('fs-extra')
const path = require('path')
const sanitize = require('sanitize-filename')
const css = require('css')

const {compileMetadata} = require('./src/compileMetadata')
const {compileRules} = require('./src/compileRules')
const {writeUserStyle} = require('./src/writeUserStyle')

async function json2UserStyle() {
  const pConversion = []
  const jsonStyles = fs.readJsonSync(`./stylus-backup.json`, {encoding: 'utf8'})

  for (const style of jsonStyles) {
    const name = style['name']

    if (name) {
      for (const section of style['sections']) {
        // populate metadata, rules, css contents with info from json
        const filePath = `${sanitize(name)}.user.css`

        const header = compileMetadata(name, filePath)

        const rules = compileRules(section['urls'], section['urlPrefixes'], section['domains'], section['regexps'])

        const code = css.parse(section['code'])
        const cssContent = css.stringify(code)

        pConversion.push(writeUserStyle(header, rules, cssContent, filePath))
      }
    }
  }


  await Promise.all(pConversion).then((results) => {
    // check how many promise returned true
    const successCount = results.filter(result => result).length

    console.log(` ${successCount} out of ${jsonStyles.length} converted successfully`)
  })
}

json2UserStyle();

