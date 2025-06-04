const specFile = process.argv[2];
if (!specFile) {
    console.error('Uso: node index.js <yaml>')
    return 1;
}

const YAML = require('yamljs');
const express = require('express');
const swaggerUi = require('swagger-ui-express');

const apiSpec = YAML.load(specFile);
const app = express();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
