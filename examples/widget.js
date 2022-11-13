/**
 * Created by marcusedwards on 2018-07-30.
 */

function ynabBudgetWidget(cost) {
  if (typeof jQuery == 'undefined') {
    var script = document.createElement('SCRIPT')
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'
    script.type = 'text/javascript'
    document.getElementsByTagName('head')[0].appendChild(script)
    console.log('jQuery was not loaded and is required by the YNAB budget widget. It has been automatically installed.')
  }

  if (!(getBudgets instanceof Function)) {
    console.log('Please include the jQuery YNAB API client to use the YNAB budget widget.')
    return -1
  }

  if (cost == null) cost = 0
  var widgetId = Math.random()
    .toString(36)
    .substr(2, 9)

  function budgetsToMonthlyTotalsArray(budgets) {
    for (var i in budgets) {
      var allBudgetMonths = {}
      getBudgetMonths(budgets[i].id, function(budgetMonths) {
        for (var j in budgetMonths) {
          var budgetMonth = budgetMonths[j]
          if (allBudgetMonths.hasOwnProperty(budgetMonth.month)) {
            allBudgetMonths[budgetMonth.month] += budgetMonth.to_be_budgeted / 1000
          } else {
            allBudgetMonths[budgetMonth.month] = budgetMonth.to_be_budgeted / 1000
          }
        }
        if (Object.values(allBudgetMonths).length > 0) {
          monthlyBalance.append(budgetMonth.to_be_budgeted / 1000)
        }
        if (i >= budgets.length) {
          var budget = monthlyBalance[monthlyBalance.length - 1]
          var color = budget > cost ? '#4caf50' : '#f45342'
          var message =
            budget > cost ? "Looks like it's in your budget! :)" : "Looks like that's not quite in your budget yet... "

          var monthlySavings = []
          while ((j = 0 < monthlyBalance.length - 1)) {
            monthlySavings.append(monthlyBalance[j + 1] - monthlyBalance[j])
          }
          var averageSavings = 0
          for (k in monthlySavings) {
            averageSavings += monthlySavings[k]
          }
          averageSavings = averageSavings / (k + 1)

          if (averageSavings > 0) {
            message +=
              'but you have seen an average monthly budget increase of ' +
              averageSavings +
              ' over the past ' +
              monthlySavings.length +
              ' months.' +
              ' That means ' +
              Math.ceil((cost - budget) / averageSavings) +
              'months of saving to go!'
          }

          $('ynab-widget-header-' + widgetId).style('background-color', color)
          $('ynab-widget-message-' + widgetId).text(message)
          $('#ynab-widget-' + widgetId).show()
        }
      })
    }
  }

  var budgets = getLocalBudgets()
  if (budgets == null) {
    monthlyBalance = []
    getBudgets(budgetsToMonthlyTotalsArray(budgets))
  } else {
    budgetsToMonthlyTotalsArray(budgets)
  }

  return (
    '<div class="ynab-widget-card-' +
    widgetId +
    '" id="ynab-widget-' +
    widgetId +
    '" style="display:none;">' +
    '<div class="ynab-widget-header-' +
    widgetId +
    '">' +
    '<h1>' +
    budget +
    '</h1>' +
    '</div>' +
    '<div class="ynab-widget-text-' +
    widgetId +
    '">' +
    '<p id="ynab-widget-message-' +
    widgetId +
    '"></p>' +
    '</div>' +
    '</div>' +
    '<style>' +
    '.ynab-widget-card-' +
    widgetId +
    '{' +
    'width: 250px;' +
    'box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);' +
    'text-align: center;' +
    'border-radius: 10px;' +
    '}' +
    '.ynab-widget-header-' +
    widgetId +
    '{' +
    'color: white;' +
    'padding: 10px;' +
    'font-size: 40px;' +
    '}' +
    '.ynab-widget-text-' +
    widgetId +
    '{' +
    'padding: 10px;' +
    '}' +
    '</style>'
  )
}
