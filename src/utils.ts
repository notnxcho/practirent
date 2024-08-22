import { Expense, Income, Property } from 'src/types/property'

const UYU_TO_USD_CONVERSION_RATE = 40

const convertToUSD = (amount: number, currency: string) => {
    return currency === 'USD' ? amount : amount / UYU_TO_USD_CONVERSION_RATE
}

const calculateAnnualizedAmount = (amount: number, frequency: string) => {
    switch (frequency) {
        case 'Monthly':
            return amount * 12
        case 'Quarterly':
            return amount * 4
        case 'Four-Month Period':
            return amount * 3
        case 'Semestral':
            return amount * 2
        case 'Yearly':
            return amount
        default:
            return amount
    }
}

export const calculateKpis = (property: Property) => {
    const totalRevenue = property.incomes?.reduce((sum: number, income: Income) => {
        const annualizedAmount = calculateAnnualizedAmount(income.amount.amount ?? 0, income.frequency.frequency)
        return +sum + +convertToUSD(annualizedAmount, income.amount.currency.symbol)
    }, 0) || 0

    const operatingCost = property.expenses?.reduce((sum: number, expense: Expense) => {
        const annualizedAmount = calculateAnnualizedAmount(expense.amount.amount ?? 0, expense.frequency.frequency)
        return +sum + +convertToUSD(annualizedAmount, expense.amount.currency.symbol)
    }, 0) || 0

    const profitMargin = totalRevenue - operatingCost
    const incomeToExpenseRatio = operatingCost !== 0 ? totalRevenue / operatingCost : 0
    const assetYield = property.marketValue ? (profitMargin / convertToUSD(property.marketValue.amount ?? 0, property.marketValue.currency.symbol)) * 100 : 0

    return {
        totalRevenue: +totalRevenue.toFixed(0),
        operatingCost: +operatingCost.toFixed(0),
        profitMargin: +profitMargin.toFixed(0),
        incomeToExpenseRatio: +incomeToExpenseRatio.toFixed(3),
        assetYield: +assetYield.toFixed(2)
    }
}


export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
    return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ')
}
