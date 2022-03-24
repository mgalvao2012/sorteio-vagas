-- CREATE ROLE api_user WITH LOGIN PASSWORD 'password';
-- ALTER ROLE api_user CREATEDB;

-- CREATE DATABASE sorteio_vagas;
-- \c sorteio_vagas

DROP TABLE IF EXISTS unidades;
DROP TABLE IF EXISTS vagas;

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
  user_id CHAR(80),
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
