import { useNavigate } from "react-router-dom"
import BackButton from "src/components/common/BackButton/BackButton"
import Button from "src/components/common/Button/Button"
import { Property } from "src/types/property"

const PropertyLayout = ({ children, property, tabs, setTabs }: { children: React.ReactNode, property: Property | null, tabs: {name: string, active: boolean}[], setTabs: any}) => {
    const navigate = useNavigate()
    return (
        <div>
            <div className="property-layout-nav-cointainer flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <BackButton onClick={() => {navigate(-1)}}/>
                </div>
                <div className="flex justify-between items-center gap-3 px-2">
                    { property ? 
                        <div className="flex flex-col gap-1">
                            <div className="text-[22px] font-medium flex items-center gap-2">{property.name}</div>
                            <div className="text-[14px] font-medium text-[#606060]">{property.address.addressString}</div>
                        </div>
                    :
                        <div className="flex flex-col gap-2">
                            <div className="shimmer w-[120px] h-[30px]"></div>
                            <div className="shimmer w-[100px] h-[22px]"></div>
                        </div>
                    }
                    <Button variant='secondary'>Edit Property</Button>
                </div>
                <div className="flex gap-3 mt-4">
                {tabs.map((t)=>(
                    <div className={`tab-body ${t.active ? 'active' : ''}`} onClick={()=>{setTabs(tabs.map((tab)=>({...tab, active: tab.name === t.name})))}}>
                        {t.name}
                    </div>
                ))}
                </div>
            </div>
            {children}
        </div>
    )
}

export default PropertyLayout