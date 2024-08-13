import { Currency } from "src/types/property"
import './CurrencyInput.scss'
import { FieldValues, UseFormRegister } from "react-hook-form"

const CurrencyInput = ({ passId, passRegister, currencySymbol, setCurrencySymbol }: { passId: string, passRegister: UseFormRegister<FieldValues> | any, currencySymbol: Currency, setCurrencySymbol: (currency: Currency) => void }) => {
    const rotateCurrency = () => {
        if (currencySymbol.currency === 'usd') {
            setCurrencySymbol({ currency: 'uyu', symbol: '$U' })
        } else {
            setCurrencySymbol({ currency: 'usd', symbol: 'USD' })
        }
    }

    return (
        <div className="currency-input-wrapper">
            <div className="currency-container" onClick={rotateCurrency}>
                {currencySymbol.symbol}
            </div>
            <input
                type="number"
                className="input-box"
                id={passId}
                {...passRegister(`${passId}.amount`, { required: true })}
            />
        </div>
    )
}

export default CurrencyInput