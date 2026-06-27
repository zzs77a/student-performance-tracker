import { expect, test } from '@playwright/test'

test('shows the performance dashboard summary', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Student Performance Tracker' })).toBeVisible()
  await expect(page.getByTestId('weighted-average')).toContainText('80.83')
  await expect(page.getByTestId('gpa-value')).toContainText('6.75')
  await expect(page.getByText('QA Automation', { exact: true })).toBeVisible()
})

test('adds a new course and updates the record table', async ({ page }) => {
  await page.goto('/')

  await page.getByPlaceholder('158337').fill('159399')
  await page.getByPlaceholder('Database Development').fill('Software Testing Practice')
  await page.getByTestId('score-input').fill('89')
  await page.getByRole('button', { name: 'Add course' }).click()

  await expect(page.getByRole('cell', { name: '159399' })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Software Testing Practice', exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: '89' })).toBeVisible()
  await expect(page.getByText('6/13')).toBeVisible()
})

test('maps score input to grade automatically', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('score-input').fill('92')
  await expect(page.getByLabel('Grade')).toHaveValue('A+')
})

test('deletes a course from the table', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Delete Applied Programming' }).click()

  await expect(page.getByRole('cell', { name: 'Applied Programming' })).toHaveCount(0)
})
