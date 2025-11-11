import { useState } from 'react'

const Blog = ({ blog, currentUser, likeBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

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
    likeBlog(blog.id, blog.likes + 1)
  }

  const handleDeleteBlog = () => {
    if (window.confirm('Do you want to delete this blog?')) {
      deleteBlog(blog.id)
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
          likes {blog.likes}
          <button onClick={handleLikeBlog}>like</button>
        </p>

        {blog.user && <p>{blog.user.username}</p>}

        {blog.user && currentUser === blog.user.username && <button onClick={handleDeleteBlog}>remove</button>}
      </div>
    </div>
  )
}

export default Blog