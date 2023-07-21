const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.js");
const router = express.Router();
const globalToken = require("../shared/const.js");


router.post("/register",  async (req, res) => {

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        avatar: req.body.avatar,
        role: "user",
    });

    User.find().then((users) => {
        let existUser = users.filter(
            (user) => user.name == newUser.name || user.email == newUser.email
        );

        if (existUser.length > 0) {
            res.status(400).send({
                ok: false,
                error: "El usuario ya existe.",
            });
        } else {
            newUser
                .save()
                .then((result) => {
                    if (result) {
                        res.status(200).send({ ok: true, result: result });
                    } else {
                        res.status(500).send({
                            ok: false,
                            error: "Error al registrar el usuario.",
                        });
                    }
                })
                .catch(() => {
                    res.status(400).send({
                        ok: false,
                        error: "Error al registrar el usuario: " + newUser.avatar,
                    });
                });
        }
    }).catch(() => {
        res.status(400).send({
            ok: false,
            error: newUser,
        });
    });
});

router.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.find()
        .then((users) => {
            let existUser = users.filter(
                (user) =>
                    user.email == email &&
                    bcrypt.compareSync(password, user.password)
            );

            if (existUser.length > 0) {
                const token = jwt.sign({
                    password: password,
                    email: email
                }, globalToken.TOKEN_SECRET);

                res.set({
                    "auth-token": token,
                    "user-id": existUser[0].id
                }).json({
                    error: null,
                    data: { token: token, id: existUser[0].id }
                });

            } else {
                res.status(400).send({
                    ok: false,
                    error: "Usuario o contraseña incorrectos.",
                });
            }
        })
        .catch((error) => {
            res.status(500).send({
                ok: false,
                error: "Error iniciando sesion de usuario: " + error,
            });
        });
});

module.exports = router;
