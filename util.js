module.exports.enviarEmail = function (email, subject, content) {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: subject,
    text: content,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent to " + email);
    })
    .catch((error) => {
      console.error(error);
    });
}

module.exports.enviarEmailHTML = function (email, subject, content) {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: subject,
    html: content,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent to " + email);
    })
    .catch((error) => {
      console.error(error);
    });
}

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

module.exports.formatDate = function(date, format) {
  if (format == 1) {
    return (
      [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join("/") +
      " " +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(":")
    );
  } else {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join("-") +
      " " +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(":")
    );
  }
}

module.exports.usuarioDefiniuUnidade = async function(request, response) {
  await new Promise((resolve, _reject) => {
    // verifica se o usuario já definiu sua unidade para liberar o acesso a outras funcionalidades
    if (request.session.unidade_usuario == undefined) {
      user_id = request.oidc.user.sub;
      pool.query(
        `SELECT codigo FROM vagas WHERE disponivel = true ORDER BY codigo;
        SELECT * FROM unidades WHERE user_id = '${user_id}';
        SELECT unidade FROM unidades WHERE user_id IS NULL ORDER BY unidade;`,
        (error, results) => {
          if (error) {
            console.log(error.message);
          } else {
            if (
              results[1].rows[0] == undefined ||
              results[1].rows[0].unidade == null
            ) {
              response.render("meusdados.ejs", {
                user_id: user_id,
                email: request.oidc.user.email,
                name: request.oidc.user.name,
                unidade: null,
                vagas_escolhidas: null,
                mensagem: [
                  "warning",
                  "Atenção!",
                  "Você precisa definir a sua unidade para ter acesso a outras funcionalidades!",
                ],
                lista_vagas: results[0].rows,
                lista_unidades: results[2].rows,
                vaga_sorteada: null,
                usuario_admin: request.session.usuario_admin,
              });
              resolve('meusdados');
            } else {
              request.session.unidade_usuario = results[1].rows[0].unidade;
            }
          }
        }
      );
    }
    resolve('OK');
  });  
}
