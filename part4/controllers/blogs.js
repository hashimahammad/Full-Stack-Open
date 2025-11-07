const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getToken = request=>{
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.status(200).json(blogs)
})

blogRouter.post('/', async (request, response) => {

  const decodedToken = jwt.verify(getToken(request),process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({ error: 'invalid token' })
  }

  const user

  const body = request.body

  // const user = await User.findOne()
  if (!user) {
    return response.status(400).json({ error: 'No users exist yet' })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
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
