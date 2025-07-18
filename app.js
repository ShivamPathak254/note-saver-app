const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/Note');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('dotenv').config();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const app = express();
const PORT = 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Show all notes
app.get('/', async (req, res) => {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.render('index', { notes });
});

// Create note
app.post('/submit', async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.send('Both fields required');
    await Note.create({ title, content });
    res.redirect('/');
});

// Read full note
app.get('/read/:id', async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (!note) return res.send('Note not found');
    res.render('read', { note });
});

// Edit page
app.get('/edit/:id', async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('edit', { note });
});

// Handle update
app.put('/edit/:id', async (req, res) => {
    const { title, content } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, content });
    res.redirect('/');
});

// Delete
app.delete('/delete/:id', async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
