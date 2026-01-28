import React from 'react'
import NumberCard from '../../components/numberCard'
import { Row, Col , Card } from 'antd'
import Loading from '../../components/loading'
import LineChart from './components/lineChart'
import RadarChart from './components/radarChart'
import  BarChart  from './components/barChart'
import SearchInput from '../../components/searchInput'
import SelectInput from '../../components/selectInput'
import RoomTable from './components/roomTable'
import styles from './classRoom.module.scss'
const ClassRoom: React.FC = () => {
  return (
    <><div className={styles.classRoom}>
   <Row gutter={10}>
 
   <Col span={6}><NumberCard
     cardIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"></svg>}
     title={'教室总数'}
     value={50}
     compareText={'较上月'}
     compareValue={18}
   />

   </Col>
   <Col span={6}><NumberCard
   
     cardIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"></svg>}
     title={'可用教室'}
     value={50}
     compareText={'较上月'}
     compareValue={-10}
   
   />
    
    </Col>

   <Col span={6}><NumberCard
     cardIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"></svg>}
     title={'今日预约'}
     value={50}
     compareText={'较昨日'}
     compareValue={+20}
   />
    </Col>
   <Col span={6}><NumberCard
     cardIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"></svg>}
     title={'利用率'}
     value={80}
     compareText={'较上周'}
     compareValue={+10}
   />
    </Col>
      </Row>
      {/* 图 */}
      <Row gutter={10} style={{marginTop:'20px',height:'300px'}}>
            <Col span={6}>
          <Card><RadarChart /></Card>
        </Col>
        <Col span={12}>
        <Card><LineChart /></Card>
        </Col>
     <Col span={6}>
     <Card  style={{height:'90%'}}><BarChart /></Card>
     </Col>
      </Row>

      <Row gutter={10} style={{marginTop:'60px'}}>
        <Col span={6}>
         <SelectInput></SelectInput>
        </Col>
        <Col span={6}>
         <SelectInput></SelectInput>
        </Col>
        <Col span={6}>
          <SelectInput></SelectInput>
        </Col><Col span={6}>
          <SearchInput />
        </Col>
      </Row>
      <Row>
        <Col span={24}>  <RoomTable

      ></RoomTable></Col>
  
      </Row>
  
    </div>
   
    
        
     
    </>
  )
}
export default ClassRoom
