const { test, after,describe, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('invalid user creation', () => {

  test('fails if username is missing', async () => {
    const newUser = {
      name: 'No Username',
      password: 'valid123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

  })

  test('fails if username is too short', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short',
      password: 'valid123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('fails if password is missing', async () => {
    const newUser = {
      username: 'validuser',
      name: 'No Password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

  })

  test('fails if username is already taken', async () => {
    const newUser = {
      username: 'root',
      name: 'Duplicate Test',
      password: 'valid123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

})

after(async () => {
  await mongoose.connection.close()
})
