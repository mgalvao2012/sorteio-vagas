-- CREATE ROLE api_user WITH LOGIN PASSWORD 'password';
-- ALTER ROLE api_user CREATEDB;

-- CREATE DATABASE sorteio_vagas;
-- \c sorteio_vagas

DROP TABLE IF EXISTS configuracao;
DROP TABLE IF EXISTS unidades;
DROP TABLE IF EXISTS vagas;

CREATE TABLE configuracao (
  id SERIAL PRIMARY KEY,
  ultimo_sorteio TIMESTAMP,
  resultado_sorteio VARCHAR(255)
);
INSERT INTO configuracao (ultimo_sorteio, resultado_sorteio) values (NOW(), 'Sorteio não realizado');

CREATE TABLE vagas (
  codigo CHAR(5) PRIMARY KEY,
  bloqueada BOOLEAN,
  ultima_gravacao TIMESTAMP default CURRENT_TIMESTAMP
);

CREATE TABLE unidades (
  unidade CHAR(5) PRIMARY KEY,
  pne BOOLEAN,
  presente BOOLEAN,
  adimplente BOOLEAN,
  vaga_sorteada CHAR(5) REFERENCES Vagas (codigo),
  user_id CHAR(80),
  ultima_gravacao TIMESTAMP default CURRENT_TIMESTAMP,
  vagas_escolhidas JSONB
);

INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G01', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G02', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G03', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G04', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G05', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G06', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G07', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G08', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G09', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G10', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G11', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G12', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G13', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G14', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G15', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G16', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G17', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G18', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G19', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G20', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G21', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G22', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G23', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G24', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G25', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G26', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G27', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G28', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G29', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G30', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G31', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G32', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G33', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G34', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G35', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G36', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G37', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G38', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G39', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G40', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G41', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G42', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G43', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G44', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G45', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G46', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G47', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G48', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G49', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G50', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G51', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G52', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G53', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G54', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G55', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G56', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G57', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G58', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G59', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G60', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G61', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G62', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G63', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G64', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G65', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G66', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G67', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G68', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G69', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G70', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G71', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G72', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G73', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G74', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G75', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G76', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G77', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G78', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G79', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G80', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G81', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G82', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G83', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G84', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G85', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G86', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G87', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G88', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G89', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G90', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G91', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G92', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G93', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S1G94', false);

INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G01', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G02', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G03', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G04', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G05', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G06', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G07', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G08', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G09', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G10', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G11', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G12', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G13', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G14', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G15', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G16', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G17', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G18', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G19', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G20', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G21', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G22', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G23', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G24', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G25', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G26', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G27', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G28', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G29', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G30', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G31', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G32', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G33', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G34', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G35', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G36', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G37', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G38', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G39', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G40', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G41', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G42', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G43', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G44', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G45', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G46', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G47', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G48', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G49', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G50', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G51', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G52', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G53', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G54', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G55', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G56', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G57', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G58', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G59', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G60', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G61', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G62', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G63', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G64', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G65', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G66', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G67', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G68', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G69', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G70', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G71', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G72', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G73', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G74', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G75', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G76', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G77', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G78', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G79', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G80', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G81', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G82', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G83', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G84', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G85', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G86', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G87', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G88', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G89', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G90', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G91', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G92', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G93', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G94', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G95', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G96', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G97', false);
INSERT INTO vagas (codigo, bloqueada) VALUES ('S2G98', false);

INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1041', false, true, true, NULL, '[{"vaga": "S1G01"},{"vaga": "S1G02"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1042', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1043', false, true, false, NULL, '[{"vaga": "S1G01"},{"vaga": "S1G03"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1044', false, true, true, NULL, '[{"vaga": "S1G04"},{"vaga": "S1G05"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1051', false, false, true, NULL, '[{"vaga": "S1G04"},{"vaga": "S1G05"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1052', false, false, true, NULL, '[{"vaga": "S1G03"},{"vaga": "S1G04"},{"vaga": "S1G05"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1053', true, true, true, NULL, '[{"vaga": "S1G01"},{"vaga": "S1G08"},{"vaga": "S1G04"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1054', true, true, true, NULL, '[{"vaga": "S1G01"},{"vaga": "S1G08"},{"vaga": "S1G04"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T1061', true, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T2041', false, true, true, NULL, '[{"vaga": "S2G01"},{"vaga": "S2G02"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T2042', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T2043', false, true, false, NULL, '[{"vaga": "S1G01"},{"vaga": "S1G03"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T2044', false, true, true, NULL, '[{"vaga": "S1G04"},{"vaga": "S1G05"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T2051', false, false, true, NULL, '[{"vaga": "S1G04"},{"vaga": "S1G05"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T2052', false, false, true, NULL, '[{"vaga": "S1G03"},{"vaga": "S1G04"},{"vaga": "S1G05"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T2053', true, true, true, NULL, '[{"vaga": "S1G01"},{"vaga": "S1G08"},{"vaga": "S1G04"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T2054', true, true, true, NULL, '[{"vaga": "S1G01"},{"vaga": "S1G08"},{"vaga": "S1G04"}]');
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas)
VALUES ('T2061', true, true, true, NULL, NULL);