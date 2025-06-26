import Map from "@/components/Map"
import MobileRestriction from "@/components/MobileRestriction"
type Props = {}

const MapPage = (props: Props) => {
  return (
    <MobileRestriction>
      <Map />
    </MobileRestriction>
  )
}

export default MapPage