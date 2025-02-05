const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {

    const { username, password } = req.body;
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //const user = await User.create({ username: req.body.username,password: hashedPassword});
    const user = await User.create(username, hashedPassword);

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByUsername(req.body.username);
    if (!user) throw new Error('Utilisateur non trouvé');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) throw new Error('Mot de passe incorrect');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
