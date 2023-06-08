import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const onLikeClick = () => {
    handleLike(blog)
  }

  const onClickRemove = () => {
    if (window.confirm(`Remove blog: ${blog.title}?`))
      handleRemove(blog)
  }

 return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}  <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          {blog.url} <br/>
          {blog.likes} <button onClick={onLikeClick}>like</button> <br/>
          {blog.user.name} <br/>
          <button onClick={onClickRemove}>remove</button>
        </div>
      )}
    </div>
 )
}

export default Blog