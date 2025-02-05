const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findByUser(req.userId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create(title, description, req.userId);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const task = await Task.update(id, title, description, completed);
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.delete(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

router.get('/search', async (req, res) => {
  try {
    const query = req.query.name; 
    if (!query) {
      return res.status(400).json({ error: 'Le paramètre de recherche est manquant.' });
    }

    const tasks = await Task.find({ title: { $regex: query, $options: 'i' } }); 
    res.json(tasks); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la recherche des tâches.' });
  }
});
