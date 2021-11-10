## About
A simplistic parser to convert `.json` exported from FireFox's stylus extension into UserCSS with its metadata accordingly.

`json2UserCSS.js` will populate the info below from each of the section into `*.user.css`:
- name
- sections.code
- sections.urls
- sections.urlPrefixes
- sections.domains
- sections.regexps


## Usage
Simply put `stylus-YYYY-MM-DD.json` file into this folder, and execute `node json2UserCSS.js`

`*.user.css` will be generated accordingly for every section found.


## Tips
Similar to UserScript, add the metadata `@version` and `@updateURL` with a localhost url to trigger update easier if the file is modified.
