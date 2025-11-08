import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

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

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      {user ?
        <>
          <h2>Blogs</h2>
          <div>{user.username} is logged in <button onClick={() => handleLogout()}>Logout</button></div>
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