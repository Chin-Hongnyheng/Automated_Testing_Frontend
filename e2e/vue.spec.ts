import { test, expect } from '@playwright/test'

test('Warehouse Full Flow: Register to Login', async ({ page }) => {
  // 1. REGISTER (Start here)
  await page.goto('/register')
  await page.getByTestId('username-input').fill('ChinhongNyheng')
  await page.getByTestId('email-input').fill('test-user@warehouse.com')
  await page.getByTestId('password-input').fill('Password123!')
  await page.getByTestId('confirm-password-input').fill('Password123!')

  await page.screenshot({ path: 'e2e/screenshots/1-register-page.png' })
  await page.getByTestId('register-button').click()

  // 2. DASHBOARD
  await expect(page).toHaveURL('/dashboard')
  await page.screenshot({ path: 'e2e/screenshots/2-dashboard.png' })

  // 3. INVENTORY
  await page.getByTestId('inventory-card').click() // Or page.goto('/inventory')
  await expect(page.getByTestId('inventory-table')).toBeVisible()
  await page.screenshot({ path: 'e2e/screenshots/3-inventory.png' })

  // 4. SUPPLIERS
  await page.goto('/suppliers')
  await expect(page.getByTestId('supplier-table')).toBeVisible()
  await page.screenshot({ path: 'e2e/screenshots/4-suppliers.png' })

  // 5. LOGOUT (To prepare for the Login test)
  // Assuming your logout button is in the nav as per your code
  await page.getByText('Logout').click()
  await expect(page).toHaveURL('/login')

  // 6. LOGIN (Last step)
  await page.getByTestId('email-input').fill('test-user@warehouse.com')
  await page.getByTestId('password-input').fill('Password123!')
  await page.getByTestId('login-button').click()

  // Final check to ensure login brought us back
  await expect(page).toHaveURL('/dashboard')
  await page.screenshot({ path: 'e2e/screenshots/5-final-login-success.png' })
})
