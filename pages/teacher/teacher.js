// pages/teacher/teacher.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, // 默认选中的标签页索引
    AccountNumber: '',//用户名
    ExperimentName: '热电偶实验',//实验名称
    purpose:'',//实验目的
    temperatureDataCollections:{},//实验数据
    images:[],//图象
    conclusion:'',//实验结论
    ThinkingQuestions: [],//思考题问题
    answers: {},//思考题答案
    temperatureRange: ['50℃', '70℃', '90℃', '110℃', '130℃', '150℃'], // 温度范围
    tempIndex: 0, // 温度选择索引
    temperatureData : [],
    experimentData: [
      // 示例数据，实际应用中应从蓝牙设备获取
      { measurement: '标准热电偶温度1 （℃）', value: '' },
      { measurement: '标准热电偶温度2 （℃）', value: '' },
      { measurement: '标准热电偶温度3 （℃）', value: '' },
      { measurement: '标准热电偶温度4 （℃）', value: '' },
      { measurement: '标准热电偶平均温度 （℃）', value: '' },
      { measurement: '被校热电偶温度1 （℃）', value: '' },
      { measurement: '被校热电偶温度2 （℃）', value: '' },
      { measurement: '被校热电偶温度3 （℃）', value: '' },
      { measurement: '被校热电偶温度4  （℃）', value: '' },
      { measurement: '被校热电偶平均温度 （℃）', value: '' },
      { measurement: '两偶温度误差（℃）', value: '' },
      { measurement: '两偶误差（Δδ%）', value: '' }
    ],//表格数据
    TeacherComment:'',//教师评语
    ExperimentSections: [
      { Section: '报告', grade: '' },
      { Section: '数据', grade: '' },
      { Section: '图象', grade: '' },
      { Section: '分析', grade: '' },
      { Section: '思考题', grade: '' }
    ],//实验部分
    //优秀历史范例部分
    HistoryImages:['/image/2.jpg','/image/1.jpg','/image/0.jpg'],
  },

  // 切换标签页的函数
  switchTab: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.index
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var pageTitle = '教师端';
    wx.setNavigationBarTitle({
      title: pageTitle,
    })
    this.setData({
      AccountNumber: app.globalData.AccountNumber,//用户名
      ExperimentName: app.globalData.ExperimentName,//实验名称
      purpose:app.globalData.purpose,//实验目的
      temperatureDataCollections:app.globalData.temperatureDataCollections,//实验数据
      images:app.globalData.images,//图象
      conclusion:app.globalData.conclusion,//实验结论
      ThinkingQuestions:app.globalData.ThinkingQuestions,//思考题问题
      answers: app.globalData.answers,//思考题答案
    })
    var temp = this.data.temperatureRange[0];
    if (temp in this.data.temperatureDataCollections) {
      console.log("存在", temp, "的数据");
      // 使用[]来访问对象属性，tempIndex的值决定了访问哪个属性
      this.setData({
        experimentData: this.data.temperatureDataCollections[temp] // 更新experimentData以反映清空的value值
      });
      // 现在selectedTemperatureData包含了对应温度下的数据数组
      console.log(this.data.experimentData);
    } else {
      console.log("不存在", temp, "的数据");
    }
  },

  //获取温度选择器变化后的索引值
  onTemperatureChange: function(e) {
    this.setData({
      tempIndex: e.detail.value
    });
    // 清空experimentData中的value值
    const clearedData = this.data.experimentData.map(item => ({
      ...item,
      value: '' // 清空value值
    }));
    this.setData({
      experimentData: clearedData // 更新experimentData以反映清空的value值
    });
    //选择对应温度要取出对应的值
    //如果此温度未被保存，即不执行此操作
    var temp = this.data.temperatureRange[e.detail.value];
    if (temp in this.data.temperatureDataCollections) {
      console.log("存在", temp, "的数据");
      // 使用[]来访问对象属性，tempIndex的值决定了访问哪个属性
      this.setData({
        experimentData: this.data.temperatureDataCollections[temp] // 更新experimentData以反映清空的value值
      });
      // 现在selectedTemperatureData包含了对应温度下的数据数组
      console.log(this.data.experimentData);
    } else {
      console.log("不存在", temp, "的数据");
    }
  },

  onClick(e){
    this.setData({
      AccountNumber: app.globalData.AccountNumber,//用户名
      ExperimentName: app.globalData.ExperimentName,//实验名称
      purpose:app.globalData.purpose,//实验目的
      temperatureDataCollections:app.globalData.temperatureDataCollections,//实验数据
      images:app.globalData.images,//图象
      conclusion:app.globalData.conclusion,//实验结论
      ThinkingQuestions:app.globalData.ThinkingQuestions,//思考题问题
      answers: app.globalData.answers,//思考题答案
    })
  },

  //获取评分表格数据
  onExSectionGrade(e){
    const index = e.currentTarget.dataset.id;  // 从事件对象获取index
    const grade = e.detail.value;  // 获取输入框的新值
    // 检查输入的值是否大于20
    if (grade > 20) {
      // 提示用户分数不能超过20
      wx.showToast({
        title: '分数不能超过20',
        icon: 'none',
        duration: 500
      });

    }
    console.log('Editing section at index:', index, 'New grade:', grade);
    // 更新数据
    let sections = this.data.ExperimentSections;
    sections[index].grade = grade;
    this.setData({
      ExperimentSections: sections
    });
  },

  // 教师评语
  updateComment(e){
    this.setData({
      TeacherComment: e.detail.value
    });
  },

  //上传成绩
  onUploadGrade(){
    wx.showToast({
      title: '上传成功',
      icon: 'success',
    })
    console.log('成绩：',this.data.ExperimentSections,'\n教师评语：',this.data.TeacherComment);
    app.globalData.ExperimentSections = this.data.ExperimentSections;//教师打分表
    app.globalData.TeacherComment = this.data.TeacherComment;//教师评语
  },

  // 历史优秀范例部分
  onGetHistoryImage(){
    wx.chooseMedia({
      count: 9,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      sizeType: ['original', 'compressed'],
      success: (res) => {
        // 将选择的图片路径保存到数组中
        var tempFilePath = [];
        for (let i = 0; i < res.tempFiles.length; i++) {
          tempFilePath[i] = res.tempFiles[i].tempFilePath;
        }
        this.setData({
          HistoryImages: tempFilePath
        });
      }
    });
  },
  onUploadHistoryImage(){
    console.log('历史优秀范例',this.data.HistoryImages);
    app.globalData.HistoryImages = this.data.HistoryImages;//教师打分表
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})