require('dotenv').config();

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const newman = require('newman');

async function runSQLScript(scriptPath) {
    const client = new Client({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    });

    try {
        await client.connect();
        console.log("Conectado no banco de dados");

        const sql = fs.readFileSync(path.resolve(__dirname, scriptPath), 'utf8');
        await client.query(sql);

        console.log("Script executado com sucesso!");
    } catch (error) {
        console.error("Erro executando script sql: ", error);
    } finally {
        await client.end();
    }
}

async function main() {
    await runSQLScript('./sql/setup.sql');
    
    newman.run({
        collection: require('./collections/integration.json'),
        reporters: 'cli'
    }, async function (err) {
        await runSQLScript('./sql/teardown.sql');
        if (err) { throw err; }
        console.log('Coleção executada com sucesso!');
    });
}

main();