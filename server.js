const express = require('express')
const app = express()
const port = 3080
var cors = require('cors');
var bodyParser = require('body-parser')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

app.use(cors());

//Permet de rajouter une date dans le bon format
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Route pour récupéere mes todos
app.get('/api/todos', async (req, res) => {
    const todos = await prisma.todo.findMany()
    res.status(200).json(todos)
})

//Route pour récupérer une todo
app.get('/api/todos/:todoId', async (req, res) => {
    const todos = await prisma.todo.findUnique({
        where: {
          id: parseInt(req.params.todoId),
        },
      })
    res.status(200).json(todos)
})

app.use(bodyParser.json())

//Route pour ajouter une todo
app.post('/api/todos', urlencodedParser, async (req, res) => {
    const today = new Date();

    const todos = await prisma.todo.create({
        data : {
            title: req.body.title,
            description: req.body.description,
            completed: false,
            created_at: formatDate(today),
            dueDate: req.body.dueDate
        }
    });
    res.status(201).json(
      todos
    );
  });

//Route pour modifier une todo
app.put('/api/todos/:todoId', async (req, res) => {
    const todos = await prisma.todo.update({
        where: {
          id: parseInt(req.params.todoId),
        },
        data: {
            title : req.body.title,
            description: req.body.description,
            completed: req.body.completed,
            dueDate: req.body.dueDate
        }   
      })

    res.status(200).json({
      message: 'Objet modifié !',
      todos
    });
  });

//Route pour supprimer une todo
app.delete('/api/todos/:todoId', async (req, res) => {
    const todos = await prisma.todo.delete({
        where: {
          id: parseInt(req.params.todoId),
        },
      })
    res.status(204).json({
      message: 'Objet supprimé !',
      todos
    });
  });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})