import { Lesson } from '../types';
import { format } from 'date-fns';

interface LessonCardProps {
  lesson: Lesson;
  onTakeClass?: (lessonId: string) => void;
  tutorName?: string;
}

const LessonCard = ({ lesson, onTakeClass, tutorName }: LessonCardProps) => {
  const lessonDate = new Date(lesson.date);
  const formattedDate = format(lessonDate, 'MMM dd, yyyy');
  const formattedTime = format(lessonDate, 'h:mm a');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Historic':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
      case 'Upcoming':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in hover:scale-[1.02] transform">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {lesson.subject}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{formattedTime}</span>
          </div>
        </div>
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getTypeColor(
            lesson.type
          )}`}
        >
          {lesson.type}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="text-gray-500 dark:text-gray-400">Students:</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {lesson.students.length > 0
              ? lesson.students.join(', ')
              : 'No students assigned'}
          </span>
        </div>
        {lesson.tutor && (
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="text-gray-500 dark:text-gray-400">Tutor:</span>
            <span className="text-gray-900 dark:text-white font-medium">{lesson.tutor}</span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="text-gray-500 dark:text-gray-400">Status:</span>
          <span className="text-gray-900 dark:text-white font-medium">{lesson.status}</span>
        </div>
      </div>

      {lesson.type === 'Available' && onTakeClass && tutorName && (
        <button
          onClick={() => onTakeClass(lesson.id)}
          className="w-full bg-primary-600 dark:bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Take Class
        </button>
      )}
    </div>
  );
};

export default LessonCard;

