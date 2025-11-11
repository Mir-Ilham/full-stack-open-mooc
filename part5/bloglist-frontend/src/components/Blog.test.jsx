import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  test('blog title and author visible by default', () => {
    const blog = {
      title: 'The dawn of AI',
      author: 'MHM Ilham',
      url: 'www.mhmilham.com',
      likes: 0,
      user: {
        username: 'ilham'
      }
    }

    render(<Blog blog={blog} currentUser={blog.user.username}/>)

    let elements = screen.getAllByText('The dawn of AI', { exact: false })
    expect(elements[0]).toBeVisible()

    elements = screen.getAllByText('MHM Ilham', { exact : false })
    expect(elements[0]).toBeVisible()
  })

  test('blog url or number of likes not visible by default', () => {
    const blog = {
      title: 'The dawn of AI',
      author: 'MHM Ilham',
      url: 'www.mhmilham.com',
      likes: 0,
      user: {
        username: 'ilham'
      }
    }

    render(<Blog blog={blog} currentUser={blog.user.username}/>)

    let element = screen.getByText('likes', { exact: false })
    expect(element).not.toBeVisible()

    element = screen.getByText('www.mhmilham.com')
    expect(element).not.toBeVisible()
  })

  test('blog url or number of likes visible when view button clicked', async () => {
    const blog = {
      title: 'The dawn of AI',
      author: 'MHM Ilham',
      url: 'www.mhmilham.com',
      likes: 0,
      user: {
        username: 'ilham'
      }
    }

    render(<Blog blog={blog} currentUser={blog.user.username}/>)

    const viewButton = screen.getByText('view')
    const user = userEvent.setup()
    await user.click(viewButton)

    let element = screen.getByText('likes', { exact: false })
    expect(element).toBeVisible()

    element = screen.getByText('www.mhmilham.com')
    expect(element).toBeVisible()
  })

  test('clicking like button twice calls likeBlog function twice', async () => {
    const blog = {
      title: 'The dawn of AI',
      author: 'MHM Ilham',
      url: 'www.mhmilham.com',
      likes: 0,
      user: {
        username: 'ilham'
      }
    }

    const likeBlog = vi.fn()

    render(<Blog blog={blog} currentUser={blog.user.username} likeBlog={likeBlog} />)

    const likeButton = screen.getByText('like')
    const user = userEvent.setup()
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})
