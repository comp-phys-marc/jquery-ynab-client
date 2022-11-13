
# YANB

YNAB provides awesome budgeting software. The principles that the software upholds help people to identify and categorize the purpose of each dollar in their bank accounts, manage their expenses and establish a healthy, long-term financial lifestyle.

# The YNAB API

The new [YNAB RESTful API](https://api.youneedabudget.com/) allows developers to tap into the great insights and management tools that YNAB provides. The [API starter kit](https://github.com/ynab/ynab-api-starter-kit) comes with a very well written and useful API client written in TypeScript, and an example app in the awesome component-based web framework [Vue.js](https://vuejs.org/).


# This Repo

The examples provided by YNAB are perfect for lots of modern web developers. However, for those of us that still program in plain JavaScript (or JavaScript with jQuery) now and again, it is useful to have a more generally compatible client. That is what I have started here.

# Appilcations

An app that uses this client is Cents, a web app that allows for the creation of quick and private online transactions between users, using Stripe. The integration with YNAB allows users to see that state of their finances in every context where they are prompted to spend money. It also allows money collectors to sync their YNAB accounts with their account in Cents.

Connect with YNAB Sync Bank Account See feedback

# Widget

In Cents, the example app, the YNAB API means users don't spend their money without thinking first. It also means users can know what impact they can expect a fundraiser to have on their overall finances. To take this a step further, I thought it would be awesome to be able to see this kind of feedback beside any call-to-action on the web that could have financial implications for a user. So, in the example folder of this repo, there is a widget that will take a cost as a parameter and use the YNAB API to provide basic information about the user's finances that pertain to the potential expense. This includes whether or not it can be afforded, and if not, then how much saving needs to be done. It will run in any JavaScript environment.

# Status

This client is not 100% complete. The currently supported API endpoints are:

    accounts
    user
    budgets
    transactions

The full list of endpoints and their documentation can be found [here](https://api.youneedabudget.com/v1).