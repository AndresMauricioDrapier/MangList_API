const express = require("express");
const validations = require("../shared/validations.js");

const Commentary = require("../models/commentary.js");
let router = express.Router();

router.get("/", async (req, res) => {
    Commentary.find()
        .then((result) => {
            res.status(200).send({ ok: true, result: result });
        })
        .catch(() => {
            res.status(500).send({
                ok: false,
                error: "Error al buscar los comentarios.",
            });
        });
});

router.get("/:id", validations.validateToken, async (req, res) => {
    Commentary.findById(req.params["id"])
        .then((result) => {
            if (result) {
                res.status(200).send({ ok: true, result: result });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el comentario.",
                });
            }
        })
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Comentario no encontrado.",
            });
        });
});

router.get("/comic/:id", async (req, res) => {
    Commentary.find({ comicId: req.params["id"] })
        .then((result) => {
            if (result) {
                // result = result.map((commentary) => {
                //     return commentary.comicId == req.params["id"];
                // });
                res.status(200).send({ ok: true, result: result });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar los comentarios.",
                });
            }
        })
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Comentarios no encontrados.",
            });
        });
});

router.get("/user/:id", validations.validateToken, async (req, res) => {
    Commentary.find({ userId: req.params["id"] })
        .then((result) => {
            if (result) {
                result = result.map((commentary) => {
                    return commentary.user._id == req.params["id"];
                });
                res.status(200).send({ ok: true, result: result });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar los comentarios.",
                });
            }
        })
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Comentarios no encontrados.",
            });
        });
});

router.post("/", validations.validateToken, async (req, res) => {
    if (req.body) {
        Commentary.create(req.body)
            .then((result) => {
                res.status(200).send({ ok: true, result: result });
            })
            .catch((error) => {
                res.status(500).send({
                    ok: false,
                    error: error,
                });
            });
    } else {
        res.status(400).send({
            ok: false,
            error: "Error al crear el comentario.",
        });
    }
});

router.delete("/:id", validations.validateToken, async (req, res) => {
    Commentary.findByIdAndDelete(req.params["id"])
        .then((result) => {
            if (result) {
                res.status(200).send({ ok: true, result: result });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al eliminar el comentario.",
                });
            }
        })
        .catch(() => {
            res.status(400).send({
                ok: false,
                error: "Comentario no encontrado.",
            });
        });
});

module.exports = router;
