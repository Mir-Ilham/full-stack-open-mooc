const { test, describe } = require('node:test')
const assert = require('node:assert')

const { totalLikes, favoriteBlog, mostBlogs, mostLikes } = require('../utils/list_helper')
const blogs_data = require('./blogs_data')

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    assert.strictEqual(totalLikes(blogs_data.slice(0, 1)), blogs_data[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(totalLikes(blogs_data), 36)
  })
})

describe('favorite blog', () => {
  test('of empty list is empty object', () => {
    assert.deepStrictEqual(favoriteBlog([]), {})
  })

  test('when list has only one blog equals that', () => {
    assert.deepStrictEqual(favoriteBlog([blogs_data[0]]), blogs_data[0])
  })

  test('of a bigger list returns the first blog with most likes', () => {
    assert.deepStrictEqual(favoriteBlog(blogs_data), blogs_data[2])
  })
})

describe('most blogs', () => {
  test('of empty list is empty object', () => {
    assert.deepStrictEqual(mostBlogs([]), {})
  })

  test('when list has only one blog equals author of that blog and count of 1', () => {
    assert.deepStrictEqual(mostBlogs(blogs_data.slice(0, 1)), { author: blogs_data[0].author, blogs: 1 })
  })

  test('of a bigger list returns the name of the first author with the most blogs', () => {
    assert.deepStrictEqual(mostBlogs(blogs_data), { author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('most likes', () => {
  test('of empty list is empty object', () => {
    assert.deepStrictEqual(mostLikes([]), {})
  })

  test('when list has only one blog equals author of that blog and count of likes', () => {
    assert.deepStrictEqual(mostLikes(blogs_data.slice(0, 1)), { author: blogs_data[0].author, likes: blogs_data[0].likes })
  })

  test('of a bigger list returns the name of the first author with the most blogs', () => {
    assert.deepStrictEqual(mostLikes(blogs_data), { author: 'Edsger W. Dijkstra', likes: 17 })
  })
})