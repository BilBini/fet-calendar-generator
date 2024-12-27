const { Timetable } = require('../models');

async function generateTimetableForClass(classObj) {
  // getCourses only works if the Class model has .hasMany(Course)
  // and you included: { include: Course } when fetching classObj
  const courses = await classObj.getCourses();

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  const times = [
    { start: '09:00', end: '10:30' },
    { start: '10:45', end: '12:15' },
    { start: '13:00', end: '14:30' },
    { start: '14:45', end: '16:15' }
  ];

  const results = [];
  for(const day of days) {
    for(const slot of times) {
      if(courses.length > 0) {
        const course = courses[Math.floor(Math.random() * courses.length)];
        const entry = await Timetable.create({
          class_id: classObj.id,
          course_id: course.id,
          day,
          start_time: slot.start,
          end_time: slot.end
        });
        results.push(entry);
      }
    }
  }
  return results;
}

module.exports = { generateTimetableForClass };
