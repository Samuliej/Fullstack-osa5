import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Error from './components/Error'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
	  if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    try {
      window.localStorage.clear()
      setUser(null)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input 
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
          />
      </div>
      <div>
        password
          <input 
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogList = () => (
    blogs.map(blog => {
      const blogUser = blog.user
      console.log('blogList:         ')
      console.log(blogUser)
      if (blogUser)
        if (user.name === blogUser.name)
          return (<Blog key={blog.id} blog={blog} />)
    })
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      title:<input 
        value={newBlogTitle}
        onChange={({ target }) => setNewBlogTitle(target.value)}
      /> <br></br>
      author:<input 
        value={newBlogAuthor}
        onChange={({ target }) => setNewBlogAuthor(target.value)}
      /> <br></br>
      url:<input 
        value={newBlogUrl}
        onChange={({ target }) => setNewBlogUrl(target.value)}
      /> <br></br>
      <button type='submit'>create</button>
    </form>
  )

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      user: user
    }

    blogService
      .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNotificationMessage(`a new blog ${newBlogTitle} by ${newBlogAuthor} added`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setNewBlogTitle('')
          setNewBlogAuthor('')
          setNewBlogUrl('')
        })
  }

  return (
    <div>
      {  !user && <div>
          <h1>log in to application</h1>
          <Notification message={notificationMessage} />
          <Error message={errorMessage} />
          {loginForm()}
         </div>
      }
      {  user && <div>
          <h1>blogs</h1>
          <Notification message={notificationMessage} />
          <Error message={errorMessage} />
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button> 
          </p>
          <h2>create new</h2>
          {blogForm()}
          {blogList()}
        </div>
      }
    </div>
  )
}

export default App