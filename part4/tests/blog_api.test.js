const { test, after, beforeEach } = require('node:test')
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

test('all blogs are being returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length )

})

test('response blog objects have id field instead of _id', async () => {
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

test('post method adds one post and checks if the total count increased by one', async () => {
  const WithOneBlog =
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(WithOneBlog)
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

  const savedBlog = response.body
  assert.strictEqual(savedBlog.likes, 0)
})

test('expects bad request if url or title is missing in blog object', async () => {
  const newBlogWithoutTitle = {
    author: 'Author',
    url: 'http://example.com'
  }

  const newBlogWithoutUrl = {
    title: 'Blog without likes',
    author: 'Author'
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400)
})

test('deleting one blog reduces count by one', async () => {

  const blogsAtStart = await api.get('/api/blogs').expect(200)
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs').expect(200)

  assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)
})

test('testing the updation of likes', async () => {
  let newLikes = 9
  const allBlogs = await helper.blogsInDb()
  const toUpdateBlog = allBlogs[0]

  const update = { likes: newLikes }

  const response = await api
    .put(`/api/blogs/${toUpdateBlog.id}`)
    .send(update)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, newLikes)
})

after(async () => {
  await mongoose.connection.close()
})