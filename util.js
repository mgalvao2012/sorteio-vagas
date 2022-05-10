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

module.exports.formatDate = function (date, format) {
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
