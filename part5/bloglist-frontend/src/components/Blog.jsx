import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLikeBlog = async () => {
    try {
      await blogService.likeBlog(blog.id, likes + 1)
      setLikes(likes + 1)
    } catch {
      alert('An error occured')
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <p>
          {blog.title} {blog.author}
          <button onClick={toggleVisibility}>view</button>
        </p>
      </div>
      <div style={showWhenVisible}>
        <p>
          {blog.title} - {blog.author}
          <button onClick={toggleVisibility}>hide</button>
        </p>

        <p>{blog.url}</p>

        <p>
          likes {likes}
          <button onClick={handleLikeBlog}>like</button>
        </p>

        <p>{blog.user.username}</p>
      </div>
    </div>
  )
}

export default Blog