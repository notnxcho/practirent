import { useEffect, useState } from "react"
import AddPropertyDialog from "../../components/dialog/AddPropertyDialog"
import Layout from "../layout"
import { useProperties } from "../../contexts/PropertiesContext"
import PropertyCard from "../../components/propertyCard/PropertyCard"
import { Property } from "src/types/property"

const Properties = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const toggleOpenDialog = () => {
    return setOpenDialog(!openDialog)
  }
  const { properties, loading, fetchProperties } = useProperties()

  useEffect(() => {
    fetchProperties()
  }, [])

  return (
    <Layout>
      <div className="layout-content-container">
        {openDialog && <AddPropertyDialog isOpen={openDialog} close={() => setOpenDialog(false)}/>}
        <div className="page-header">
          <div className="ml-2">Properties</div>
          <div className="header-cta-wrap">
            <div className="cta" onClick={toggleOpenDialog}>Add Property</div>
          </div>
        </div>
        <div className="properties-grid">
          {properties.map(
            (prop: Property, index: number) => {
              return <PropertyCard property={prop} key={prop.id}/>
            }
          )}
          {loading && (
            <>
              <div className="property-card-container shimmer"></div>
              <div className="property-card-container shimmer"></div>
              <div className="property-card-container shimmer"></div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Properties