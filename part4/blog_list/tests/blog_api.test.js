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

after(async () => {
  await mongoose.connection.close()
})