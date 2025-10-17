const express = require('express');
const routes = express.Router();

const Professor = require('./controllers/professor');
const Turma = require('./controllers/turma');
const Atividade = require('./controllers/atividade');

routes.get('/', (req, res) => {
  return res.json({ titulo: 'Escola' });
});


routes.post('/professores', Professor.create);
routes.get('/professores', Professor.read);
routes.get('/professores/:id', Professor.readOne);
routes.put('/professores/:id', Professor.update);
routes.delete('/professores/:id', Professor.remove);
routes.post("/professores/login", Professor.login);

routes.post('/turmas', Turma.create);
routes.get('/turmas/:id', Turma.read);
routes.get('/turmas/:id', Turma.readOne);
routes.put('/turmas/:id', Turma.update);
routes.delete('/turmas/:id', Turma.remove);

routes.post('/atividades', Atividade.create);
routes.get('/atividades', Atividade.read);
routes.get('/atividades/:id', Atividade.readOne);
routes.put('/atividades/:id', Atividade.update);
routes.delete('/atividades/:id', Atividade.remove);

module.exports = routes;