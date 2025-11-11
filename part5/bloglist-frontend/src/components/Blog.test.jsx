import { render, screen } from '@testing-library/react'
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
})
