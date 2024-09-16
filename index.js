const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
morgan.token('data', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

let persons = [
  { 
    id: "1",
    name: "Arto Hellas", 
    number: "040-123456"
  },
  { 
    id: "2",
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    id: "3",
    name: "Dan Abramov", 
    number: "12-43-234345"
  },
  { 
    id: "4",
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const reqTime = (new Date()).toString();
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${reqTime}</p>`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(p => p.id !== id);

  res.status(204).end();
});

function generateId() {
  return String(Math.floor(Math.random() * 9999999));
}

app.post('/api/persons', (req, res) => {
  const name = req.body.name;
  const number = req.body.number;

  if (!name || !number) {
    return res.status(400).json({
      error: 'name or number missing'
    });
  }

  if (persons.some(p => p.name === name)) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    id: generateId(),
    name,
    number
  };
  
  persons.push(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
