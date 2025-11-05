const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.status(200).json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const result = await blog.save()
  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { author, title, url, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { author, title, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  response.status(200).json(updatedBlog)
})

module.exports = blogRouter
