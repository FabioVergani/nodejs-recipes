const fs = require('fs');
const { parse } = require('acorn');

const inputCode = fs.readFileSync('./src/index.js', 'utf8');

const ast = parse(inputCode, { ecmaVersion: 'latest' });

const functionBodies = {};

function extractFunctionBody(node) {
    const { start, end } = node.body;
    return inputCode.slice(start, end);
}

function traverse(node) {
    if (node.type === 'FunctionDeclaration') {
        const body = extractFunctionBody(node);
        if (!functionBodies[body]) {
            functionBodies[body] = [];
        }
        functionBodies[body].push(node.id.name);
    }
    if (node.type === 'VariableDeclaration') {
        node.declarations.forEach(declaration => {
            if (declaration.init && declaration.init.type === 'FunctionExpression') {
                const body = extractFunctionBody(declaration.init);
                if (!functionBodies[body]) {
                    functionBodies[body] = [];
                }
                functionBodies[body].push(declaration.id.name);
            }
        });
    }
    for (const key in node) {
        if (node[key] && typeof node[key] === 'object') {
            traverse(node[key]);
        }
    }
}

traverse(ast);

const duplicateFunctions = {};

for (const body in functionBodies) {
    const names = functionBodies[body];
    if (names.length > 1) {
        names.forEach(name => {
            if (!duplicateFunctions[name]) {
                duplicateFunctions[name] = names.filter(n => n !== name);
            }
        });
    }
}

console.log(duplicateFunctions);
