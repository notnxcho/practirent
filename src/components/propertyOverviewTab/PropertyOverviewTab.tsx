import { Property } from 'src/types/property'
import AddressWidget from './AddressWidget'
import './propertyOverviewTabStyles.scss'
import KpiCard from '../common/kpiCard/KpiCard'
import { calculateKpis } from 'src/utils'

const PropertyOverviewTab = ({ property }: { property: Property }) => {
    const kpis = calculateKpis(property)

    return (
        <div className="flex flex-col gap-3 p-4">
            <div className="flex gap-3 flex-col md:flex-row">
                <AddressWidget address={property.address} padron={property.padron || ''} />
                <div className="flex flex-col border rounded-lg p-4 gap-2 bg-white flex-grow flex-shrink">
                    <div className="text-[14px] font-semibold text-[#606060]">Description</div>
                    <div className="text-[16px] text-[#202020]">{property.description}</div>
                </div>
            </div>
            <div className="grid gap-3 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] lg:grid-cols-5">
                <KpiCard title="Total Revenue (Yearly)" value={`USD ${kpis.totalRevenue}`} />
                <KpiCard title="Operating Cost (Yearly)" value={`USD ${kpis.operatingCost?.toFixed(0)}`} />
                <KpiCard title="Profit Margin (Yearly)" value={`USD ${kpis.profitMargin?.toFixed(0)}`} />
                <KpiCard title="Income to Expense Ratio" value={kpis.incomeToExpenseRatio?.toFixed(3)} />
                <KpiCard title="Asset Yield (Annually)" value={`${kpis.assetYield?.toFixed(2)}%`} />
            </div>
        </div>
    )
}

export default PropertyOverviewTab