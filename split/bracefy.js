const fs = require('fs');
const { minify } = require('terser');

const inputCode = fs.readFileSync('./src/index.js', 'utf8');

minify(inputCode, {
    compress: false,
    mangle: false,
    format: {
        ecma: 2024, // specify ECMAScript version
        indent_level: 2,
        beautify: true,
        braces: true
    }
}).then((result) => {
    if (result.error) {
        console.error('Error:', result.error);
        return;
    }
    fs.writeFileSync('output.js', result.code);
    console.log('Code saved to output.js');
}).catch((error) => {
    console.error('Error:', error);
});
