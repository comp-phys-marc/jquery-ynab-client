/**
 * Created by marcusedwards on 2018-07-27.
 */

function dateString() {
  var today = new Date()
  var dd = today.getDate()
  var mm = today.getMonth() + 1
  var yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  return mm + '/' + dd + '/' + yyyy
}

function createTransaction(budgetId, accountId, amount, payeeName, description) {
  var ynabConfig = getYnabConfig()
  $.post(ynabConfig.baseApiUrl + '/budgets/' + budgetId + '/transactions?access_token=' + getLocalAuthToken(), {
    transaction: {
      account_id: accountId,
      date: dateString(),
      amount: amount,
      payee_id: null,
      payee_name: payeeName,
      category_id: null,
      memo: description,
      cleared: 'cleared',
      approved: true,
      flag_color: 'red',
      import_id: null
    }
  }).fail(function(data) {
    if (data.responseJSON.hasOwnProperty('error')) {
      var error = data.responseJSON.error
      if (error.id == '401') {
        refreshAndRetry(function() {
          createTransaction(budgetId, accountId, amount, payeeName, description)
        })
      } else {
        console.log(error.detail)
      }
    }
  })
}

function setLocalTransactions(transactions) {
  localStorage.setItem('ynab-transactions', JSON.stringify(transactions))
}

function getLocalTransactions() {
  return JSON.parse(localStorage.getItem('ynab-transactions'))
}
