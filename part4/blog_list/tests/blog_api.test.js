const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { blogsInDb } = require('./test_helper')
const blogsData = require('./blogs_data')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogsData)
})

test('All blogs returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, blogsData.length)
})

test('Unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  const blogs = response.body
  const blog = blogs[0]

  assert.ok(blog.id)
  assert.strictEqual(blog._id, undefined)
})

test('A valid blog can be added ', async () => {
  const newBlog =   {
    title: 'React router',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 6,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await blogsInDb()

  const titles = blogs.map(r => r.title)

  assert.strictEqual(blogs.length, blogsData.length + 1)
  assert(titles.includes(newBlog.title))
})

test('A blog added without likes count defaults to zero', async () => {
  const newBlog =   {
    title: 'Redux learning',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await blogsInDb()

  const savedBlog = blogs.find(blog => blog.title === newBlog.title)

  assert.strictEqual(blogs.length, blogsData.length + 1)
  assert.strictEqual(savedBlog.likes, 0)
})

test('Attempting to add a blog without title or url is a bad request', async () => {
  const newBlogNoTitle =   {
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/'
  }

  const newBlogNoURL =   {
    title: 'Redux learning',
    author: 'Michael Chan'
  }

  await api
    .post('/api/blogs')
    .send(newBlogNoTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlogNoURL)
    .expect(400)

  const blogs = await blogsInDb()
  assert.strictEqual(blogs.length, blogsData.length)
})

test('Deleting a specific blog works', async () => {
  const blogToDelete = blogsData[0]

  await api
    .delete(`/api/blogs/${blogToDelete._id}`)
    .expect(200)

  const blogs = await blogsInDb()
  const match = blogs.find(blog => blog.id === blogToDelete._id)

  assert.strictEqual(match, undefined)
  assert.strictEqual(blogs.length, blogsData.length - 1)
})

after(async () => {
  await mongoose.connection.close()
})