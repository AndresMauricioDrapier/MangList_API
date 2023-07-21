const express = require("express");
const bcrypt = require("bcrypt");
const validations = require("../shared/validations.js");
const functions = require("../shared/functions.js");
const nodemailer = require("nodemailer");

let User = require("../models/user.js");
let router = express.Router();

router.get("/", validations.validateToken, async (req, res) => {
    User.find()
        .then((result) => {
            if (result) {
                let usersWithoutPassword = [];
                result.forEach((user) => {
                    if (user.role !== "admin") {
                        usersWithoutPassword.push({
                            _id: user._id,
                            name: user.name,
                            avatar: user.avatar,
                            role: user.role,
                        });
                    }
                });
                res.status(200).send({ ok: true, result: usersWithoutPassword });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar los usuarios.",
                });
            }
        })
        .catch((error) => {
            res.status(400).send({
                ok: false,
                error: error,
            });
        });
});

router.get("/:id", validations.validateToken, async (req, res) => {
    User.findById(req.params["id"])
        .then((result) => {
            if (result) {
                let usersWithoutPassword = ({
                    _id: result._id,
                    name: result.name,
                    avatar: result.avatar,
                    email: result.email,
                    role: result.role,
                    lastComicRead: result.lastComicRead,
                    favorites: result.favorites,
                });
                res.status(200).send({ ok: true, result: usersWithoutPassword });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el usuario.",
                });
            }
        })
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Usuario no encontrado.",
            });
        });
});

router.put("/favorites/:id", validations.validateToken, async (req, res) => {
    if (req.body) {
        User.findByIdAndUpdate(
            req.params["id"],
            {
                $addToSet: {
                    favorites: req.body.idComic
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .then((result) => {
                res.status(200).send({ ok: true, result: result });
            })
            .catch((error) => {
                res.status(400).send({
                    ok: false,
                    error: error + "Error modificando los favoritos.",
                });
            });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.put("/password-recovery", async (req, res) => {
    if (req.body) {
        const newPassword = functions.passGenerator(8);

        User.find().then((result) => {
            const user = result.find((user) => user.email === req.body.email);
            if (user) {
                User.findByIdAndUpdate(user._id, {
                    $set: {
                        password: bcrypt.hashSync(newPassword, 8),
                    },
                }, {
                    new: true,
                    runValidators: true,
                }).then(() => {

                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        post: 587,
                        auth: {
                            user: "info.manglist@gmail.com",
                            pass: "zsdxowdmmpkvgnlc"
                        }
                    });

                    const mailOptions = {
                        from: "MangList", // tu dirección de correo electrónico
                        to: req.body.email, // dirección de correo electrónico del destinatario
                        subject: "Recuperación de contraseña",
                        text: "Tu nueva contraseña es: " + newPassword + " |Recuerda cambiarla nuevamente en tu perfil."
                    };
                    transporter.sendMail(mailOptions, function (error) {
                        if (error) {
                            res.status(400).send({
                                ok: false,
                                error: "Error al enviar el correo (post)" + error,
                            });
                        } else {
                            res.status(200).send({
                                ok: true,
                                result: result,
                            });
                        }
                    });
                }).catch((error) => {
                    res.status(400).send({
                        ok: false,
                        error: error + "Error modificando la contraseña."
                    });
                });
            }

        }).catch((error) => {
            res.status(400).send({
                ok: false,
                error: error + "Error buscando el usuario."
            });
        });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.put("/favorites/delete/:id", validations.validateToken, async (req, res) => {
    if (req.body) {
        User.findByIdAndUpdate(
            req.params["id"],
            {
                $pullAll: {
                    favorites: [{ _id: req.body.idComic }],
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .then((result) => {
                res.status(200).send({ ok: true, result: result });
            })
            .catch((error) => {
                res.status(400).send({
                    ok: false,
                    error: error + "Error eliminando el comic favorito.",
                });
            });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.put("/user/:id", validations.validateToken, async (req, res) => {
    if (req.body) {
        User.findByIdAndUpdate(req.params["id"], {
            $set: {
                name: req.body.name,
                email: req.body.email,
            },
        }, {
            new: true,
            runValidators: true,
        }).then((result) => {
            res.status(200).send({ ok: true, result: result });
        }).catch((error) => {
            res.status(400).send({
                ok: false,
                error: error + "Error modificando el usuario.",
            });
        });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.put("/password/:id", validations.validateToken, async (req, res) => {
    if (req.body && req.body.firstPassword === req.body.secondPassword) {
        User.findByIdAndUpdate(req.params["id"], {
            $set: {
                password: bcrypt.hashSync(req.body.firstPassword, 8),
            },
        }, {
            new: true,
            runValidators: true,
        }).then((result) => {
            res.status(200).send({ ok: true, result: result });
        }).catch((error) => {
            res.status(400).send({
                ok: false,
                error: error + "Error modificando la contraseña.",
            });
        });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.put("/avatar/:id", validations.validateToken, async (req, res) => {

    User.findByIdAndUpdate(
        req.params["id"],
        {
            $set: {
                avatar: req.body.avatar,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    )
        .then((result) => {
            res.status(200).send({ ok: true, result: result });
        })
        .catch((error) => {
            res.status(400).send({
                ok: false,
                error: error + "Error modificando el avatar.",
            });
        });
}
);

router.put("/promote/:id", validations.validateToken, validations.validateAdmin, async (req, res) => {
    User.findByIdAndUpdate(
        req.params["id"],
        {
            $set: {
                role: "admin",
            },
        },
        {
            new: true,
            runValidators: true,
        }
    )
        .then(() => {
            res.status(200).send({ ok: true, result: "Promovido a administrador correctamente" });
        })
        .catch((error) => {
            res.status(400).send({
                ok: false,
                error: error + "Error dando permisos de administrador.",
            });
        });
});

router.put("/remove/:id", validations.validateToken, validations.validateAdmin, async (req, res) => {
    User.findByIdAndUpdate(
        req.params["id"],
        {
            $set: {
                role: "user",
            },
        },
        {
            new: true,
            runValidators: true,
        }
    )
        .then(() => {
            res.status(200).send({ ok: true, result: "Removido de administrador correctamente" });
        })
        .catch((error) => {
            res.status(400).send({
                ok: false,
                error: error + "Error quitando permisos de administrador.",
            });
        });
});

router.put("/lastComicRead/:id", validations.validateToken, async (req, res) => {
    if (req.body) {
        User.findByIdAndUpdate(
            req.params["id"],
            {
                $set: {
                    lastComicRead: req.body.lastComicRead,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .then((result) => {
                res.status(200).send({ ok: true, result: result });
            })
            .catch((error) => {
                res.status(400).send({
                    ok: false,
                    error: error + "Error modificando el último comic leído.",
                });
            });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

//! QUITAR EL ROLE PARA QUE NO PUEDA SER ADMIN
router.put("/:id", validations.validateToken, async (req, res) => {
    if (req.body) {
        User.findByIdAndUpdate(
            req.params["id"],
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 8),
                    avatar: req.body.avatar,
                    role: req.body.role
                },
            },
            {
                new: true,
                runValidators: true,
            }
        )
            .then((result) => {
                res.status(200).send({ ok: true, result: result });
            })
            .catch((error) => {
                res.status(400).send({
                    ok: false,
                    error: error + "Error modificando el usuario.",
                });
            });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.delete("/:id", validations.validateDeleteAndAdmin, async (req, res) => {
    User.findByIdAndDelete(req.params["id"])
        .then((result) => {
            res.status(200).send({ ok: true, result: result });
        })
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Error eliminando el usuario",
            });
        });
});

module.exports = router;
