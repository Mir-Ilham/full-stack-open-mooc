const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        username: 'Ilham',
        name: 'MHM Ilham',
        password: 'pforpassword'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Login')
    await expect(locator).toHaveCount(2)
  })


  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('Ilham')
      await page.getByLabel('password').fill('pforpassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Ilham is logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('Ilham')
      await page.getByLabel('password').fill('dforpassword')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Ilham is logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('Ilham')
      await page.getByLabel('password').fill('pforpassword')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByLabel('title:').fill('Getting to code in VSCode')
      await page.getByLabel('author:').fill('MHM Ilham')
      await page.getByLabel('url:').fill('www.mhmilham.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Getting to code in VSCode').first()).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByLabel('title:').fill('Getting to code in VSCode')
      await page.getByLabel('author:').fill('MHM Ilham')
      await page.getByLabel('url:').fill('www.mhmilham.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()

      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('a blog created can be deleted by the user', async ({ page }) => {
      // User creates a blog
      await page.getByRole('button', { name: 'Create new blog' }).click()
      await page.getByLabel('title:').fill('Getting to code in VSCode')
      await page.getByLabel('author:').fill('MHM Ilham')
      await page.getByLabel('url:').fill('www.mhmilham.com')
      await page.getByRole('button', { name: 'create' }).click()

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
  })
})