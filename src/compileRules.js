function compileRules(urls, urlPrefixes, domains, regexps) {
    const rules = []
    // split urls by comma, and push each url to rules
    if (urls)
        urls.forEach(url => {
            // if url is not empty, push to rules
            if (url) rules.push(`url("${url}")`)
        })
    // repeat above for urlPrefixes, domains, and regexps
    if (urlPrefixes)
        urlPrefixes.forEach(urlPrefix => {
            if (urlPrefix) rules.push(`url-prefix("${urlPrefix}")`)
        })
    if (domains)
        domains.forEach(domain => {
            if (domain) rules.push(`domain("${domain}")`)
        })
    if (regexps)
        regexps.forEach(regexp => {
            if (regexp) rules.push(`regexp("${regexp}")`)
        })

    return `@-moz-document ${rules.join(', ')}`
}

module.exports = {
    compileRules
}
