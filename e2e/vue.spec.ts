import { test, expect } from '@playwright/test'

const timestamp = Date.now()
const testUser = {
  userName: `user${timestamp}`,
  email: `user${timestamp}@test.com`,
  password: 'Password123!',
}

test('Register', async ({ page }) => {
  await page.goto('/register')
  await expect(page.getByTestId('username-input')).toBeVisible({ timeout: 10000 })
  await page.getByTestId('username-input').fill(testUser.userName)
  await page.getByTestId('email-input').fill(testUser.email)
  await page.getByTestId('password-input').fill(testUser.password)
  await page.getByTestId('confirm-password-input').fill(testUser.password)
  await page.getByTestId('register-button').click()
  await expect(page).toHaveURL('/dashboard', { timeout: 15000 })
})

test('Login', async ({ page }) => {
  // Register first
  await page.goto('/register')
  await page.getByTestId('username-input').fill(testUser.userName)
  await page.getByTestId('email-input').fill(testUser.email)
  await page.getByTestId('password-input').fill(testUser.password)
  await page.getByTestId('confirm-password-input').fill(testUser.password)
  await page.getByTestId('register-button').click()
  await expect(page).toHaveURL('/dashboard', { timeout: 15000 })

  // Logout
  await page.getByTestId('logout-button').click()
  await expect(page).toHaveURL('/login', { timeout: 10000 })

  // Login
  await page.getByTestId('email-input').fill(testUser.email)
  await page.getByTestId('password-input').fill(testUser.password)
  await page.getByTestId('login-button').click()
  await expect(page).toHaveURL('/dashboard', { timeout: 15000 })
})

test('Wrong password shows error', async ({ page }) => {
  await page.goto('/login')
  await page.getByTestId('email-input').fill('wrong@test.com')
  await page.getByTestId('password-input').fill('wrongpassword')
  await page.getByTestId('login-button').click()
  await expect(page.getByTestId('error-message')).toBeVisible({ timeout: 10000 })
})

test('Supplier CRUD', async ({ page }) => {
  // Register and login first
  await page.goto('/register')
  await page.getByTestId('username-input').fill(`sup${timestamp}`)
  await page.getByTestId('email-input').fill(`sup${timestamp}@test.com`)
  await page.getByTestId('password-input').fill(testUser.password)
  await page.getByTestId('confirm-password-input').fill(testUser.password)
  await page.getByTestId('register-button').click()
  await expect(page).toHaveURL('/dashboard', { timeout: 15000 })

  // Go to suppliers
  await page.goto('/suppliers')
  await expect(page.getByTestId('create-button')).toBeVisible({ timeout: 10000 })

  // Create supplier
  await page.getByTestId('create-button').click()
  await expect(page).toHaveURL('/suppliers/create', { timeout: 10000 })
  await page.getByTestId('name-input').fill('Apple Inc')
  await page.getByTestId('email-input').fill('apple@supply.com')
  await page.getByTestId('phone-input').fill('012345678')
  await page.getByTestId('submit-button').click()
  await expect(page).toHaveURL('/suppliers', { timeout: 15000 })
  await expect(page.getByTestId('supplier-table')).toBeVisible()

  // Edit supplier
  await page.getByTestId('edit-button').first().click()
  await page.getByTestId('phone-input').fill('098765432')
  await page.getByTestId('submit-button').click()
  await expect(page).toHaveURL('/suppliers', { timeout: 15000 })

  // Delete supplier
  page.on('dialog', (dialog) => dialog.accept())
  await page.getByTestId('delete-button').first().click()
})

test('Inventory CRUD', async ({ page }) => {
  // Register and login first
  await page.goto('/register')
  await page.getByTestId('username-input').fill(`inv${timestamp}`)
  await page.getByTestId('email-input').fill(`inv${timestamp}@test.com`)
  await page.getByTestId('password-input').fill(testUser.password)
  await page.getByTestId('confirm-password-input').fill(testUser.password)
  await page.getByTestId('register-button').click()
  await expect(page).toHaveURL('/dashboard', { timeout: 15000 })

  // Go to inventory
  await page.goto('/inventory')
  await expect(page.getByTestId('create-button')).toBeVisible({ timeout: 10000 })

  // Create inventory
  await page.getByTestId('create-button').click()
  await expect(page).toHaveURL('/inventory/create', { timeout: 10000 })
  await page.getByTestId('name-input').fill('MacBook')
  await page.getByTestId('description-input').fill('Apple laptop')
  await page.getByTestId('quantity-input').fill('50')
  await page.getByTestId('price-input').fill('999.99')
  await page.getByTestId('supplier-input').fill('supplier-1')
  await page.getByTestId('stock-input').fill('50')
  await page.getByTestId('min-stock-input').fill('10')
  await page.getByTestId('submit-button').click()
  await expect(page).toHaveURL('/inventory', { timeout: 15000 })
  await expect(page.getByTestId('inventory-table')).toBeVisible()

  // Edit inventory
  await page.getByTestId('edit-button').first().click()
  await page.getByTestId('quantity-input').fill('40')
  await page.getByTestId('submit-button').click()
  await expect(page).toHaveURL('/inventory', { timeout: 15000 })

  // Adjust stock
  await page.getByTestId('adjust-button').first().click()
  await expect(page.getByTestId('adjust-modal')).toBeVisible()
  await page.getByTestId('adjust-input').fill('-45')
  await page.getByTestId('confirm-adjust').click()

  // Low stock alert should appear
  await expect(page.getByTestId('low-stock-alert')).toBeVisible({ timeout: 10000 })

  // Delete inventory
  page.on('dialog', (dialog) => dialog.accept())
  await page.getByTestId('delete-button').first().click()
})
