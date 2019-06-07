const express = require('express');
const knex = require('knex');

const knexConfig = require('./knexfile');

const server = express();
const db = knex(knexConfig.development);

server.use(express.json());

const PORT = 3000;

server.post('/api/projects', (req, res)=>{
    const project = req.body;
    console.log(project)
    db('projects').insert(project)
    .then(response =>{
        res.status(201).json(response);
    })
    .catch(error=>{
        console.log(error)
        res.status(500).json({
            err: 'Failed to post new Project'
        });
    })
});

server.post('/api/projects-action', (req,res)=>{
    const action = req.body;
    db('actions').insert(action)
    .then(response =>{
        res.status(201).json(response);
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({err: 'Failed to post Action'});
    })
});


server.get('/api/projects', (req, res) => {
    db('projects').select()
        .then(response => {
            res
                .status(200)
                .json(response);
        })
        .catch(error => {
            console.log(error);
            res
                .status(500)
                .json({err: 'Failed to find Projects.'});
        })
});

server.get('/api/projects/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const project = await db('projects').where('id', id).first();
    const actions = await db('actions').where('project_id', id);
    const fullProject = {
      id: project.id,
      name: project.project_name,
      description: project.project_description,
      completed: project.project_completed === 0 ? false : true,
      actions: actions.map(el => {
        return {
          id: el.id,
          description: el.action_description,
          notes: el.action_notes,
          complete: el.action_completed === 0 ? false : true
        }
      })
    }
    res.status(200).json(fullProject);
  } catch (e) {
    res.status(500).json({error: "Something went wrong with the server."});
  }
})

server.get('/api/projects-action', (req, res) => {
    db('actions').select()
        .then(response => {
            res
                .status(200)
                .json(response);
        })
        .catch(error => {
            console.log(error);
            res
                .status(500)
                .json({err: 'Failed to find Project-Actions.'});
        })
});

server.listen(PORT, ()=>{ console.log(`Listening to PORT ${PORT}`)})
