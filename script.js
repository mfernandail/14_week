const form = document.querySelector('.expense-form')
const resume = document.querySelector('.resume')
const totalSec = document.querySelector('.total')
const expenseSec = document.querySelector('.expense')
const btnClear = document.querySelector('.btn_clear')
const searchCategory = document.getElementById('categorySearch')
const btnClearFilter = document.querySelector('.btn_clearFilter')
const btnSubmit = document.querySelector('.btn_submit')

const descriptionInput = document.querySelector('#description')
const amountInput = document.querySelector('#amount')
const categoryInput = document.querySelector('#category')

let idEditing = null

let expenseTracker = getLocalStorageFn()

btnSubmit.addEventListener('click', saveExpense)

document.addEventListener('DOMContentLoaded', () => renderHtml(expenseTracker))

expenseSec.addEventListener('click', deleteExpense)

btnClear.addEventListener('click', clearExpense)

searchCategory.addEventListener('change', filterCategory)

btnClearFilter.addEventListener('click', clearFilter)

function deleteExpense(e) {
  e.preventDefault()

  if (e.target.classList.contains('delete_expense')) {
    const deleteConfirm = confirm(
      'Are you sure you want to delete the expense?'
    )

    if (deleteConfirm) {
      const idExpense = Number(e.target.getAttribute('data-id'))

      expenseTracker = expenseTracker.filter(
        (expense) => expense.id !== idExpense
      )

      setLocalStorageFn(expenseTracker)
      renderHtml(expenseTracker)
    }
  } else if (e.target.classList.contains('expenseDesc')) {
    btnSubmit.textContent = 'Edit'
    const idExpense = Number(e.target.getAttribute('data-id'))

    const expenseObj = expenseTracker.find(
      (expense) => expense.id === idExpense
    )

    descriptionInput.value = expenseObj.description
    amountInput.value = expenseObj.amount
    categoryInput.value = expenseObj.category

    idEditing = idExpense
  }
}

function saveExpense(e) {
  e.preventDefault()

  const isEditing = idEditing !== null

  if (!isEditing) {
    const formData = new FormData(form)
    const newExpense = Object.fromEntries(formData.entries())

    newExpense.id = Date.now()

    if (
      !newExpense.description ||
      !newExpense.amount ||
      isNaN(newExpense.amount) ||
      Number(newExpense.amount) <= 0
    ) {
      alert('Please enter a description and a valid amount greater than zero.')
      return
    }
    expenseTracker = [...expenseTracker, newExpense]
    setLocalStorageFn(expenseTracker)

    renderHtml(expenseTracker)
  } else {
    if (idEditing !== null) {
      const formData = new FormData(form)
      const updatedExpense = Object.fromEntries(formData.entries())
      updatedExpense.id = idEditing

      if (
        !updatedExpense.description ||
        !updatedExpense.amount ||
        isNaN(updatedExpense.amount) ||
        Number(updatedExpense.amount) <= 0
      ) {
        alert(
          'Please enter a description and a valid amount greater than zero.'
        )
        return
      }

      expenseTracker = expenseTracker.map((expense) =>
        expense.id === idEditing ? updatedExpense : expense
      )

      setLocalStorageFn(expenseTracker)
      renderHtml(expenseTracker)

      btnSubmit.textContent = 'Add'
      idEditing = null
    }
  }
  form.reset()
}

function clearExpense() {
  const deleteConfirm = confirm(
    'Are you sure you want to clear all the expenses?'
  )

  if (deleteConfirm) {
    expenseTracker = []
    setLocalStorageFn(expenseTracker)
    renderHtml(expenseTracker)
  }
}

function filterCategory() {
  const categoryFilter = searchCategory.value
  const expenseFilter = expenseTracker.filter(
    (expense) => expense.category === categoryFilter
  )

  renderHtml(expenseFilter)
}

function clearFilter() {
  searchCategory.selectedIndex = 0

  renderHtml(expenseTracker)
}

function renderHtml(expenseArrRender) {
  // if (expenseTracker.length === 0) {
  //   resume.classList.add('hideResume')
  //   resume.classList.remove('showResume')
  // } else {
  //   resume.classList.add('showResume')
  //   resume.classList.remove('hideResume')
  // }

  let total = 0
  expenseSec.innerHTML = ''
  expenseArrRender
    .slice()
    .reverse()
    .forEach((expense) => {
      total += Number(expense.amount)

      let row = document.createElement('li')
      row.innerHTML = `
      <strong class="expenseDesc" data-id=${expense.id}>${
        expense.description
      }</strong> - $${Number(expense.amount).toFixed(2)} 
      <em>(${expense.category})</em>
      <a href="#" class="delete_expense" data-id=${expense.id}>❌</a>
    `
      expenseSec.appendChild(row)
    })
  totalSec.textContent = '$' + total
}

function setLocalStorageFn(expenseArr) {
  localStorage.setItem('expenseTracker_ls', JSON.stringify(expenseArr))
}

function getLocalStorageFn() {
  return JSON.parse(localStorage.getItem('expenseTracker_ls')) || []
}
