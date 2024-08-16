import { useNavigate } from "react-router-dom"
import BackButton from "src/components/common/BackButton/BackButton"
import Button from "src/components/common/Button/Button"
import { Property } from "src/types/property"
import { useState } from 'react'
import EditPropertyDialog from 'src/components/dialog/EditPropertyDialog'
import { Trash } from "iconoir-react"
import DeletePropertyDialog from 'src/components/dialog/DeletePropertyDialog'

const PropertyLayout = ({ children, property, tabs, setTabs, onUpdateProperty }: { children: React.ReactNode, property: Property | null, tabs: {name: string, active: boolean}[], setTabs: any, onUpdateProperty: (updatedProperty: Property) => void}) => {
    const navigate = useNavigate()
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

    return (
        <div className="flex flex-col min-h-[100vh]">
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
                    <div className="flex gap-3">
                        <Button variant='secondary' onClick={() => setOpenEditDialog(true)}>Edit Property</Button>
                        <div className="square-button bg-[#ffdfda]" style={{border: 'none'}} onClick={() => setOpenDeleteDialog(true)}>
                            <Trash color="#ff4400" width={20} height={20}/>
                            <div className="tooltip">Delete</div>
                        </div>
                    </div>
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
            {openEditDialog && property && <EditPropertyDialog isOpen={openEditDialog} close={() => setOpenEditDialog(false)} property={property} />}
            {openDeleteDialog && property && <DeletePropertyDialog isOpen={openDeleteDialog} close={() => setOpenDeleteDialog(false)} property={property} />}
        </div>
    )
}

export default PropertyLayout