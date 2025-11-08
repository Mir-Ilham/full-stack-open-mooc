import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  // States relating to login
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  // States relating to blog creation
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('') 

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

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
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser")
    setUser(null)
  }

  const handleCreateBlog = async event => {
    event.preventDefault()

    if (!author || !title || !url) {
      setErrorMessage('Complete all blog entries')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }

    try {
      const blog = await blogService.create({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogs(blogs.concat(blog))
    } catch (exception) {
      setErrorMessage(`Error: ${exception.message}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      {user ?
        <>
          <h2>Blogs</h2>

          <div>{user.username} is logged in <button onClick={() => handleLogout()}>Logout</button></div>

          <CreateBlogForm handleCreateBlog={handleCreateBlog} 
                    title={title} 
                    setTitle={setTitle} 
                    author={author} 
                    setAuthor={setAuthor}
                    url={url}
                    setUrl={setUrl}/>

          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </>
        :
        <LoginForm handleLogin={handleLogin} 
                  username={username} 
                  setUsername={setUsername} 
                  password={password} 
                  setPassword={setPassword}/>
      }

    </div>
  )
}

export default App