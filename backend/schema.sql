CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(50),
    empresa VARCHAR(255),
    colaboradores VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
