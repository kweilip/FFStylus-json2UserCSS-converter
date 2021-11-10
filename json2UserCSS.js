const fs = require('fs-extra')
const path = require('path')
const sanitize = require('sanitize-filename')
const css = require('css')
const glob = require('glob-promise')

const {compileMetadata} = require('./src/compileMetadata')
const {compileRules} = require('./src/compileRules')
const {writeUserCSS} = require('./src/writeUserCSS')

async function json2UserCSS() {
  const pConversion = []
  // get all .json file in the current folder
  const jsonFiles = await glob('stylus-*.json', {cwd: process.cwd(), absolute: true})
  let totalSectionFound = 0

  for (const jsonFile of jsonFiles) {
    const jsonStyles = fs.readJsonSync(jsonFile, {encoding: 'utf8'})
    totalSectionFound += jsonStyles.length

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

          pConversion.push(writeUserCSS(header, rules, cssContent, filePath))
        }
      }
    }
  }


  await Promise.all(pConversion).then((results) => {
    // check how many promise returned true
    const successCount = results.filter(result => result).length

    console.log(` ${successCount} out of ${totalSectionFound} converted successfully`)
  })
}

json2UserCSS();

