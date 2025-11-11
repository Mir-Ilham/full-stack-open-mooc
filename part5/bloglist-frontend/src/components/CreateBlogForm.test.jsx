import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test ('<CreateBlogForm /> calls event handler with right details onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<CreateBlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')

  const submitButton = screen.getByText('create')

  await user.type(titleInput, 'The Dawn of AI')
  await user.type(authorInput, 'MHM Ilham')
  await user.type(urlInput, 'www.mhmilham.com')

  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toBe('The Dawn of AI')
  expect(createBlog.mock.calls[0][1]).toBe('MHM Ilham')
  expect(createBlog.mock.calls[0][2]).toBe('www.mhmilham.com')
})