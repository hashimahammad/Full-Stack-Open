const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req,res) => {
  const users = await User.find({}).populate('blogs',{ title: 1, author:1, url:1, likes: 1 })
  res.status(200).json(users)
})

usersRouter.post('/', async (req, res) => {
  const { name, password, username } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username or password missing' })
  }

  if (username.length <= 2 || password.length <= 2) {
    return res.status(400).json({ error: 'Username or password is too small' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    passwordHash,
    name,
    blogs: []
  })

  const savedUser = await newUser.save()
  return res.status(201).json(savedUser)
})


module.exports = usersRouter