const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

function validateId(request, response, next) {
  const { id } = request.params;
  console.log(`validateId [${request.method}]`);
  if (!isUuid(id))
    return response.status(400).json({ error: "Invalid repository ID" });

  return next();
}

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // TODO
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const index = repositories.findIndex(repository => repository.id == id);

  if (index < 0)
    return response.status(400).json({ error: "Repository not found" });

  const repository = {
    id,
    url,
    title,
    techs,
    likes: 0
  };

  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id == id);

  if (index < 0)
    return response.status(400).json({ error: "Repository not found" });

  repositories.splice(index, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id == id);

  if (index < 0)
    return response.status(400).json({ error: "Repository not found" });

  const repository = repositories.find(repo => repo.id == id);

  if (!repository)
    return response.status(400).json({ error: "Repository not found" });

  repository.likes++;

  repositories[index] = repository;

  return response.status(200).json(repository);
});

module.exports = app;
