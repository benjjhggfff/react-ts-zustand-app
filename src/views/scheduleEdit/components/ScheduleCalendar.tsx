// components/ScheduleCalendar.tsx
import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { Course } from '../../../constants/course'
import styles from '../index.module.scss'

interface Props {
  courses: Course[]
  onEventClick: (event: any) => void
  onEventDrop: (info: any) => void
  onDateClick: (dateStr: string) => void
}

const ScheduleCalendar: React.FC<Props> = ({ courses, onEventClick, onEventDrop, onDateClick }) => {
  // 转换课程数据为 FullCalendar 事件格式
  const events = courses.map(course => ({
    id: course.id,
    title: course.title,
    start: course.start,
    end: course.end,
    color: course.color,
    extendedProps: {
      teacher: course.teacher,
      location: course.location,
      status: course.status,
    },
  }))

  // 自定义事件内容渲染
  const renderEventContent = (info: any) => {
    const { teacher, location, type, tags } = info.event.extendedProps
    const typeMap: Record<string, string> = {
      required: '必修',
      elective: '选修',
      public: '公共',
      major: '专业',
    }
    return (
      <div className={styles.calendarEvent}>
        <div className={styles.eventTitle}>
          {info.event.title}
          <span className={styles.eventType}>({typeMap[type] || type})</span>
        </div>
        <div className={styles.eventMeta}>
          {teacher} | {location}
        </div>
        {tags && tags.length > 0 && (
          <div className={styles.eventTags}>
            {tags.map((tag: string) => (
              <span key={tag} className={styles.eventTag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 处理日期点击，传递日期字符串
  const handleDateClick = (info: any) => {
    onDateClick(info.dateStr)
  }

  return (
    <div className={styles.calendarWrapper}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventContent={renderEventContent}
        editable={true}
        droppable={true}
        selectable={true}
        eventClick={info => onEventClick(info.event)}
        eventDrop={onEventDrop}
        dateClick={handleDateClick}
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        weekends={false}
        height="auto"
        firstDay={1} // 周一作为一周第一天
        locale="zh-cn" // 设置为中文
        buttonText={{
          today: '今天',
          month: '月',
          week: '周',
          day: '日',
        }}
      />
    </div>
  )
}

export default ScheduleCalendar
