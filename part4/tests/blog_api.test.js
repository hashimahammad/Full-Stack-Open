const { test, after,describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../utils/test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes('Go To Statement Considered Harmful'))
  })

  test('default likes value is 0 if likes property is missing', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Author',
      url: 'http://example.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with 400 if url or title is missing', async () => {
    const noTitle = { author: 'Author', url: 'http://example.com' }
    const noUrl = { title: 'Blog without url', author: 'Author' }

    await api.post('/api/blogs').send(noTitle).expect(400)
    await api.post('/api/blogs').send(noUrl).expect(400)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('deleting one blog reduces count by one', async () => {
    const blogsAtStart = await api.get('/api/blogs').expect(200)
    const blogToDelete = blogsAtStart.body[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await api.get('/api/blogs').expect(200)
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
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
