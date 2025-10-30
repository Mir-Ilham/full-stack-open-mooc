const { test, describe } = require('node:test')
const assert = require('node:assert')

const { totalLikes, favoriteBlog } = require('../utils/list_helper')
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