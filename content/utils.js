
const axios = require("axios");

const getCourseList = async () => {
    const response = await axios({
        method: 'get',
        baseURL: 'https://www.cmoney.tw',
        url: '/learn/ashx/view/index.ashx',
        params: {
            action: 'GetFeaturedCourses',
            isDisplayForMap: true,
        },
    });
    if (response.status === 200) {
        return response.data;
    } else {
        throw Error("取得課程列表失敗");
    }
}

const getCourse = async (courseId) => {
    const response = await axios({
        method: 'get',
        baseURL: 'https://www.cmoney.tw',
        url: '/learn/ashx/moduledata.ashx',
        params: {
            action: 'GetLearningTree',
            rId: courseId,
            type: 'Progress',
        },
    });
    if (response.status === 200) {
        return response.data;
    } else {
        throw Error("取得課程單元列表失敗");
    }
}

const getUnit = async (courseId, unitId) => {
    const response = await axios({
        method: 'get',
        baseURL: 'https://www.cmoney.tw',
        url: '/learn/ashx/view/topic.ashx',
        params: {
            action: 'GetCourseDetail',
            rId: courseId,
            cId: unitId,
        },
    });
    if (response.status === 200) {
        return response.data;
    } else {
        throw Error("取得單元內容失敗");
    }
}

// 取得一堂課葉子節點的 unit Id
const getLeafUnitIds = (root) => {
    let unitIds = [];
    if ('ChildNodes' in root) {
        if (root['ChildNodes'].length === 0) {
            return [root['CourseId']];
        } else {
            for(let node of root['ChildNodes']) {
                unitIds = unitIds.concat(getLeafUnitIds(node));
            }
            return unitIds;
        }
    }
    return null;
}

module.exports = {
    getCourseList,
    getCourse,
    getUnit,
    getLeafUnitIds,
}