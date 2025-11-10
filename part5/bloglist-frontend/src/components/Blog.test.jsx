import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'The dawn of AI',
    author: 'MHM Ilham',
    url: 'www.mhmilham.com',
    likes: 0,
    user: {
      username: 'ilham'
    }
  }

  const mockLikeBlog = vi.fn()
  const mockDeleteBlog = vi.fn()

  render(<Blog blog={blog} currentUser={blog.user.username} likeBlog={mockLikeBlog} deleteBlog={mockDeleteBlog}/>)

  const element = screen.getByText('The dawn of AI')
  expect(element).toBeDefined()
})