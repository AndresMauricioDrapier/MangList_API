const express = require("express");
const Mail = require("../controllers/mail.controller.js");
const router = express.Router();

router.post("/", async (req, res) => {
    Mail.sendMail(req.body).then(() => {
        res.status(200).send({ ok: true, result: "Email enviado con exito" });
    }).catch((error) => {
        res.status(400).send({
            ok: false,
            error: "Error al enviar el correo (post)" + error,
        });
    });
});

module.exports = router;
