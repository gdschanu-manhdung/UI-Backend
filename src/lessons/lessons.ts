import { Lesson } from 'src/database/typeorm/entities/Lesson'
import { CourseDetails, LessonDetails } from 'src/utils/types'
import { AddLessonDto } from './dto/AddLesson.dto'

export interface ILessonsService {
    getLessonsByCourse(courseDetails: CourseDetails): Promise<Lesson[]>
    addLesson(addLessonDto: AddLessonDto): Promise<Lesson>
    editLesson(lessonDetails: LessonDetails): Promise<Lesson>
    deleteLesson(lessonDetails: LessonDetails): Promise<string>
}
