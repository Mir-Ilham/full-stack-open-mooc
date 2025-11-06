const { test, before, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')
const { blogsInDb } = require('./test_helper')
const blogsData = require('./blogs_data')

const api = supertest(app)

let token
let testUser

before(async () => {
  await User.deleteMany({})

  const newUser = {
    username: 'test',
    name: 'testuser',
    password: 'pforpassword'
  }

  const userResponse = await api
    .post('/api/users')
    .send(newUser)

  testUser = userResponse.body

  const tokenResponse = await api
    .post('/api/login')
    .send({ username: newUser.username, password: newUser.password })

  token = tokenResponse.body.token
})

describe('When there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(blogsData)
  })

  describe('for read operations', () => {
    test('all blogs returned', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, blogsData.length)
    })

    test('unique identifier property of blog posts is named id', async () => {
      const response = await api.get('/api/blogs')

      const blogs = response.body
      const blog = blogs[0]

      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('for create operations', () => {
    test('a valid blog can be added', async () => {
      const newBlog =   {
        title: 'React router',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 6,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: 'Bearer ' + token })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = await blogsInDb()

      const titles = blogs.map(r => r.title)

      assert.strictEqual(blogs.length, blogsData.length + 1)
      assert(titles.includes(newBlog.title))
    })

    test('a blog added without likes count defaults to zero', async () => {
      const newBlog =   {
        title: 'Redux learning',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: 'Bearer ' + token })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = await blogsInDb()

      const savedBlog = blogs.find(blog => blog.title === newBlog.title)

      assert.strictEqual(blogs.length, blogsData.length + 1)
      assert.strictEqual(savedBlog.likes, 0)
    })

    test('attempting to add a blog without title or url is a bad request', async () => {
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
        .set({ Authorization: 'Bearer ' + token })
        .expect(400)

      await api
        .post('/api/blogs')
        .send(newBlogNoURL)
        .set({ Authorization: 'Bearer ' + token })
        .expect(400)

      const blogs = await blogsInDb()
      assert.strictEqual(blogs.length, blogsData.length)
    })

    test('unauthorized blog creation fails', async () => {
      const newBlog =   {
        title: 'React router',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 6,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogs = await blogsInDb()
      assert.strictEqual(blogs.length, blogsData.length)
    })
  })

  describe('for update operations', () => {
    test('updating a specific blog works', async () => {
      const newBlog =   {
        title: 'React router',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 6,
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: 'Bearer ' + token })

      const blogToUpdate = response.body

      blogToUpdate.likes = 101

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: 420 })
        .set({ Authorization: 'Bearer ' + token })
        .expect(200)

      const blogs = await blogsInDb()
      const match = blogs.find(blog => blog.id === blogToUpdate.id)

      assert.strictEqual(match.likes, 420)
    })

    test('attempting to update a non-existent blog fails', async () => {
      const blogToUpdate = blogsData[0]

      await api
        .put(`/api/blogs/${blogToUpdate._id + '1'}`)
        .send({ likes: 420 })
        .set({ Authorization: 'Bearer ' + token })
        .expect(400)
    })

    test('unauthorized update of a specific blog fails', async () => {
      const blogToUpdate = blogsData[0]

      await api
        .put(`/api/blogs/${blogToUpdate._id}`)
        .send({ likes: 420 })
        .set({ Authorization: 'Bearer ' + token })
        .expect(401)

      const blogs = await blogsInDb()
      assert.strictEqual(blogs.length, blogsData.length)
    })
  })

  describe('for delete operations', () => {
    test('deleting a specific blog works', async () => {
      const newBlog =   {
        title: 'React router',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 6,
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: 'Bearer ' + token })

      const blogToDelete = response.body

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: 'Bearer ' + token })
        .expect(200)

      const blogs = await blogsInDb()
      const match = blogs.find(blog => blog.id === blogToDelete.id)

      assert.strictEqual(match, undefined)
      assert.strictEqual(blogs.length, blogsData.length)
    })

    test('attempting to delete non-existent blog fails', async () => {
      const blogToDelete = blogsData[0]

      await api
        .delete(`/api/blogs/${blogToDelete._id + '1'}`)
        .set({ Authorization: 'Bearer ' + token })
        .expect(400)
    })

    test('unauthorized deletion of a specific blog fails', async () => {
      const blogToDelete = blogsData[0]

      await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .set({ Authorization: 'Bearer ' + token })
        .expect(401)

      const blogs = await blogsInDb()
      assert.strictEqual(blogs.length, blogsData.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})