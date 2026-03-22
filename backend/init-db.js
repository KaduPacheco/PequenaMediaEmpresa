require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function initDb() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('Tabela leads verificada/criada com sucesso!');
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === '3D000') {
        console.error('Erro de conexão com o banco! Verifique as variáveis no .env, bem como se o servidor do banco está rodando e o banco existe. ', error.message);
    } else {
        console.error('Erro ao criar a tabela:', error);
    }
  } finally {
    console.log('Fechando conexão temporária.');
    await pool.end();
  }
}

initDb();
