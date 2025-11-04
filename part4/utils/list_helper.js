const _ = require('lodash')

const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc,blog) => {
    return acc+blog.likes
  },0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) return null

  return blogs.reduce((max, blog) =>
    blog.likes > max.likes ? blog : max
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  let grpedByAuthor = _.groupBy(blogs,'author')
  let counts = _.map(grpedByAuthor, (val,key) => { // val is the right object{autho;....} key is just the key
    return ({
      'author':key,
      'blogs': val.length
    })
  })

  return _.maxBy(counts,'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  let grpedByAuthor = _.groupBy(blogs,'author')
  let counts = _.map(grpedByAuthor, (val,key) => { // val is the right object{autho;....} key is just the key

    let likeSum = val.reduce((acc,val) => {
      return acc+val.likes
    },0)
    return ({
      'author':key,
      'likes': likeSum
    })
  })

  return _.maxBy(counts,'likes')
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}