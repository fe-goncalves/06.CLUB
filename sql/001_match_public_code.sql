-- 06CLUB — Código público de 5 caracteres por partida
-- Rodar no SQL Editor do Supabase

ALTER TABLE matches
  ADD COLUMN IF NOT EXISTS public_code text;

-- Índice único (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS matches_public_code_uidx
  ON matches (upper(public_code))
  WHERE public_code IS NOT NULL;

-- Gera códigos para partidas existentes sem código
CREATE OR REPLACE FUNCTION generate_match_public_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  alphabet text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  candidate text;
  i int;
BEGIN
  LOOP
    candidate := '';
    FOR i IN 1..5 LOOP
      candidate := candidate || substr(alphabet, 1 + floor(random() * 36)::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM matches WHERE upper(public_code) = candidate
    );
  END LOOP;
  RETURN candidate;
END;
$$;

UPDATE matches
SET public_code = generate_match_public_code()
WHERE public_code IS NULL OR length(public_code) <> 5;

-- Opcional: trigger para novos inserts
CREATE OR REPLACE FUNCTION matches_set_public_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.public_code IS NULL OR length(NEW.public_code) <> 5 THEN
    NEW.public_code := generate_match_public_code();
  ELSE
    NEW.public_code := upper(NEW.public_code);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_matches_public_code ON matches;
CREATE TRIGGER trg_matches_public_code
  BEFORE INSERT OR UPDATE OF public_code ON matches
  FOR EACH ROW
  EXECUTE FUNCTION matches_set_public_code();

-- RLS: garantir SELECT público apenas do necessário (ajuste conforme suas policies)
-- Exemplo (só se ainda não existir policy de leitura):
-- CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
