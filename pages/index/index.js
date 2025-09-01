Page({

  /**
   * 页面的初始数据
   */
  data: {
    PasswordValue: '',
    AccountNumber: 'S111',
    PassWord: '111',
    TeacherAccountNumber: 'T1',
    TeacherPassWord: '1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.AccountNumber) {
      const AccountNumber = options.AccountNumber;
      this.setData({
        AccountNumber
      })
    }
  },

  //获取输入框的内容
  GetAccount: function(e) {
    this.setData({
      AccountNumber: e.detail.value
    });
  },

  GetPassword: function(e) {
    this.setData({
      PasswordValue: e.detail.value
    });
  },

  onClickJump(){
    const AccountNumber = this.data.AccountNumber;
    const PasswordValue = this.data.PasswordValue;
    //校验账号密码
    if (AccountNumber == '') {
      wx.showToast({
        title: '请输入账号',
        icon: 'error',
      })
    } else if (PasswordValue == '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'error',
      })
    }else if (AccountNumber == this.data.AccountNumber & PasswordValue == this.data.PassWord) {
      wx.showToast({
        title: '登录成功',
        icon: 'success',
      })
      //延时0.8s后开始实时获取数据
      setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/home/home?AccountNumber='+ encodeURIComponent(this.data.AccountNumber),
        })
      },800)
    }else if (AccountNumber == this.data.TeacherAccountNumber & PasswordValue == this.data.TeacherPassWord) {
      wx.showToast({
        title: '登录成功',
        icon: 'success',
      })
      //延时0.8s后开始实时获取数据
      setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/teacher/teacher?AccountNumber='+ encodeURIComponent(this.data.AccountNumber),
        })
      },800)
    }else if (AccountNumber != this.data.AccountNumber | PasswordValue != this.data.PassWord) {
      wx.showToast({
        title: '账号/密码错误',
        icon: 'error',
      })
    }
  },

  onForgetPassword(){
    wx.navigateTo({
      url: '/pages/forgetpassword/forgetpassword',
    })
  },

  onRegister(){
    wx.navigateTo({
      url: '/pages/register/register',
    })
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