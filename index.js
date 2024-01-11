import express, { request, response } from "express";
import morgan from "morgan";
import cors from "cors";

const PORT = process.env.PORT || 3001;
const app = express();

morgan.token("body", function (req, res) {
    return JSON.stringify(req.body);
})

app.use(cors());
app.use(express.json());
app.use(morgan("method :url :status :body"));

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true,
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: true,
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of http protocool",
        important: true,
    },
    {
        id: 4,
        content: "ExpressJS is awesome",
        important: false,
    },
];

// HTTP Methods: GET, POST, DELETE, PUT, PATCH
// RESTful API
/**
 *  URL     verb Functionality
 */

function unknownEndpoint(req, res) {
    return res.status(404).send({ error: "unknown endpoint"});
}

function generateId(){
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
    return maxId + 1;
}

app.get("/", (req, res) => {
    return res.send("<h1>Hello from ExpressJS!</h1>")
});

app.get("/notes/info", (req, res) => {
    const notesCount = notes.length;
    console.log(notesCount);
    console.log("We are getting inside the info route");

    return res.send(`<p>Notes App have ${notesCount} Notes</p>`);
})

app.get("/notes", (req, res) => {
    return res.json(notes);
});

app.get("/notes/:id", (req, res) => {
    const id= Number (req.params.id);
    const note = notes.find((note) => note.id === id);

    return res.json(note);
})

app.delete("/notes/:id", (req, res) => {
    const id = Number (req.params.id);
    notes = notes.filter((note) => note.id !== id)

    return res.status(204).end();
});

app.post("/notes", (req, res) => {
    const body = req.body;

    if (!body.content) {
        return res.status(400).json({error: "content missing"});
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }

    notes = notes.concat(note);

    return res.status(201).json(notes);
});

app.use(unknownEndpoint);

app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
});
