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
}


module.exports = {
    compileMetadata
}
