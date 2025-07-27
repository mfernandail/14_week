const form = document.querySelector('.expense-form')
const resume = document.querySelector('.resume')

let expenseTracker = getLocalStorageFn()

form.addEventListener('submit', saveExpense)

document.addEventListener('DOMContentLoaded', htmlCreate)

function saveExpense(e) {
  e.preventDefault()

  console.log(expenseTracker)
  const formData = new FormData(form)
  const datos = Object.fromEntries(formData.entries())

  if (Number(datos.amount) < 0) {
    console.log('<0')
    return
  } else {
    console.log('>0')
  }

  expenseTracker = [...expenseTracker, datos]
  setLocalStorageFn(expenseTracker)

  console.log(datos)

  form.reset()
}

function htmlCreate() {
  expenseTracker.forEach((expense) => {
    let row = document.createElement('tr')
    row.innerHTML = `
      <td>${expense.description}</td>
    `
    console.log(row)
    resume.appendChild(row)
  })
}

function setLocalStorageFn(expenseArr) {
  return localStorage.setItem('expenseTracker_ls', JSON.stringify(expenseArr))
}

function getLocalStorageFn() {
  return JSON.parse(localStorage.getItem('expenseTracker_ls')) || []
}
