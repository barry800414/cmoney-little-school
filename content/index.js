

const fs = require("fs");
const argsParser = require("args-parser");
const { getCourse, getUnit, getLeafUnitIds, renameCourseTitle } = require("./utils");
const { SELECTED_COURSE_ROOT_IDS, COURSE_NAME_MAPPING } = require("./constants");

const args = argsParser(process.argv);
const course2Units = {};

(async() => {
    // 取得課程單元列表
    for (let courseId of SELECTED_COURSE_ROOT_IDS) {
        console.log("GET Course | courseId:", courseId);
        const course = await getCourse(courseId);
        if (!args.skipRenameCourse) {
            renameCourseTitle(course, COURSE_NAME_MAPPING[courseId]);
        }
        if (typeof course === 'object') {
            await fs.writeFileSync(`./data/r${courseId}.json`, JSON.stringify(course, null, 4));
            // 擷取單元 ID
            course2Units[courseId] = getLeafUnitIds(course);
        } else {
            console.error("課程單元列表 response 錯誤");
        }
    }

    // 取得單元內容
    for (let courseId of Object.keys(course2Units)) {
        for (let unitId of course2Units[courseId]) {
            console.log("GET Unit | courseId: ", courseId, 'unitId: ', unitId);
            const unit = await getUnit(courseId, unitId);
            if (typeof unit === 'object') {
                await fs.writeFileSync(`./data/c${unitId}.json`, JSON.stringify(unit, null, 4));
            } else {
                console.error("單元內容 response 錯誤");
            }
        }
    }
})();
