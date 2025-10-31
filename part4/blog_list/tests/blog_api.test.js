const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
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

  assert.ok(blog.id, 'Blog object should have an id property')
  assert.strictEqual(blog._id, undefined, 'Blog object should not have an _id property')
})

after(async () => {
  await mongoose.connection.close()
})