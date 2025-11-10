import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // States relating to login
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setMessage('Login successful')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)

    setMessage('Logout successful')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const createBlog = async (title, author, url) => {
    if (!author || !title || !url) {
      setErrorMessage('Complete all blog entries')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    try {
      blogFormRef.current.toggleVisibility()

      const blog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(blog))

      setMessage(`New blog: ${blog.title} added.`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(`Error: ${exception.message}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const sortBlog = (id) => {
    const updatedBlogs = blogs.map(blog =>
      blog.id === id
        ? { ...blog, likes: blog.likes + 1 }
        : blog
    )
    updatedBlogs.sort((a, b) => b.likes - a.likes)
    setBlogs(updatedBlogs)
  }

  const deleteBlog = async (id) => {
    try {
      const deletedBlog = await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== deletedBlog.id))

      setMessage(`${deletedBlog.title} deleted.`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(`Error: ${exception.message}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      {message && <div className='success'>{message}</div>}
      {errorMessage && <div className='error'>{errorMessage}</div>}
      {user ?
        <>
          <h2>Blogs</h2>

          <div>{user.username} is logged in <button onClick={() => handleLogout()}>Logout</button></div>

          <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
            <CreateBlogForm createBlog={createBlog} />
          </Togglable>

          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} currentUser={user.username} sortBlog={sortBlog} deleteBlog={deleteBlog} />
          )}
        </>
        :
        <LoginForm handleLogin={handleLogin}
                  username={username}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword} />
      }

    </div>
  )
}

export default App