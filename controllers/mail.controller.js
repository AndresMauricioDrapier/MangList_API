const nodeMailer = require("nodemailer");

const sendMail = async (req, res) => {
    const config = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        post: 587,
        auth: {
            user: "info.manglist@gmail.com",
            pass: "zsdxowdmmpkvgnlc"
        }
    });

    const opciones = {
        from: "Manglist",
        subject: req.subject,
        to: req.to,
        text: req.message
    };

    config.sendMail(opciones, (error, result) => {
        console.log(error);

        if (error) return res.status(500).send({
            ok: false,
            error: "Error al enviar el correo: " + error,
        });

        return res.json({
            ok: true,
            message: result,
        });
    });
};

const sendMailPdf = async (req, res) => {
    console.error("No implementado" + req + res);
};

module.exports = { sendMail, sendMailPdf };