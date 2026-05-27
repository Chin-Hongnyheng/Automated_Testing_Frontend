import { test, expect } from '@playwright/test'

test('Warehouse Full Flow: Register to Login', async ({ page }) => {
  // 1. REGISTER
  await page.goto('/register')
  await page.getByTestId('username-input').fill('Nyheng1')
  await page.getByTestId('email-input').fill('heng2@warehouse.com')
  await page.getByTestId('password-input').fill('Password123!')
  await page.getByTestId('confirm-password-input').fill('Password123!')
  await page.screenshot({ path: 'e2e/screenshots/1-register-page.png' })
  await page.getByTestId('register-button').click()

  // 2. DASHBOARD
  await expect(page).toHaveURL('/dashboard')
  await page.screenshot({ path: 'e2e/screenshots/2-dashboard.png' })

  // 3. INVENTORY
  await page.getByTestId('inventory-card').click()
  await expect(page.getByTestId('inventory-table')).toBeVisible()
  await page.screenshot({ path: 'e2e/screenshots/3-inventory.png' })

  // 4. SUPPLIERS
  await page.goto('/suppliers')
  await expect(page.getByTestId('supplier-table')).toBeVisible()
  await page.screenshot({ path: 'e2e/screenshots/4-suppliers.png' })

  // 5. LOGOUT
  await page.getByText('Logout').click()
  await expect(page).toHaveURL('/login')

  // 6. LOGIN
  await page.getByTestId('email-input').fill('heng2@warehouse.com')
  await page.getByTestId('password-input').fill('Password123!')
  await page.getByTestId('login-button').click()
  await expect(page).toHaveURL('/dashboard')
  await page.screenshot({ path: 'e2e/screenshots/5-final-login-success.png' })
})
