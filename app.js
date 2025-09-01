// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    AccountNumber: '1',//用户名
    ExperimentName: '热电偶实验',
    purpose:'学生提交的实验目的',//实验目的
    temperatureDataCollections:{},//实验数据
    images:[],//图象
    conclusion:'学生提交的实验结论',//实验结论
    ThinkingQuestions: [
      '减小误差？',
      '为什么？'
     ],//思考题问题
    answers: {},//思考题答案
    // 教师上传的数据
    ExperimentSections:[
      { Section: '报告', grade: '1' },
      { Section: '数据', grade: '2' },
      { Section: '图象', grade: '3' },
      { Section: '分析', grade: '4' },
      { Section: '思考题', grade: '5' }
    ],//教师打分表
    TeacherComment:'app的评语',//教师评语
    HistoryImages:[],//历史优秀范例
  }
})
