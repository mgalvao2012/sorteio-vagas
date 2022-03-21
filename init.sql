-- CREATE ROLE api_user WITH LOGIN PASSWORD 'password';
-- ALTER ROLE api_user CREATEDB;

-- CREATE DATABASE sorteio_vagas;
-- \c sorteio_vagas

DROP TABLE IF EXISTS vagas;
DROP TABLE IF EXISTS unidades;

CREATE TABLE vagas (
  codigo CHAR(5) PRIMARY KEY,
  bloqueada BOOLEAN
);

CREATE TABLE unidades (
  unidade CHAR(5) PRIMARY KEY,
  pne BOOLEAN,
  presente BOOLEAN,
  adimplente BOOLEAN,
  vaga_sorteada CHAR(5) REFERENCES Vagas (codigo),
  vagas_escolhidas JSONB
);

INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G01', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G02', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G03', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G04', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G05', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G06', true);
INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G07', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('T1G08', false);


INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1041', false, true, true, NULL, '[{"vaga": "T1G01"},{"vaga": "T1G02"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1042', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1043', false, true, false, NULL, '[{"vaga": "T1G01"},{"vaga": "T1G03"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1044', false, true, true, NULL, '[{"vaga": "T1G04"},{"vaga": "T1G05"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1051', false, false, true, NULL, '[{"vaga": "T1G04"},{"vaga": "T1G05"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1052', false, false, true, NULL, '[{"vaga": "T1G03"},{"vaga": "T1G04"},{"vaga": "T1G05"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1053', true, true, true, NULL, '[{"vaga": "T1G01"},{"vaga": "T1G08"},{"vaga": "T1G04"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1054', true, true, true, NULL, '[{"vaga": "T1G01"},{"vaga": "T1G08"},{"vaga": "T1G04"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1061', true, true, true, NULL, NULL);
