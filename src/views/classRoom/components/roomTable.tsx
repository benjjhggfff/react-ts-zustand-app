import React from 'react';
import { 
  Table, Row, Col, Descriptions, Badge, Progress, Space, Button 
} from 'antd';
import type { TableColumnsType } from 'antd';

// 定义教室数据类型（匹配截图字段）
interface ClassroomDataType {
  key: React.Key;
  classroomName: string; // 教室名称（如：CJ1-钣金车间）
  classroomCode: string; // 教室编号（如：CJ1-bjcj）
  location: string;      // 位置（如：库勒勒校区 车间1楼）
  type: string;          // 类型（如：实训车间）
  capacity: string;      // 容量（如：80人）
  coreDevices: string[]; // 核心设备（如：空调、投影）
  status: string;        // 状态（如：可用）
  utilization: string;   // 利用率（如：0%）
  // 展开行详情信息
  managementDept: string; // 管理部门
  description: string;    // 描述
  deviceStatus: {        // 设备状态
    airConditioner: string;
    projector: string;
    microphone: string;
    light: string;
  };
  spaceInfo: {           // 空间信息
    maxCapacity: string;
    standardCapacity: string;
    area: string;
    weeklyUsage: string;
  };
}

// 模拟截图对应的教室数据
const dataSource: ClassroomDataType[] = [
  {
    key: '1',
    classroomName: 'CJ1-钣金车间',
    classroomCode: 'CJ1-bjcj',
    location: '库勒勒校区 车间1楼',
    type: '实训车间',
    capacity: '80人',
    coreDevices: ['空调', '投影'],
    status: '可用',
    utilization: '0%',
    managementDept: '汽车与智能交通学院',
    description: '无',
    deviceStatus: {
      airConditioner: '关闭',
      projector: '关闭',
      microphone: '关闭',
      light: '关闭',
    },
    spaceInfo: {
      maxCapacity: '80人',
      standardCapacity: '未设置',
      area: '未记录',
      weeklyUsage: '0小时',
    },
  },
  {
    key: '2',
    classroomName: 'CJ1-焊工房2',
    classroomCode: 'CJ1-hanggongfang2',
    location: '库勒勒校区 车间1楼',
    type: '实训车间',
    capacity: '80人',
    coreDevices: ['空调', '投影'],
    status: '可用',
    utilization: '0%',
    managementDept: '汽车与智能交通学院',
    description: '无',
    deviceStatus: {
      airConditioner: '关闭',
      projector: '关闭',
      microphone: '关闭',
      light: '关闭',
    },
    spaceInfo: {
      maxCapacity: '80人',
      standardCapacity: '未设置',
      area: '未记录',
      weeklyUsage: '0小时',
    },
  },
  {
    key: '3',
    classroomName: 'CJ1-化工车间',
    classroomCode: 'CJ1-huagongchejian',
    location: '库勒勒校区 车间1楼',
    type: '实训车间',
    capacity: '80人',
    coreDevices: ['空调', '投影'],
    status: '可用',
    utilization: '0%',
    managementDept: '汽车与智能交通学院',
    description: '无',
    deviceStatus: {
      airConditioner: '关闭',
      projector: '关闭',
      microphone: '关闭',
      light: '关闭',
    },
    spaceInfo: {
      maxCapacity: '80人',
      standardCapacity: '未设置',
      area: '未记录',
      weeklyUsage: '0小时',
    },
  },
];

// 表格列配置（匹配截图列）
const columns: TableColumnsType<ClassroomDataType> = [
  {
    title: '教室名称',
    key: 'classroomName',
    render: (_, record) => (
      <Space direction="vertical" size={2}>
        <span>{record.classroomName}</span>
        <span style={{ color: '#999', fontSize: 12 }}>{record.classroomCode}</span>
      </Space>
    ),
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    render: (type) => (
      <Badge 
        status="processing" 
        text={type} 
        style={{ backgroundColor: '#f0f0f0', color: '#666' }}
      />
    ),
  },
  {
    title: '容量',
    dataIndex: 'capacity',
    key: 'capacity',
  },
  {
    title: '核心设备',
    dataIndex: 'coreDevices',
    key: 'coreDevices',
    render: (devices) => devices.join('、'),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Badge status="success" text={status} />
    ),
  },
  {
    title: '利用率',
    dataIndex: 'utilization',
    key: 'utilization',
    render: (util) => (
      <Space>
        <Progress 
          percent={parseInt(util)} 
          strokeWidth={4} 
        
        />
       
      </Space>
    ),
  },
  {
    title: '操作',
    key: 'operation',
    render: () => (
      <Space size="small">
        <a style={{ color: '#1890ff' }}>查看</a>
        <a style={{ color: '#1890ff' }}>预约</a>
        <a style={{ color: '#1890ff' }}>编辑</a>
        <a style={{ color: '#f5222d' }}>删除</a>
      </Space>
    ),
  },
];

// 展开行渲染（匹配截图的分栏详情）
const expandedRowRender = (record: ClassroomDataType) => (
  <Row gutter={24} style={{ margin: '16px 0' }}>
    {/* 基础信息栏 */}
    <Col span={8}>
      <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>基础信息</h4>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="教室编号">{record.classroomCode}</Descriptions.Item>
        <Descriptions.Item label="管理部门">{record.managementDept}</Descriptions.Item>
        <Descriptions.Item label="位置">{record.location}</Descriptions.Item>
        <Descriptions.Item label="描述">{record.description}</Descriptions.Item>
      </Descriptions>
    </Col>
    {/* 设备状态栏 */}
    <Col span={8}>
      <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>设备状态</h4>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="空调">{record.deviceStatus.airConditioner}</Descriptions.Item>
        <Descriptions.Item label="投影仪">{record.deviceStatus.projector}</Descriptions.Item>
        <Descriptions.Item label="麦克风">{record.deviceStatus.microphone}</Descriptions.Item>
        <Descriptions.Item label="灯光">{record.deviceStatus.light}</Descriptions.Item>
      </Descriptions>
    </Col>
    {/* 空间信息栏 */}
    <Col span={8}>
      <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>空间信息</h4>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="最大容量">{record.spaceInfo.maxCapacity}</Descriptions.Item>
        <Descriptions.Item label="标准容量">{record.spaceInfo.standardCapacity}</Descriptions.Item>
        <Descriptions.Item label="面积">{record.spaceInfo.area}</Descriptions.Item>
        <Descriptions.Item label="本周使用时长">{record.spaceInfo.weeklyUsage}</Descriptions.Item>
      </Descriptions>
    </Col>
  </Row>
);

// 完整页面组件（含顶部操作按钮）
const ClassroomList: React.FC = () => (
  <div  style={{ padding: -10, background: '#fff' }}>
    {/* 顶部操作栏（匹配截图右上角按钮） */}
    <div style={{ marginBottom: 10, textAlign: 'right',marginTop:'20px', }}>
      <Button type="default"  style={{ marginRight: 20  , backgroundColor: '#cec6e1',color: '#fff' }}>
        新增教室
      </Button>
      <Button type="default" style={{ marginRight: 20 , backgroundColor: '#86a7d8', color: '#fff' }}>
        导出数据
      </Button>
    </div>

    {/* 教室列表表格（匹配截图布局） */}
    <Table<ClassroomDataType>
      columns={columns}
      dataSource={dataSource}
      expandable={{
        expandedRowRender,
        defaultExpandedRowKeys: ['1'], // 默认展开第一行（匹配截图效果）
        expandRowByClick: true,
      }}
      bordered
      pagination={false} // 如需分页可自行添加
    />
  </div>
);

export default ClassroomList;