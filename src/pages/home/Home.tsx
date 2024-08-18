import { addUserDocument } from "../../services/firestoreService"
import Layout from "../layout"
import KpiSummary from '../../components/KpiSummary/KpiSummary'

const Home = () => {
  return (
    <Layout>
      <div className="layout-content-container">
        <KpiSummary />
      </div>
    </Layout>
  )
}

export default Home