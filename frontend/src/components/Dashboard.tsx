import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLessonStore } from '../store/useLessonStore';
import { Lesson } from '../types';
import { format, isSameDay, startOfDay } from 'date-fns';
import LessonCard from './LessonCard';
import DateFilter from './DateFilter';
import CalendarView from './CalendarView';
import ThemeToggle from './ThemeToggle';

const Dashboard = () => {
  const navigate = useNavigate();
  const tutor = useAuthStore((state) => state.tutor);
  const logout = useAuthStore((state) => state.logout);
  const { lessons, loading, error, fetchLessons, takeClass } = useLessonStore();
  const [dateFilter, setDateFilter] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!tutor) {
      navigate('/login');
      return;
    }
    fetchLessons();
  }, [tutor, navigate, fetchLessons]);

  const handleTakeClass = async (lessonId: string) => {
    if (!tutor) return;
    try {
      await takeClass(lessonId, tutor.name);
      // Refresh lessons after taking a class
      await fetchLessons();
    } catch (err) {
      console.error('Failed to take class:', err);
    }
  };

  const handleCalendarDateClick = (date: Date) => {
    setSelectedCalendarDate(date);
    setDateFilter({
      start: startOfDay(date),
      end: startOfDay(date),
    });
    setViewMode('list');
  };

  const filteredLessons = useMemo(() => {
    let filtered = lessons;

    if (dateFilter.start && dateFilter.end) {
      filtered = filtered.filter((lesson) => {
        const lessonDate = new Date(lesson.date);
        return lessonDate >= dateFilter.start! && lessonDate <= dateFilter.end!;
      });
    }

    return filtered;
  }, [lessons, dateFilter]);

  const today = startOfDay(new Date());

  const historicLessons = useMemo(
    () => filteredLessons.filter((lesson) => lesson.type === 'Historic'),
    [filteredLessons]
  );

  const upcomingLessons = useMemo(
    () => filteredLessons.filter((lesson) => lesson.type === 'Upcoming'),
    [filteredLessons]
  );

  const availableLessons = useMemo(
    () => filteredLessons.filter((lesson) => lesson.type === 'Available'),
    [filteredLessons]
  );

  const todaysLessons = useMemo(
    () =>
      filteredLessons.filter((lesson) =>
        isSameDay(new Date(lesson.date), today)
      ),
    [filteredLessons, today]
  );

  const groupedByMonth = useMemo(() => {
    const grouped: Record<string, Lesson[]> = {};
    filteredLessons.forEach((lesson) => {
      const monthKey = format(new Date(lesson.date), 'MMMM yyyy');
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(lesson);
    });
    return grouped;
  }, [filteredLessons]);

  const renderLessonSection = (
    title: string,
    lessons: Lesson[],
    emptyMessage: string
  ) => {
    if (lessons.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <LessonCard
              lesson={lesson}
              onTakeClass={handleTakeClass}
              tutorName={tutor?.name}
            />
          </div>
        ))}
      </div>
    );
  };

  if (!tutor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Champ Code Academy
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Tutor Portal</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Welcome, <span className="font-medium">{tutor.name}</span>
              </span>
              <ThemeToggle />
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* View Mode Toggle */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'calendar'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <DateFilter
              onFilterChange={(start, end) =>
                setDateFilter({ start, end })
              }
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="text-center py-12 animate-fade-in">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading lessons...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 animate-slide-down">
                {error}
              </div>
            )}

            {!loading && !error && viewMode === 'calendar' && (
              <div className="animate-fade-in">
                <CalendarView
                  lessons={filteredLessons}
                  onDateClick={handleCalendarDateClick}
                  selectedDate={selectedCalendarDate}
                />
              </div>
            )}

            {!loading && !error && viewMode === 'list' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                {/* Today's Lessons */}
                <section className="animate-slide-up">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Today's Lessons ({todaysLessons.length})
                  </h2>
                  {renderLessonSection(
                    "Today's Lessons",
                    todaysLessons,
                    'No lessons scheduled for today'
                  )}
                </section>

                {/* Available Lessons */}
                <section className="animate-slide-up">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Available Lessons ({availableLessons.length})
                  </h2>
                  {renderLessonSection(
                    'Available Lessons',
                    availableLessons,
                    'No available lessons'
                  )}
                </section>

                {/* Upcoming Lessons */}
                <section className="animate-slide-up">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Upcoming Lessons ({upcomingLessons.length})
                  </h2>
                  {renderLessonSection(
                    'Upcoming Lessons',
                    upcomingLessons,
                    'No upcoming lessons'
                  )}
                </section>

                {/* Historic Lessons */}
                <section className="animate-slide-up">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Historic Lessons ({historicLessons.length})
                  </h2>
                  {dateFilter.start && dateFilter.end ? (
                    renderLessonSection(
                      'Historic Lessons',
                      historicLessons,
                      'No historic lessons in this period'
                    )
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(groupedByMonth)
                        .sort(([a], [b]) => {
                          const dateA = new Date(a + ' 01');
                          const dateB = new Date(b + ' 01');
                          return dateB.getTime() - dateA.getTime();
                        })
                        .map(([month, monthLessons]) => {
                          const historicInMonth = monthLessons.filter(
                            (lesson) => lesson.type === 'Historic'
                          );
                          if (historicInMonth.length === 0) return null;

                          return (
                            <div key={month} className="animate-fade-in">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                {month}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {historicInMonth.map((lesson) => (
                                  <LessonCard
                                    key={lesson.id}
                                    lesson={lesson}
                                    tutorName={tutor.name}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      {historicLessons.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <p>No historic lessons</p>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

