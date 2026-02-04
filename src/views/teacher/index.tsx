import React, { useState } from "react";
import './index.module.scss';
import { Row, Col, Card } from "antd";
import TeachTable from "./c-componts/TeachTable";
import SearchInput from "./c-componts/searchInput";
import Gender from "./c-componts/gender";
import PieChartWithPaddingAngle from "./c-componts/Pie";
import { Radio } from 'antd';
import styled from "styled-components";
export default function LoginPage() {
    let [techerNumber, setTecherNumber]=useState('');
    let [techerName, setTecherName]=useState('');
    // 部门
    let [department, setDepartment]=useState('');
    const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>, setState:React.Dispatch<React.SetStateAction<string>>)=>{setState(e.target.value)}
  return(
    <TeacherPage>
   <div className="teacher-management"></div>
   <Card>
     <Row>
        <Col span={6}>
        <SearchInput title="教师编号" />
         </Col>
        <Col span={6}>
        <SearchInput title="教师姓名" />
        </Col>
        <Col span={6}>
        <SearchInput title="部门" />
        </Col>
     <Col span={6}><Radio.Group
      className="radio-group"
    name="radiogroup"
    defaultValue={1}
    options={[
      { value: 1, label: '男' },
      { value: 2, label: '女' },
 
    ]}
  /></Col>
       
       

     </Row>
      </Card>
      <Row>
        <Col span={18} style={{marginTop:'20px'}}>
          <TeachTable />
        </Col>
        <Col span={6} style={{marginTop:'20px'}}>
          <Card>
            <div>性别比例</div>
            <Gender></Gender>
        
           
          </Card>
          <Card style={{marginTop:15}}>
   <div className="">部门分布</div>
    <PieChartWithPaddingAngle></PieChartWithPaddingAngle>
          </Card>
        </Col>
      </Row>
    </TeacherPage>
  )
}

const TeacherPage= styled.div`
   .radio-group {
    margin-top: 18px;
   }
`