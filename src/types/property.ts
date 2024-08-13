export type Property = {
    id: string,
    name: string,
    description?: string,
    marketValue?: MonetaryAmount,
    image?: string[],
    padron?: string,
    income?: Income[],
    tenant?: Tenant,
    expenses?: Expense[],
    address: Address,
}

export type Address = {
    addressString: string,
    street: string,
    streetNumber: string,
    city: string,
    department: string,
    geoLocation: {
        latitude: number,
        longitude: number,
    }
}

export type Income = {
    id: string,
    indexDate: Date,
    description: string,
    title: string,
    amount: MonetaryAmount,
    frequency: Frequency,
    history: IncomePayment[]
}

export type IncomePayment = {
    id: string,
    amount: MonetaryAmount,
    date: Date,
    reference: string,
}

export type Tenant = {
    name: string,
    email: string,
    phone: string,
    contract: Contract,
}

export type Frequency = {
    frequency: string,
    value: number,
    unit: "m" | 'y' | 'w',
}
export type MonetaryAmount = {
    amount: number | undefined,
    currency: Currency,
}
export type Currency = {
    currency: "usd" | "uyu",
    symbol: "USD" | "$U",
}

export type Contract = {
    startDate: Date,
    endDate: Date,
    rent: number,
    rentFrequency: Frequency,
    rentCurrency: Currency,
}

export type Expense = {
    id: string,
    indexDate: Date,
    amount: MonetaryAmount,
    frequency: Frequency,
    description: string,
    title: string,
    history: ExpensePayment[]
}

export type ExpensePayment = {
    id: string,
    amount: MonetaryAmount,
    date: Date | string,
    reference: string,
    completed: boolean,
}