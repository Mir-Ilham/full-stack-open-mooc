const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {}

  const reducer = (mostLiked, blog) => {
    return blog.likes > mostLiked.likes ? blog : mostLiked
  }

  return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const counts = lodash.countBy(blogs, 'author')

  const [author, count] = lodash.toPairs(counts).reduce((max, cur) => {
    return cur[1] > max[1] ? cur : max
  })

  return { author: author, blogs: count }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}