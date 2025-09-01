// pages/demo/demo.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    documents: [
      { id: 1, title: '实验指导书.docx' },
      { id: 2, title: '实验报告封面.docx' },
      { id: 3, title: '实验演示.pptx' },
      { id: 4, title: '实验数据记录表.xlsx' },
      { id: 5, title: '实验优秀范例.pdf' },
      // 可以继续添加更多
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var pageTitle = '实验相关资料';
    wx.setNavigationBarTitle({
      title: pageTitle,
    })
  },

  onLook(e){
    // 从被点击图标的 data-id 属性中访问存储的文档 ID
    var documentId = e.currentTarget.dataset.id; 
    var DocxUrl = 'https://mp-bbd82d5f-9010-41a8-8269-14681d3d37c3.cdn.bspapp.com/2023版《电气测试技术》实验指导书.docx';
    console.log(documentId);
    switch (documentId) {
      case 1:
        DocxUrl = 'https://mp-bbd82d5f-9010-41a8-8269-14681d3d37c3.cdn.bspapp.com/2023版《电气测试技术》实验指导书.docx';
        break;
      case 2:
        DocxUrl = 'https://mp-bbd82d5f-9010-41a8-8269-14681d3d37c3.cdn.bspapp.com/实验封面.docx';
        break;
      case 3:
        DocxUrl = 'https://mp-bbd82d5f-9010-41a8-8269-14681d3d37c3.cdn.bspapp.com/实验演示.pptx';
        break;
      case 4:
        DocxUrl = 'https://mp-bbd82d5f-9010-41a8-8269-14681d3d37c3.cdn.bspapp.com/实验数据记录.xlsx';
        break;
      case 5:
        DocxUrl = 'https://mp-bbd82d5f-9010-41a8-8269-14681d3d37c3.cdn.bspapp.com/实验优秀范例.pdf';
        break;
    }
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