/**
 * Created by marcusedwards on 2018-07-27.
 */

function getBudgets(callback) {
  var ynabConfig = getLocalYnabConfig()
  $.get(ynabConfig.baseApiUrl + '/budgets?access_token=' + getLocalAuthToken())
    .done(function(response) {
      var data = response.data
      var ynabBudgets = data.budgets
      if (callback instanceof Function) {
        callback(ynabBudgets)
      }
    })
    .fail(function(data) {
      if (data.responseJSON.hasOwnProperty('error')) {
        var error = data.responseJSON.error
        if (error.id == '401') {
          refreshAndRetry(function() {
            getBudgets(callback)
          })
        } else {
          console.log(error.detail)
        }
      }
    })
}

function getBudgetMonths(budgetId, callback) {
  var ynabConfig = getLocalYnabConfig()
  $.get(ynabConfig.baseApiUrl + '/budgets/' + budgetId + '/months?access_token=' + getLocalAuthToken())
    .done(function(response) {
      var data = response.data
      var ynabBudgetMonths = data.months
      if (callback instanceof Function) {
        callback(ynabBudgetMonths)
      }
    })
    .fail(function(data) {
      if (data.responseJSON.hasOwnProperty('error')) {
        var error = data.responseJSON.error
        if (error.id == '401') {
          refreshAndRetry(function() {
            getBudgetMonths(budgetId, callback)
          })
        } else {
          console.log(error.detail)
        }
      }
    })
}

function setLocalBudgets(budgets) {
  localStorage.setItem('ynab-budgets', JSON.stringify(budgets))
}

function getLocalBudgets() {
  return JSON.parse(localStorage.getItem('ynab-budgets'))
}
