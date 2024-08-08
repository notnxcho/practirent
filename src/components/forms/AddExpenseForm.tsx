import './formStyles.scss'
import CurrencyInput from '../common/CurrencyInput/CurrencyInput'
import { Frequency } from 'src/types/property'

const AddExpenseForm = ({errors, register, currencySymbol, setCurrencySymbol, frequency, setFrequency}: any) => {
    const frequencies: Frequency[] = [
        {frequency: 'Monthly', value: 1, unit: 'm'},
        {frequency: 'Quarterly', value: 3, unit: 'm'},
        {frequency: 'Semestral', value: 6, unit: 'm'},
        {frequency: 'Yearly', value: 1, unit: 'y'},
    ]
    
    return (
        <>
            <div className='input-wrap'>
                <label htmlFor="name" className="label">Description</label>
                <input id="name" {...register('description', { required: true })} className="input" />
                {errors.name && <span className="text-red-500 text-xs">This field is required</span>}
            </div>
            <div className="input-wrap">
                <label htmlFor="Frequency" className="label">Frequency</label>
                <div className="chip-selection-wrapper">
                    {frequencies.map((freq) => (
                        <div key={freq.frequency} className={`chip ${freq.frequency === frequency.frequency ? 'selected' : ''}`} onClick={() => setFrequency(freq)}>
                            {freq.frequency} ({freq.value}{freq.unit})
                        </div>
                    ))}
                </div>
            </div>
            <div className='input-wrap'>
                <label htmlFor="Amount" className="label">Amount</label>
                <CurrencyInput passId="amount" passRegister={register} currencySymbol={currencySymbol} setCurrencySymbol={setCurrencySymbol} />
                {errors.amount && <span className="text-red-500 text-xs">This field is required</span>}
            </div>
            <div className='input-wrap'>
                <label htmlFor="date" className="label">Date</label>
                <input 
                    type="date" 
                    id="date" 
                    {...register('date', { required: true })} 
                    className="input" 
                    onKeyDown={(e) => e.preventDefault()} // Prevent manual input
                />
                {errors.date && <span className="text-red-500 text-xs">This field is required</span>}
            </div>
        </>
    )
}

export default AddExpenseForm