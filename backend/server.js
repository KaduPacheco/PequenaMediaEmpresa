require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do Banco de Dados PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Testar a conexão com o banco
pool.connect()
  .then(() => console.log('Conectado ao PostgreSQL com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao PostgreSQL', err.stack));

// Middlewares
app.use(cors());
app.use(express.json());

// Rota POST /leads
app.post('/leads', async (req, res) => {
  const { nome, email, telefone, empresa, colaboradores } = req.body;

  // Validação básica
  if (!nome || !email) {
    return res.status(400).json({ error: 'Os campos nome e email são obrigatórios.' });
  }

  try {
    const query = `
      INSERT INTO leads (nome, email, telefone, empresa, colaboradores) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *;
    `;
    const values = [nome, email, telefone, empresa, colaboradores];
    
    // Executando a query de forma assíncrona
    const result = await pool.query(query, values);
    const newLead = result.rows[0];

    // Enviar Webhook em segundo plano (não trava a resposta)
    fetch('https://n8n.forteia.com.br/webhook/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: newLead.nome,
            email: newLead.email,
            telefone: newLead.telefone,
            empresa: newLead.empresa,
            colaboradores: newLead.colaboradores,
            created_at: newLead.created_at
        })
    }).catch(err => console.error('Erro ao chamar webhook do n8n:', err.message));

    // Retornando resposta de sucesso
    return res.status(201).json({
      message: 'Lead salvo com sucesso!',
      lead: newLead
    });
  } catch (error) {
    console.error('Erro ao salvar o lead no banco de dados:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao salvar os dados.' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
