const { test, describe } = require('node:test')
const assert = require('node:assert')

const totalLikes = require('../utils/list_helper').totalLikes
const blogs_data = require('./blogs_data')

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    assert.strictEqual(totalLikes([blogs_data[0]]), blogs_data[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(totalLikes(blogs_data), 36)
  })
})