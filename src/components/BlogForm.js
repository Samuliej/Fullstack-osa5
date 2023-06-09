import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [newBlogUser, setNewBlogUser] = useState(null)

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      user: newBlogUser
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
    setNewBlogUser(null)
  }

  return (
    <div>
      <h2>Add a new blog</h2>
      <form onSubmit={addBlog}>
        title:
        <input placeholder='insert title here' value={newBlogTitle} onChange={event => setNewBlogTitle(event.target.value)} /> <br></br>

        author:
        <input placeholder='insert author here' value={newBlogAuthor} onChange={event => setNewBlogAuthor(event.target.value)} /> <br></br>

        url:
        <input placeholder='insert url here' value={newBlogUrl} onChange={event => setNewBlogUrl(event.target.value)} /> <br></br>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm