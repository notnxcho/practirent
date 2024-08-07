import './formStyles.scss'
import CurrencyInput from '../common/CurrencyInput/CurrencyInput'

const AddExpenseForm = ({errors, register, currencySymbol, setCurrencySymbol}: any) => {
    return (
        <>
            <div className='input-wrap'>
                <label htmlFor="name" className="label">Name</label>
                <input id="name" {...register('name', { required: true })} className="input" />
                {errors.name && <span className="text-red-500 text-xs">This field is required</span>}
            </div>
            <div className='input-wrap'>
                <label htmlFor="description" className="label">Description</label>
                <textarea id="description" {...register('description')} className="input h-fit max-h-[90px] min-h-[60px]" />
                {errors.description && <span className="text-red-500 text-xs">This field is required</span>}
                
            </div>
            <div className='input-wrap'>
                <label htmlFor="marketValue" className="label">Market Value</label>
                <CurrencyInput passId="marketValue" passRegister={register} currencySymbol={currencySymbol} setCurrencySymbol={setCurrencySymbol} />
                {errors.marketValue && <span className="text-red-500 text-xs">This field is required</span>}
            </div>
            <div className='input-wrap'>
                <label htmlFor="padron" className="label">Padron</label>
                <input id="padron" {...register('padron')} className="input" />
                {errors.padron && <span className="text-red-500 text-xs">This field is required</span>}
            </div>
            <div className='input-wrap'>
                <label htmlFor="addressString" className="label">Address</label>
                <input id="addressString" {...register('address.addressString', { required: true })} className="input" />
                {errors.address?.addressString && <span className="text-red-500 text-xs">This field is required</span>}
            </div>
        </>
    )
}

export default AddExpenseForm