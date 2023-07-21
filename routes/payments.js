const express = require("express");
const validations = require("../shared/validations.js");

const Payment = require("../models/payment.js");
const User = require("../models/user.js");
let router = express.Router();

router.get("/", validations.validateAdmin, async (req, res) => {
    Payment.find()
        .then((result) => {
            res.status(200).send({ ok: true, result: result });
        })
        .catch(() => {
            res.status(500).send({
                ok: false,
                error: "Error al buscar los pagos.",
            });
        });
});

router.get("/:id", validations.validateAdmin, async (req, res) => {
    Payment.findById(req.params["id"])
        .then((result) => {
            if (result) {
                res.status(200).send({ ok: true, result: result });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el pago.",
                });
            }
        })
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Pago no encontrado.",
            });
        });
});

router.post("/", validations.validateToken, async (req, res) => {
    if (req.body) {
        let newPayment = new Payment({
            userId: req.body.userId,
            mailUser: req.body.mailUser,
            type: req.body.type,
            method: req.body.method,
            date: req.body.date,
            amount: req.body.amount,
        });

        User.findById(newPayment.userId).then((resultUser) => {
            if (resultUser) {
                if (resultUser.role == "admin" || resultUser.role == "subscribed") {
                    res.status(401).json({ error: "Ya tienes una subscripción" });
                } else {
                    newPayment
                        .save()
                        .then((resultPayment) => {
                            if (resultPayment) {
                                User.findByIdAndUpdate(newPayment.userId, { role: "subscribed" }).then((resultUser) => {
                                    if (resultUser) {
                                        res.status(200).send({
                                            ok: true,
                                            result: resultPayment,
                                        });
                                    } else {
                                        res.status(500).send({
                                            ok: false,
                                            error: "No se ha encontrado el usuario.",
                                        });
                                    }
                                }).catch(() => {
                                    res.status(400).send({
                                        ok: false,
                                        error: "Error al editar el rol del usuario.",
                                    });
                                });
                            } else {
                                res.status(500).send({
                                    ok: false,
                                    error: "Error al registrar el pago.",
                                });
                            }
                        })
                        .catch(() => {
                            res.status(400).send({
                                ok: false,
                                error: "Error al registrar el pago.",
                            });
                        });
                }
            } else {
                res.status(400).send({
                    ok: false,
                    error: "Usuario no existe.",
                });
            }
        }).catch(() => {
            res.status(400).send({
                ok: false,
                error: "Error al comprobar el usuario.",
            });
        });
    } else {
        res.status(500).send({
            ok: false,
            error: "Error al registrar el pago.",
        });
    }
});

module.exports = router;
