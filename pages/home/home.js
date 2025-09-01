import * as echarts from '../../lib/ec-canvas/echarts';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StudentName: '张三',
    AccountNumber: '11',
    StudentCollege: '自动化学院',
    StudentPhonenumber: '12345678910',
    ec_grade: {
      lazyLoad: true // 延迟加载图表
    },
    currentTab: 0, // 默认选中的标签页索引
    //实验界面相关内容
    Experiment: [
      { id: 1, title: '实验相关资料',date: '存储了实验所需的相关资料，可供阅读查看',grade: '100'},
      { id: 2, title: '热电偶实验' ,date: '截止日期：2024-05-13',grade: '90'},
      { id: 3, title: '交流信号激励的称重传感器实验' ,date: '截止日期：2024-06-13',grade: '80'},
      { id: 4, title: '霍尔式传感器—直/交流激励特性' ,date: '截止日期：2024-07-13',grade: '95'},
      // 可以继续添加更多
    ],
    //个人界面相关内容
    //成绩界面相关内容
    ExperimentName : '热电偶实验',
    MarkYvalue: [19, 14, 20, 16, 13],//成绩分析y轴数据
    // 教师上传的数据
    ExperimentSections:[],//教师打分表
    TeacherComment:'',//教师评语
    HistoryImages:['/image/2.jpg','/image/1.jpg','/image/0.jpg'],//历史优秀范例
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
  onLoad: function (options) {
    this.setData({
      AccountNumber:options.AccountNumber //获取传递过来的值
    });
    // console.log(this.data.AccountNumber);
    // 创建图表
    this.ecGradeComponent = this.selectComponent('#mychart-dom-line'); // 选择页面中的 canvas 组件
    this.GradeChart_line(); // 调用初始化图表的函数
  },
  //历史优秀分析
  HisGrade(e){
    var DocxUrl = 'https://mp-bbd82d5f-9010-41a8-8269-14681d3d37c3.cdn.bspapp.com/2023版《电气测试技术》实验指导书.docx';
    //打开文档操作
    wx.downloadFile({
      url: DocxUrl,
      success: function(res) {
        const filePath = res.tempFilePath
        console.log(res);
        wx.openDocument({
          filePath: filePath,
          showMenu: true,
          success: function (res) {
            console.log('打开文档成功');
          }
        })
      },
      fail: function (res) {
        console.log('!!!');
      }
    })
  },

  //个人成绩分析曲线图
  GradeChart_line: function() {
    // 使用画布元素及其尺寸初始化GradeChart
    this.ecGradeComponent.init((canvas, width, height) => {
       // 初始化 ECharts 库，以便在给定尺寸的画布上呈现图表
      const chart_grade = echarts.init(canvas, null, {
        width: width,
        height: height,
      });
      // 关联图表和画布
      canvas.setChart(chart_grade);
      // 初始数据
      this.chart_grade = chart_grade; // 存储图表实例
      // 定义图表的选项配置
      this.option = {
        title: {
          text: this.data.ExperimentName,
          subtext: '分值'
        },
        xAxis: {
          type: 'category',
          data: ['报告', '数据', '图象', '分析', '思考题']
        },
        yAxis: {
          type: 'value'
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
          }
        },
        series: [
          {
            data: this.data.MarkYvalue,
            type: 'line',
            smooth: true
          }
        ]
      };
      //设置了图表的选项
      chart_grade.setOption(this.option);
      //返回图表实例
      return chart_grade;
    });
  },

  //获取成绩
  onGetGrade(){
    const ExperimentSections = app.globalData.ExperimentSections;
    const TeacherComment = app.globalData.TeacherComment;
    const ExperimentName = app.globalData.ExperimentName;
    const grade = [];
    this.setData({
      // 教师上传的数据
      ExperimentSections:ExperimentSections,//教师打分表
      TeacherComment:TeacherComment,//教师评语
    })
    console.log(ExperimentSections,TeacherComment);
    for (let i = 0; i < ExperimentSections.length; i++) {
      grade[i] = ExperimentSections[i].grade;
    }
    console.log(grade);
    this.setData({
      MarkYvalue:grade
    })
    //更新图表数据
    this.chart_grade.setOption({
      title: {
        text: ExperimentName,
        subtext: '分值'
      },
      series: [{
        // 保持系列设置不变
        data: this.data.MarkYvalue, // 使用新的y轴数据
        type: 'line',
        smooth: true
      }]
    })
  },


  //实验界面
  naviExperiment(e){
    // 从被点击图标的 data-id 属性中访问存储的文档 ID
    var ExperimentId = e.currentTarget.dataset.id; 
    switch (ExperimentId) {
      case 1:
        wx.navigateTo({
          url: '/pages/demo/demo',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/test/test?AccountNumber='+ encodeURIComponent(this.data.AccountNumber),
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/test/test?AccountNumber='+ encodeURIComponent(this.data.AccountNumber),
        })
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/test/test?AccountNumber='+ encodeURIComponent(this.data.AccountNumber),
        })
        break;
    }
  },

  naviExperiment1(){
    wx.navigateTo({
      url: '/pages/test/test',
    })
  },

  naviExperiment2(){
    wx.navigateTo({
      url: '/pages/test/test',
    })
  },
  naviExperiment3(){
    wx.navigateTo({
      url: '/pages/test/test',
    })
  },

  onClickChange(){
    var app = getApp();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})

