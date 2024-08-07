-- CREATE ROLE api_user WITH LOGIN PASSWORD 'password';
-- ALTER ROLE api_user CREATEDB;

-- CREATE DATABASE sorteio_vagas;
-- \c sorteio_vagas
-- Habilita a criptografia nativa para armanezar senhas
-- CREATE EXTENSION pgcrypto;

SET TIMEZONE TO 'America/Sao_Paulo';

DROP TABLE IF EXISTS configuracao;
DROP TABLE IF EXISTS unidades;
DROP TABLE IF EXISTS vagas;

CREATE TABLE configuracao (
  id SERIAL PRIMARY KEY,
  ultimo_sorteio TIMESTAMP,
  bloqueio_sorteio TIMESTAMP,
  resultado_sorteio VARCHAR(255),
  resultado_bloqueio VARCHAR(255),
  log_sorteio TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO configuracao (resultado_sorteio, resultado_bloqueio) values ('Sorteio não realizado', 'Sorteio não bloqueado');

CREATE TABLE vagas (
  codigo CHAR(5) PRIMARY KEY,
  disponivel BOOLEAN,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

CREATE TABLE unidades (
  unidade CHAR(5) PRIMARY KEY,
  pne BOOLEAN,
  presente BOOLEAN,
  adimplente BOOLEAN,
  vaga_sorteada CHAR(5) REFERENCES Vagas (codigo),
  user_id CHAR(80) UNIQUE,
  email CHAR(255) UNIQUE,
  nome CHAR(255),
  senha CHAR(80),
  ordem_sorteio SMALLINT,
  ordem_vaga_escolhida SMALLINT,
  vagas_escolhidas JSONB.
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO vagas (codigo, disponivel) VALUES ('S1G01', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G02', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G03', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G04', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G05', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G06', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G07', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G08', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G09', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G10', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G11', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G12', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G13', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G14', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G15', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G16', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G17', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G18', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G19', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G20', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G21', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G22', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G23', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G24', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G25', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G26', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G27', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G28', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G29', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G30', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G31', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G32', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G33', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G34', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G35', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G36', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G37', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G38', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G39', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G40', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G41', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G42', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G43', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G44', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G45', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G46', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G47', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G48', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G49', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G50', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G51', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G52', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G53', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G54', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G55', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G56', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G57', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G58', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G59', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G60', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G61', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G62', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G63', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G64', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G65', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G66', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G67', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G68', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G69', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G70', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G71', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G72', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G73', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G74', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G75', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G76', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G77', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G78', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G79', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G80', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G81', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G82', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G83', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G84', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G85', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G86', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G87', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G88', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G89', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G90', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G91', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G92', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G93', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S1G94', true);

INSERT INTO vagas (codigo, disponivel) VALUES ('S2G01', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G02', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G03', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G04', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G05', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G06', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G07', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G08', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G09', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G10', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G11', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G12', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G13', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G14', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G15', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G16', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G17', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G18', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G19', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G20', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G21', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G22', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G23', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G24', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G25', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G26', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G27', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G28', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G29', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G30', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G31', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G32', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G33', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G34', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G35', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G36', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G37', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G38', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G39', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G40', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G41', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G42', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G43', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G44', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G45', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G46', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G47', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G48', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G49', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G50', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G51', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G52', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G53', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G54', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G55', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G56', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G57', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G58', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G59', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G60', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G61', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G62', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G63', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G64', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G65', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G66', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G67', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G68', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G69', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G70', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G71', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G72', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G73', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G74', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G75', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G76', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G77', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G78', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G79', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G80', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G81', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G82', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G83', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G84', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G85', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G86', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G87', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G88', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G89', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G90', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G91', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G92', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G93', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G94', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G95', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G96', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G97', true);
INSERT INTO vagas (codigo, disponivel) VALUES ('S2G98', true);

INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1011', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1012', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1013', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1014', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1021', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1022', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1023', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1024', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1031', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1032', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1033', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1034', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1041', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1042', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1043', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1044', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1051', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1052', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1053', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1054', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1061', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1062', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1063', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1064', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1071', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1072', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1073', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1074', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1081', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1082', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1083', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1084', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1091', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1092', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1093', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1094', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1101', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1102', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1103', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1104', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1111', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1112', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1113', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1114', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1121', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1122', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1123', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1124', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1131', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1132', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1133', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1134', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1141', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1142', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1143', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1144', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1151', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1152', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1153', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1154', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1161', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1162', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1163', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1164', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1171', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1172', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1173', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1174', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1181', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1182', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1183', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1184', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1191', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1192', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1193', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1194', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1201', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1202', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1203', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1204', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1211', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1212', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1213', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1214', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1221', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1222', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1223', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1224', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1231', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1232', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1233', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1234', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1241', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1242', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1243', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T1244', false, true, true, NULL, NULL);

INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2011', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2012', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2013', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2014', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2021', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2022', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2023', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2024', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2031', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2032', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2033', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2034', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2041', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2042', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2043', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2044', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2051', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2052', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2053', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2054', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2061', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2062', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2063', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2064', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2071', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2072', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2073', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2074', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2081', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2082', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2083', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2084', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2091', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2092', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2093', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2094', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2101', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2102', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2103', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2104', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2111', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2112', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2113', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2114', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2121', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2122', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2123', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2124', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2131', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2132', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2133', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2134', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2141', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2142', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2143', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2144', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2151', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2152', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2153', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2154', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2161', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2162', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2163', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2164', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2171', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2172', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2173', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2174', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2181', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2182', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2183', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2184', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2191', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2192', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2193', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2194', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2201', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2202', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2203', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2204', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2211', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2212', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2213', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2214', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2221', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2222', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2223', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2224', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2231', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2232', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2233', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2234', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2241', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2242', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2243', false, true, true, NULL, NULL);
INSERT INTO unidades (unidade, pne, presente, adimplente, vaga_sorteada, vagas_escolhidas) VALUES ('T2244', false, true, true, NULL, NULL);

CREATE OR REPLACE FUNCTION trigger_set_timestamp() 
  RETURNS TRIGGER AS $$ 
  BEGIN 
    NEW.atualizado_em = NOW(); 
    RETURN NEW; 
  END; 
  $$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp 
  BEFORE UPDATE ON configuracao FOR EACH row 
  EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp 
  BEFORE UPDATE ON unidades FOR EACH row 
  EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp 
  BEFORE UPDATE ON vagas FOR EACH row 
  EXECUTE PROCEDURE trigger_set_timestamp();
