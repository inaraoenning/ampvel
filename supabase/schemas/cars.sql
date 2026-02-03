-- Tabela de carros
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  year INTEGER NOT NULL,
  km INTEGER NOT NULL,
  transmission TEXT NOT NULL,
  fuel TEXT NOT NULL,
  description TEXT,
  images TEXT[], -- Array de URLs das imagens
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Política: todos podem ler
CREATE POLICY "Anyone can read cars" 
ON cars FOR SELECT 
USING (true);

-- Política: apenas autenticado pode inserir/editar/deletar
CREATE POLICY "Authenticated can insert cars" 
ON cars FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');