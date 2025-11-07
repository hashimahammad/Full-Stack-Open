const { test, after,describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/test_helper')

const api = supertest(app)

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'secret123'
  }


  const savedUser = await api.post('/api/users').send(newUser)
  const userId = savedUser.body.id

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'secret123' })

  token = loginResponse.body.token

  const blogsWithUser = helper.initialBlogs.map(blog => ({
    ...blog,
    user: userId
  }))

  await Blog.insertMany(blogsWithUser)
})

describe('GET /api/blogs', () => {
  test('all blogs are being returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog objects have id field instead of _id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body
    blogs.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
})

describe('POST /api/blogs', () => {
  test('adds one post and increases total count by one', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  })

  test('default likes value is 0 if likes property is missing', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Author',
      url: 'http://example.com'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with 400 if url or title is missing', async () => {
    const noTitle = { author: 'Author', url: 'http://example.com' }
    const noUrl = { title: 'Blog without url', author: 'Author' }

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(noTitle).expect(400)
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(noUrl).expect(400)
  })

  test('fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Hacker',
      url: 'http://badguy.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('DELETE /api/blogs/:id', () => {

  test('deleting one blog reduces count by one', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('a blog cannot be deleted by someone who did not add it', async () => {

    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    const anotherUser = {
      username: 'anotherUser',
      name: 'Another User',
      password: 'password123'
    }

    await api.post('/api/users').send(anotherUser)

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'anotherUser', password: 'password123' })

    const token2 = loginResponse.body.token

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token2}`)
      .expect(401)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('updates likes successfully', async () => {
    const newLikes = 9
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const update = { likes: newLikes }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(update)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, newLikes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
