import React from 'react'
import './kpiCardStyles.scss'

interface KpiCardProps {
    title: string
    value: string | number
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value }) => {
    return (
        <div className="kpi-card">
            <div className="kpi-title">{title}</div>
            <div className="kpi-value">{value}</div>
        </div>
    )
}

export default KpiCard