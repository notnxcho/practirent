import React, { useEffect, useState } from 'react'
import { useProperties } from 'src/contexts/PropertiesContext'
import { calculateKpis } from 'src/utils'
import './kpiSummary.scss'

const KpiSummary = () => {
    const { properties } = useProperties()
    const [compoundedKpis, setCompoundedKpis] = useState({
        totalRevenue: 0,
        operatingCost: 0,
        profitMargin: 0,
        incomeToExpenseRatio: 0,
        assetYield: 0
    })

    useEffect(() => {
        if (properties.length > 0) {
            const totalKpis = properties.reduce((acc, property) => {
                const kpis = calculateKpis(property)
                return {
                    totalRevenue: acc.totalRevenue + kpis.totalRevenue,
                    operatingCost: acc.operatingCost + kpis.operatingCost,
                    profitMargin: acc.profitMargin + kpis.profitMargin,
                    incomeToExpenseRatio: acc.incomeToExpenseRatio + kpis.incomeToExpenseRatio,
                    assetYield: acc.assetYield + kpis.assetYield
                }
            }, {
                totalRevenue: 0,
                operatingCost: 0,
                profitMargin: 0,
                incomeToExpenseRatio: 0,
                assetYield: 0
            })

            setCompoundedKpis(totalKpis)
        }
    }, [properties])

    return (
        <div className="kpi-summary">
            <div className="kpi-card">
                <div className="kpi-title">Total Revenue (Yearly)</div>
                <div className="kpi-value">USD {compoundedKpis.totalRevenue}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-title">Operating Cost (Yearly)</div>
                <div className="kpi-value">USD {compoundedKpis.operatingCost}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-title">Profit Margin (Yearly)</div>
                <div className="kpi-value">USD {compoundedKpis.profitMargin}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-title">Income to Expense Ratio</div>
                <div className="kpi-value">{compoundedKpis.incomeToExpenseRatio.toFixed(3)}</div>
            </div>
            <div className="kpi-card">
                <div className="kpi-title">Asset Yield (Annually)</div>
                <div className="kpi-value">{compoundedKpis.assetYield.toFixed(2)}%</div>
            </div>
        </div>
    )
}

export default KpiSummary