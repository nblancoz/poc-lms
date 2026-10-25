import { CourseDetailView } from '../components/courses/CourseDetailView';
import { CourseList } from '../components/courses/CourseList';
import { LessonList } from '../components/lessons/LessonList';
import { LessonViewer } from '../components/lessons/LessonViewer';
import { UserSwitcher } from '../components/UserSwitcher';
import { useLearningDashboard } from '../hooks/useLearningDashboard';

export function LearningDashboard() {
  const {
    view,
    courses,
    loadingCourses,
    coursesError,
    selectedCourse,
    loadingCourseDetail,
    isEnrolling,
    enrollError,
    handleSelectCourse,
    handleBackToCatalog,
    handleSelectLesson,
    handleBackToCourse,
    handleEnroll,
  } = useLearningDashboard();

  function renderContent() {
    switch (view.mode) {
      case 'lesson':
        return (
          <LessonViewer
            lessonId={view.lessonId}
            onBack={() => handleBackToCourse(view.courseId)}
            onEnroll={() => handleEnroll(view.courseId)}
            isEnrolling={isEnrolling}
          />
        );

      case 'course':
        if (loadingCourseDetail || !selectedCourse) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div className="spinner-md" />
            </div>
          );
        }

        return (
          <>
            <UserSwitcher />
            <CourseDetailView
              course={selectedCourse}
              onBack={handleBackToCatalog}
              onEnroll={() => void handleEnroll(view.courseId)}
              isEnrolling={isEnrolling}
              enrollError={enrollError}
            >
              <div style={{ marginTop: '20px' }}>
                <h3 className="section-title" style={{ fontSize: '0.95rem' }}>
                  Temario del curso ({selectedCourse.lessons.length})
                </h3>
                <LessonList
                  lessons={selectedCourse.lessons}
                  isEnrolled={selectedCourse.isEnrolled}
                  onSelectLesson={(lessonId) => handleSelectLesson(view.courseId, lessonId)}
                />
              </div>
            </CourseDetailView>
          </>
        );

      case 'catalog':
      default:
        return (
          <>
            <UserSwitcher />
            <CourseList
              courses={courses}
              isLoading={loadingCourses}
              error={coursesError}
              onSelectCourse={handleSelectCourse}
            />
          </>
        );
    }
  }

  return <div className="learning-dashboard">{renderContent()}</div>;
}
