const router = require("express").Router();
const Note = require("../models/Note");
const { isAuthenticated } = require("../helpers/out");

router.get("/notes/add", isAuthenticated, (req, res) => {
  res.render("notes/new-note");
});

router.post("/notes/new-note", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({ text: "Please Write a Tittle" });
  }
  if (!description) {
    errors.push({ text: "Please Write a Description" });
  }
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      description,
    });
  } else {
    const newNote = new Note({
      title,
      description,
    });
    newNote.user = req.user.id;
    await newNote.save();
    req.flash("success_msg", "Note Added Successfully");
    res.redirect("/notes");
  }
});

router.get("/notes", isAuthenticated, async (req, res) => {
  await Note.find({user: req.user.id})
    .sort({ date: "desc" })
    .then((datos) => {
      const contexto = {
        notes: datos.map((documento) => {
          return {
            title: documento.title,
            description: documento.description,
            _id: documento._id,
          };
        }),
      };
      res.render("notes/allnotes", {
        notes: contexto.notes,
      });
    });
});

router.get("/notes/edit/:id", isAuthenticated, async (req, res) => {
  const dataNota = await Note.findById(req.params.id).lean();
  res.render("notes/edit-note", { dataNota });
});

router.put("/notes/edit-note/:id", isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success_msg", "Note Updated Succesfully");
  res.redirect("/notes");
});

router.delete("/notes/delete/:id", isAuthenticated, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted Succesfully");
  res.redirect("/notes");
});
module.exports = router;
