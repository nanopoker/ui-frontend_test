import { useMemo, useState } from 'react';
import { Lesson } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, getDay, addMonths, subMonths } from 'date-fns';

interface CalendarViewProps {
  lessons: Lesson[];
  onDateClick?: (date: Date) => void;
  selectedDate?: Date | null;
}

const CalendarView = ({ lessons, onDateClick, selectedDate }: CalendarViewProps) => {
  const [viewMonth, setViewMonth] = useState(new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get first day of month to calculate offset
  const firstDayOfWeek = getDay(monthStart);
  
  // Create calendar grid (6 weeks × 7 days)
  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in the month
    daysInMonth.forEach(day => days.push(day));
    
    // Fill remaining cells to complete 6 weeks (42 days)
    while (days.length < 42) {
      days.push(null);
    }
    
    return days;
  }, [daysInMonth, firstDayOfWeek]);

  const getLessonsForDate = (date: Date | null): Lesson[] => {
    if (!date) return [];
    return lessons.filter(lesson => isSameDay(new Date(lesson.date), date));
  };

  const getLessonTypeColor = (lessons: Lesson[]): string => {
    if (lessons.length === 0) return '';
    
    const types = lessons.map(l => l.type);
    if (types.includes('Available')) return 'bg-green-500 dark:bg-green-600';
    if (types.includes('Upcoming')) return 'bg-blue-500 dark:bg-blue-600';
    if (types.includes('Historic')) return 'bg-gray-500 dark:bg-gray-600';
    return '';
  };

  const today = new Date();
  const isToday = (date: Date | null) => date && isSameDay(date, today);
  const isSelected = (date: Date | null) => date && selectedDate && isSameDay(date, selectedDate);
  const isCurrentMonth = (date: Date | null) => date && isSameMonth(date, viewMonth);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setViewMonth(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6 animate-fade-in">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {format(viewMonth, 'MMMM yyyy')}
        </h3>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day Labels */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const dateLessons = getLessonsForDate(date);
          const hasLessons = dateLessons.length > 0;
          const dayIsToday = isToday(date);
          const dayIsSelected = isSelected(date);
          const dayIsCurrentMonth = isCurrentMonth(date);

          return (
            <button
              key={index}
              onClick={() => date && onDateClick?.(date)}
              disabled={!date}
              className={`
                relative aspect-square p-1 rounded-lg text-sm transition-all duration-200
                ${!dayIsCurrentMonth 
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                }
                ${dayIsToday 
                  ? 'ring-2 ring-primary-500 dark:ring-primary-400 font-semibold' 
                  : ''
                }
                ${dayIsSelected 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100' 
                  : ''
                }
                ${hasLessons ? 'font-medium' : ''}
              `}
            >
              {date && (
                <>
                  <span>{format(date, 'd')}</span>
                  {hasLessons && (
                    <span
                      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${getLessonTypeColor(dateLessons)}`}
                    />
                  )}
                  {dateLessons.length > 1 && (
                    <span className="absolute top-0.5 right-0.5 text-xs text-primary-600 dark:text-primary-400">
                      {dateLessons.length}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-600"></span>
            <span className="text-gray-600 dark:text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-600"></span>
            <span className="text-gray-600 dark:text-gray-400">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-500 dark:bg-gray-600"></span>
            <span className="text-gray-600 dark:text-gray-400">Historic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

