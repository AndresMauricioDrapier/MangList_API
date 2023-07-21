const express = require("express");
const Comic = require("../models/comic.js");
const apiAxios = require("../API_MyAnimeList/Axios.Service.js");
const validations = require("../shared/validations.js");
const router = express.Router();

const fs = require("fs");
const path = require("path");

function getComicsJson(callback) {
    // eslint-disable-next-line no-undef
    const filePath = path.join(__dirname, "../assets/backup/comics.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            callback(err, null);
            return;
        }

        const comics = JSON.parse(data);
        callback(null, comics);
    });
}


router.get("/", async (req, res) => {

    if (req.query["search"]) {
        
        apiAxios.getAllMangasByString(req.query.search)
            .then((result) => {
                if (result) {
                    res.status(200).send({ ok: true, result: result });
                } else {
                    res.status(500).send({
                        ok: false,
                        error: "Error al buscar el comic.",
                    });
                }
            })
            .catch(() => {
                getComicsJson((err, comics) => {
                    if (err) {
                        res.status(500).send({ ok: false, error: "Error al leer el archivo" + err });
                    }
                    let comicSearch = comics.data.filter(comic => comic.node.title.toLowerCase().includes(req.query.search.toLowerCase()));
                    res.status(200).send({ ok: true, result: { data: comicSearch } });
                });

            });
    } if (req.query["categorias"]) {
        apiAxios.getAllCategories()
            .then((result) => {
                if (result) {
                    res.status(200).send({ ok: true, result: result });
                } else {
                    res.status(500).send({
                        ok: false,
                        error: "Error al buscar los comics.",
                    });
                }
            })
            .catch(() => {
                getComicsJson((err, comics) => {
                    if (err) {
                        res.status(500).send({ ok: false, error: "Error al leer el archivo" + err });
                    }
                    res.status(200).send({ ok: true, result: comics.data });
                });
            });
    }
    else {
        Comic.find()
            .then((result) => {
                if (result.length > 0) {
                    apiAxios.getAllMangas().then((data) => {
                        result.forEach((e) => {
                            data.data.push({ node: e, ranking: { rank: 2 } });
                        });
                        res.status(200).send({ ok: true, result: data.data });
                    }).catch(() => {
                        getComicsJson((err, comics) => {
                            if (err) {
                                res.status(500).send({ ok: false, error: "Error al leer el archivo" + err });
                            }
                            result.forEach((e) => {
                                comics.push({ node: e, ranking: { rank: 2 } });
                            });
                            res.status(200).send({ ok: true, result: comics.data });
                        });
                    });
                } else {
                    apiAxios.getAllMangas().then((data) => {
                        res.status(200).send({ ok: true, result: Object.assign(data.data) });
                    }).catch(() => {
                        getComicsJson((err, comics) => {
                            if (err) {
                                res.status(500).send({ ok: false, error: "Error al leer el archivo" + err });
                            }
                            res.status(200).send({ ok: true, result: comics.data });
                        });
                    });
                }
            })
            .catch(() => {
                apiAxios.getAllMangas().then((data) => {
                    res.status(200).send({ ok: true, result: data.data });
                }).catch(() => {
                    getComicsJson((err, comics) => {
                        if (err) {
                            res.status(500).send({ ok: false, error: "Error al leer el archivo" + err });
                        }
                        res.status(200).send({ ok: true, result: comics.data });
                    });
                });
            });
    }
});

router.get("/:id", async (req, res) => {
    Comic.findById(req.params["id"])
        .then((result) => {
            if (result) {
                res.status(200).send({ ok: true, result: result });
            } else {
                res.status(500).send({
                    ok: false,
                    error: "Error al buscar el comic.",
                });
            }
        })
        .catch(() => {

            apiAxios.getComicId(req.params["id"]).then((data) => {
                res.status(200).send({ ok: true, result: data });
            }).catch(() => {
                getComicsJson((err, comics) => {
                    if (err) {
                        res.status(500).send({ ok: false, error: "Error al leer el archivo" + err });
                    }
                    let comicId = comics.data.find((comic) => comic.node.id == req.params["id"]);
                    res.status(200).send({ ok: true, result: comicId.node });
                });
            });
        });
});

router.post("/add", validations.validateToken, validations.validateRole, validations.validateAdmin, async (req, res) => {
    let newComic = new Comic(req.body);
    if (newComic) {
        Comic.find()
            .then((comics) => {
                let existComic = comics.filter(
                    (comic) =>
                        comic.title == req.body.title
                );

                if (existComic.length > 0) {
                    res.status(400).send({
                        ok: false,
                        error: "El comic ya existe.",
                    });
                } else {
                    newComic.save(req.body).then((result) => {
                        if (result) {
                            res.status(200).send({ ok: true, result: result });
                        } else {
                            res.status(500).send({
                                ok: false,
                                error: "Error al registrar el comic.",
                            });
                        }
                    }).catch((e) => {
                        res.status(500).send({
                            ok: false,
                            error: "Error al registrar el comic." + e,
                        });
                    });
                }
            })
            .catch((e) => {
                res.status(400).send({
                    ok: false,
                    error: "Error al registrar el comic: " + e,
                });
            });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }
});

router.put("/:id", validations.validateToken, validations.validateRole, async (req, res) => {
    let newComic = new Comic(req.body);
    if (newComic) {
        Comic.findByIdAndUpdate(req.params["id"], {
            $set: {
                genres: newComic.genres, main_picture: newComic.main_picture, mean: newComic.mean,
                num_volumes: newComic.num_volumes, start_date: newComic.start_date, status: newComic.status, synopsis: newComic.synopsis, title: newComic.title
            }
        }, { new: true, runValidators: true, }).then((result) => {
            res.status(200).send({ ok: true, result: result });
        }).catch((error) => {
            res.status(400).send({
                ok: false,
                error: "Error modificando el comic: " + error,
            });
        });
    } else {
        res.status(500).send({
            ok: false,
            error: "Datos recibidos incorrectos.",
        });
    }

});

router.delete("/:id", validations.validateAdmin, async (req, res) => {
    Comic.findByIdAndRemove(req.params.id).then(resultado => {
        res.status(200).send({ ok: true, result: resultado });
    }).catch(() => {
        res.status("error", { error: "Error borrando libro" });
    });
});

module.exports = router;
