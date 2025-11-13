const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'Ilham',
        name: 'MHM Ilham',
        password: 'pforpassword'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Login')
    await expect(locator).toHaveCount(2)
  })


  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      loginWith(page, 'Ilham', 'pforpassword')
      await expect(page.getByText('Ilham is logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      loginWith(page, 'Ilham', 'dforpassword')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Ilham is logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      loginWith(page, 'Ilham', 'pforpassword')
    })

    test('a new blog can be created', async ({ page }) => {
      createBlog(page, 'Getting to code in VSCode', 'MHM Ilham', 'www.mhmilham.com')
      await expect(page.getByText('Getting to code in VSCode').first()).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      createBlog(page, 'Getting to code in VSCode', 'MHM Ilham', 'www.mhmilham.com')

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
  
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog created can be deleted by the user', async ({ page }) => {
      // User creates a blog
      createBlog(page, 'Getting to code in VSCode', 'MHM Ilham', 'www.mhmilham.com')

      // User can view remove button and removes the blog
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      page.once('dialog', async (dialog) => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()

      // Blog is deleted
      await expect(page.getByText('Getting to code in VSCode')).toHaveCount(0)
    })

    test('a blog\'s delete button can only be seen by the blog creator', async ({ request, page }) => {
      // User creates a blog
      createBlog(page, 'Getting to code in VSCode', 'MHM Ilham', 'www.mhmilham.com')

      // User can view remove button
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      // User logout
      await page.getByRole('button', { name: 'Logout' }).click()

      // New User log in
      await request.post('/api/users', {
        data: {
          username: 'newuser',
          name: 'New User',
          password: 'pforpassword'
        }
      })

      loginWith(page, 'newuser', 'pforpassword')

      // New user can't view remove button
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})