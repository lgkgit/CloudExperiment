// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    initialValue:'S',
    inputValue:'',
    AccountNumber: '',//账号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var pageTitle = '用户注册';
    wx.setNavigationBarTitle({
      title: pageTitle,
    })
  },

  inputChange: function (e){
    const InputValue = e.detail.value;//获取输入值
    // console.log(InputValue);
    this.setData({
      AccountNumber: InputValue
    })
  },

  //点击了注册
  onRegister(){
    wx.navigateTo({
      url: '/pages/index/index?AccountNumber='+ encodeURIComponent(this.data.AccountNumber),
    })
  },

  //发送验证码
  onSendMessage(){
    wx.showToast({
      title: '已发送验证码',
      icon: "success"
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