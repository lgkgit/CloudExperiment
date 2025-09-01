// pages/test/test.js
import * as echarts from '../../lib/ec-canvas/echarts';

var app = getApp();//获取App实例
function generateExperimentReport(data) {
  const report = `账号: ${data.AccountNumber}\n实验目的: ${data.purpose}\n实验数据: ${JSON.stringify(data.temperatureDataCollections)}\n实验数据（图片）: ${JSON.stringify(data.images)}\n实验结论: ${data.conclusion}\n思考题: ${JSON.stringify(data.answers)}`;
  return report;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    AccountNumber: '',//用户名
    ExperimentName: '热电偶实验',//实验名称
    PatternIndex: 0, // 默认选中的模式索引
    isActive: false, // 控制是否激活点击后的样式
    ec_Experiment: {
      lazyLoad: true // 延迟加载图表
    },
    // experimentData: [
    //   // 示例数据，实际应用中应从蓝牙设备获取
    //   { measurement: '标准热电偶热电势1（mv）', value: '' },
    //   { measurement: '标准热电偶热电势2（mv）', value: '' },
    //   { measurement: '标准热电偶热电势3（mv）', value: '' },
    //   { measurement: '标准热电偶热电势4（mv）', value: '' },
    //   { measurement: '标准热电偶平均电势（mv）', value: '' },
    //   { measurement: '标准热电偶修正电势（mv）', value: '' },
    //   { measurement: '标准热电偶实际电势（mv）', value: '' },
    //   { measurement: '标准分度表温度 （℃）', value: '' },
    //   { measurement: '被校热电偶热电势1（mv）', value: '' },
    //   { measurement: '被校热电偶热电势2（mv）', value: '' },
    //   { measurement: '被校热电偶热电势3（mv）', value: '' },
    //   { measurement: '被校热电偶热电势4（mv）', value: '' },
    //   { measurement: '被校热电偶平均电势（mv）', value: '' },
    //   { measurement: '被校热电偶修正电势（mv）', value: '' },
    //   { measurement: '被校热电偶实际电势（mv）', value: '' },
    //   { measurement: '被校分度表温度 （℃）', value: '' },
    //   { measurement: '两偶温度误差（℃）', value: '' },
    //   { measurement: '两偶误差（Δδ%）', value: '' }
    // ],//表格数据
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
    pickerRange: [], // 用于picker的范围
    pickerIndex: 0, // 选中项的索引
    temperatureRange: ['50℃', '70℃', '90℃', '110℃', '130℃', '150℃'], // 温度范围
    tempIndex: 0, // 温度选择索引
    temperatureDataCollections: {},// 使用对象存储每个温度对应的experimentData数组副本
    inputValue: '', // 用户输入的值
    purpose: '',//实验目的
    conclusion: '',//实验结论
    ThinkingQuestions: [
      '分析产生校验误差的各种因素，思考如何处理可以减小误差？',
      '将平台上的热电偶转换开关打向左边，显示的温度值真实与否？为什么？'
     ],//思考题问题
    answers: {},//思考题答案
    images: [], // 存储图片路径的数组
    ChartValue: {},// 存储绘图数据
    //蓝牙相关
    MsgInfo: '',
    deviceId: 'B94B85CC-F424-578B-DCF6-8C3B87C1EE91',//HC-04BLE的设备ID
    serviceId: '', // 蓝牙设备服务的 serviceId
    characteristicId: '', // 蓝牙设备特征值的 characteristicId
    localname: '',//设备名称
    deviceInfo: [],//HC-04的详细信息
    deviceData: '',//接收到HC-04发来的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取登录时的账号信息
    this.setData({
      AccountNumber:options.AccountNumber //获取传递过来的值
    })
    console.log('AccountNumber:',this.data.AccountNumber);
    //设置标题
    var pageTitle = this.data.ExperimentName;
    wx.setNavigationBarTitle({
      title: pageTitle,
    })
    // 初始化picker范围，从第二个元素开始
    const pickerRange = this.data.experimentData.map(item => item.measurement);
    this.setData({ pickerRange });
    // 创建图表
    this.ecExperimentComponent = this.selectComponent('#Experimentchart-dom-line'); // 选择页面中的 canvas 组件
    this.ExperimentChart_line(); // 调用初始化图表的函数
    //初始化蓝牙
    this.OnInitBlueTooth();
  },

  /*    附件部分    */
  // 点击了附件
  onTouchStart: function() {
    this.setData({
      isActive: true // 触摸开始，激活样式
    });
  },
  // 松开了附件
  onTouchEnd: function() {
    const that = this; // 由于setTimeout中this的指向会变，所以需要先保存当前的this对象
    setTimeout(function() {
      that.setData({
        isActive: false // 1秒后触摸结束，恢复原样
      });
    }, 500); // 设置延时为1000毫秒（1秒）
  },

  //点击了附件 执行打开文档
  OpenDocument: function (e) {
    var DocxUrl = 'https://mp-bbd82d5f-9010-41a8-8269-14681d3d37c3.cdn.bspapp.com/实验优秀范例.pdf';
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

  /*    实验目的部分    */
  // 获取实验目的的输入值
  updatePurpose: function(e) {
    this.setData({
      purpose: e.detail.value
    });
  },

  /*      实验数据部分      */

  /*实验曲线图部分*/
  //实验数据分析曲线图
  ExperimentChart_line: function() {
    this.ecExperimentComponent.init((canvas, width, height) => {
      const chart_experiment = echarts.init(canvas, null, {
        width: width,
        height: height,
      });
      canvas.setChart(chart_experiment);
      // 初始数据
      this.chart_experiment = chart_experiment; // 存储图表实例
      // 定义图表的选项配置
      this.option = {
        title: {
          subtext: this.data.experimentData[0].measurement
        },
        xAxis: {
          type: 'category',
          data: this.data.temperatureRange
        },
        yAxis: {
          type: 'value',
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
          }
        },
        series: [
          {
            data: [19, 14, 20, 16, 13],
            type: 'line',
            smooth: true
          }
        ]
      };
      chart_experiment.setOption(this.option);
      return chart_experiment;
    });
  },

  //选择不同的曲线图纵坐标
  onPickerChange: function(e) {
    // 当用户选择不同项时更新pickerIndex
    this.setData({
      pickerIndex: e.detail.value
    });
    // 假设你想根据picker选择的值来动态更新yAxis标签
    const newYTitleLabel = this.data.experimentData[e.detail.value].measurement;
    // 构建新的yAxis配置
    const newYTitle = {
      subtext: newYTitleLabel
    };
    // 更新图表配置
    this.chart_experiment.setOption({
      title: newYTitle
    });
    //顺便更新图表
    this.updateChart();
  },

  //将数据更新到图表上
  updateChart: function() {
    const dataIndex = this.data.pickerIndex; // 当前选中的纵坐标索引
    // console.log('Data Index:', dataIndex);
    const tempIndex = this.data.tempIndex; // 当前温度索引
    // 打印当前温度索引和对应温度值
    // console.log('tempIndex:', tempIndex);
    const temperature = this.data.temperatureRange[tempIndex]; // 当前选中的温度
    // console.log('temperature:',temperature);
    //判断ChartValue是否为空数组
    if (temperature in this.data.ChartValue) {
      console.log("存在", temperature, "的数据");
      // 使用[]来访问对象属性，tempIndex的值决定了访问哪个属性
      var chartyvalue = [];
      var temp_for = '';
      var tempArr = this.data.temperatureRange;
      // console.log(this.data.ChartValue[temperature][dataIndex]);
      //轮询获取不同温度值的数据到chartyvalue，作为y轴数据
      for (var i = 0; i < tempArr.length; i++) {
        temp_for = tempArr[i];// 遍历所有温度温度
        // console.log(temp_for);
        // 安全地访问ChartValue数据
        if (this.data.ChartValue[temp_for] && this.data.ChartValue[temp_for][dataIndex] !== undefined) {
          chartyvalue[i] = this.data.ChartValue[temp_for][dataIndex];
        } else {
          console.warn("Data for", temp_for, "at index", dataIndex, "is undefined.");
          chartyvalue[i] = null; // 设定为一个默认值（null）
        }
      }
      console.log(chartyvalue);
    } else {
      //不存在也要讲数据存储到chartyvalue中
      console.log("不存在", temperature, "的数据");
      // 使用[]来访问对象属性，tempIndex的值决定了访问哪个属性
      var chartyvalue = [];
      var temp_for = '';
      var tempArr = this.data.temperatureRange;
      // console.log(this.data.ChartValue[temperature][dataIndex]);
      //轮询获取不同温度值的数据到chartyvalue，作为y轴数据
      for (var i = 0; i < tempArr.length; i++) {
        temp_for = tempArr[i];// 遍历所有温度温度
        // console.log(temp_for);
        // 安全地访问ChartValue数据
        if (this.data.ChartValue[temp_for] && this.data.ChartValue[temp_for][dataIndex] !== undefined) {
          chartyvalue[i] = this.data.ChartValue[temp_for][dataIndex];
        } else {
          console.warn("Data for", temp_for, "at index", dataIndex, "is undefined.");
          chartyvalue[i] = null; // 设定为一个默认值（null）
        }
      }
      console.log(chartyvalue);
    }
    // 更新图表数据
    this.chart_experiment.setOption({
      xAxis: {
        type: 'category',
        data: this.data.temperatureRange // x轴数据仍然是温度范围
      },
      series: [{
        // 保持系列设置不变
        data: chartyvalue, // 使用新的y轴数据
        type: 'line',
        smooth: true
      }]
    });
  },
  
  /*蓝牙部分*/
  //获取输入框的内容,用于模拟蓝牙数据的输入框
  onValueInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  //获取当前温度值的蓝牙数据,发送温度值给下位机
  BleGetCTempratureExData: function(){
    //从this.data中获取数据
    const { deviceId, serviceId, characteristicId,temperatureRange,tempIndex } = this.data;
    var Value = temperatureRange[tempIndex];
    wx.showToast({
      title: Value,
      icon: 'none',
      duration: 500
    })
    // console.log(Value);
    //未连接到对应蓝牙
    if (!deviceId || !serviceId || !characteristicId) {
      wx.showToast({
        title: '请先连接蓝牙设备',
        icon: 'none'
      });
      return;
    }
    //假设未填写数据，提醒填写
    if (!Value) {
      wx.showToast({
        title: '请选择温度值',
        icon: 'none'
      });
      return;
    }
    // 处理数据，将字符串转换为 ArrayBuffer 格式
    const buffer = new ArrayBuffer(Value.length);
    const dataView = new DataView(buffer);
    for (let i = 0; i < Value.length; i++) {
      dataView.setUint8(i, Value.charCodeAt(i));
    }
    // 向蓝牙设备特征值写入数据
    wx.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      value: buffer,
      success: (res) => {
        console.log('数据发送成功', res);
        wx.showToast({
          title: '数据发送成功',
          duration: 500
        });
      },
      fail: (err) => {
        console.error('数据发送失败', err);
        wx.showToast({
          title: '数据发送失败',
          icon: 'none'
        });
      }
    });
  },

  //修改数据：将蓝牙接收到的数据或者是手动输入的数据录入表格
  changeData: function() {
    console.log(this.data.inputValue);
    // 更新特定measurement的value
    const index = this.data.pickerIndex;
    let newData = [...this.data.experimentData];
    //主要是接收蓝牙数据 若蓝牙数据为空 则手动输入
    if (this.data.deviceData == '') {
      // 解析输入值，格式为 "1,a:10,b:5"
      const inputs = this.data.inputValue.split(',');  
      const entryIndex = parseInt(inputs[0]) - 1; // 解析次数，转换为数组的索引（基于0）
      // 如果解析的次数大于4，则不进行任何操作
      if (entryIndex >= 4) {
        console.log('Entry index is out of allowed range.');
        return;
      }
      // 分析后续部分并更新对应的值
      inputs.slice(1).forEach(input => {
        const [key, val] = input.split(':');
        let offset; // 计算偏移量，确定要更新的条目位置
        if (key === 'a') {
          offset = entryIndex; // 标准热电偶温度
        } else if (key === 'b') {
          offset = entryIndex + 5; // 被校热电偶温度
        }
        if (offset !== undefined) {
          newData[offset].value = val; // 更新对应条目的值
          console.log(`Updated: ${newData[offset].measurement} with value ${val}`);
        }
      });
    }else{
      // newData[index].value = this.data.deviceData; // 蓝牙输入更新value
      // 解析输入值，格式为 "1,a:10,b:5"
      const inputs = this.data.deviceData.split(',');  
      const entryIndex = parseInt(inputs[0]) - 1; // 解析次数，转换为数组的索引（基于0）
      // 如果解析的次数大于4，则不进行任何操作
      if (entryIndex >= 4) {
        console.log('Entry index is out of allowed range.');
        return;
      }
      // 分析后续部分并更新对应的值
      inputs.slice(1).forEach(input => {
        const [key, val] = input.split(':');
        let offset; // 计算偏移量，确定要更新的条目位置
        if (key === 'a') {
          offset = entryIndex; // 标准热电偶温度
        } else if (key === 'b') {
          offset = entryIndex + 5; // 被校热电偶温度
        }
        if (offset !== undefined) {
          newData[offset].value = val; // 更新对应条目的值
          console.log(`Updated: ${newData[offset].measurement} with value ${val}`);
        }
      });
      // this.setData({
      //   deviceData:'',
      // });
    }
    this.setData({
      experimentData: newData,
    });
  },

  //初始化蓝牙
  OnInitBlueTooth: function(){
    //初始化蓝牙模块。iOS 上开启主机/从机（外围设备）模式时需分别调用一次，并指定对应的 mode。
    wx.openBluetoothAdapter({
      mode: 'central',//主机模式，仅IOS需要
      success:(res) => {
        console.log('success: ',res);
        this.setData({
          MsgInfo: 'success: '+ JSON.stringify(res)
        })
        //开始搜索附近的蓝牙外围设备
        wx.startBluetoothDevicesDiscovery({
          allowDuplicatesKey: false,
        }) 
      },
      fail:(res) => {
        console.log('fail: ',res);
        this.setData({
          MsgInfo: 'fail: '+ JSON.stringify(res)
        })
        if (res.errCode != 10001) {
          return
        }
        //监听蓝牙适配器状态变化事件
        wx.onBluetoothAdapterStateChange((res) => {
          if (!res.available) {
            return
          }
          //开始搜寻附近的蓝牙外围设备
          wx.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: false,
          })
        })
      }
    })
  },

  //获取本机蓝牙适配器状态。
  OnGetBlueToothState: function(){
    wx.getBluetoothAdapterState({
      success:(res) => {
        console.log('success: ',res);
      },
      fail:(res) => {
        console.log('fail: ',res);
      },
    })
  },

  //获取蓝牙信息
  OnGetInfo: function(){
    const deviceId = this.data.deviceId
    // 调用微信小程序 API 获取附近所有的蓝牙设备信息
    wx.getBluetoothDevices({
      success: res => {
        const devices = res.devices;
        console.log(devices);
        // 遍历设备列表，查找具有对应 deviceId 的设备信息
        for (let device of devices) {
          if (device.deviceId === deviceId) {
            console.log('找到设备：', device);
            this.setData({
              deviceInfo: device,
              localname: device.localName,
            })
            // 在这里可以处理找到设备后的逻辑，例如更新页面数据、连接设备等
            break; // 找到设备后跳出循环
          }
        }
      },
      fail: err => {
        console.error('获取蓝牙设备列表失败：', err);
      }
    });
  },

  //连接设备
  //若小程序在之前已有搜索过某个蓝牙设备，并成功建立连接，可直接传入之前搜索获取的 deviceId 直接尝试连接该设备，无需再次进行搜索操作。
  OnConnectDevise: function(){
    wx.createBLEConnection({
      deviceId: this.data.deviceId,
      success: (res) => {
        wx.showToast({
          title: '连接成功',
        })
        console.log('连接蓝牙设备成功', res);
        // 监听蓝牙连接状态变化
        wx.onBLEConnectionStateChange((res) => {
          console.log(`蓝牙连接状态变化：${res.deviceId}，连接状态：${res.connected}`);
          if (!res.connected) {
            console.log('蓝牙设备连接已断开');
            wx.showToast({
              title: '蓝牙设备连接已断开',
              icon: 'error',
            });
            return;
          }
        });
        //接收数据处理函数,获取蓝牙特征值
        this.ReBLEDataHandle();
      },
      fail: (err) => {
        console.error('连接蓝牙设备失败', err);
      }
    });
  },

  //获取蓝牙设备的服务列表，蓝牙设备的特征值列表，监听特征值变化，收取数据函数
  ReBLEDataHandle: function(){
    // 获取蓝牙设备的服务列表
    wx.getBLEDeviceServices({
      deviceId: this.data.deviceId,
      success: (res) => {
        console.log('获取蓝牙设备服务列表成功', res);
        // 遍历服务列表，获取特征值信息
        for (let service of res.services) {
          // 获取蓝牙设备的特征值列表
          wx.getBLEDeviceCharacteristics({
            deviceId: this.data.deviceId,
            serviceId: service.uuid,
            success: (res) => {
              console.log('获取蓝牙设备特征值列表成功', res);
              // console.log('serviceId: ',res.serviceId,'\ncharacteristicId: ',res.characteristics[0].uuid);
              //将获取到的蓝牙信息记录下来
              this.setData({
                serviceId: res.serviceId,
                characteristicId: res.characteristics[0].uuid,
              })
              // 遍历特征值列表，找到需要的特征值进行监听
              for (let characteristic of res.characteristics) {
                // 监听特征值变化
                wx.onBLECharacteristicValueChange((res) => {
                  console.log('收到蓝牙设备发送的数据：', res);
                  // 获取接收到的数据，并进行进一步处理
                  const buffer = res.value; // 数据为 ArrayBuffer 格式
                  // 将 ArrayBuffer 转换为字符串
                  const data = String.fromCharCode.apply(null, new Uint8Array(buffer));
                  this.setData({
                    deviceData: data,
                  })
                  // 输出接收到的字符串数据
                  console.log('接收到的数据：', data);
                });
                // 启用特征值的 notify 功能，以便实时接收数据
                wx.notifyBLECharacteristicValueChange({
                  deviceId: this.data.deviceId,
                  serviceId: service.uuid,
                  characteristicId: characteristic.uuid,
                  state: true,
                  success: (res) => {
                    console.log('启用特征值的 notify 功能成功', res);
                  },
                  fail: (err) => {
                    console.error('启用特征值的 notify 功能失败', err);
                  }
                });
              }
            },
            fail: (err) => {
              console.error('获取蓝牙设备特征值列表失败', err);
            }
          });
        }
      },
      fail: (err) => {
        console.error('获取蓝牙设备服务列表失败', err);
      }
    });
  },

  //断开连接
  OffConnectDevise: function(){
    //断开连接
    wx.closeBLEConnection({
      deviceId: this.data.deviceId,
      success: (res) =>{
        console.log('断开连接：',res);
      }
    })
  },

  /*切换按钮及拍照部分*/
  // 切换标签页的函数
  ModeSelect: function(e) {
    this.setData({
      PatternIndex: this.data.PatternIndex == 0 ? 1 : 0 // 如果当前值为0则变为1，否则变为0
    });
  },
  //拍照函数
  takePhoto: function() {
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
          images: tempFilePath
        });
      }
    });
  },

  /*实验表格数据*/
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

  //当表格中输入值的时候，将值更新到data中
  onTableValue: function (e) {
    const TableId = e.currentTarget.dataset.id; 
    var TableValue = e.detail.value;
    let newData = [...this.data.experimentData];
    newData[TableId].value = TableValue; // 更新value
    // console.log(e);
    // console.log(TableId,TableValue);
    this.setData({
      experimentData: newData,
    });
  },

  /*实验数据存储功能*/
  // 保存实验数据：将所有数据存储至temperatureDataCollections
  saveData: function() {
    //将对应温度数据保存到对应数组
    const tempValue = this.data.temperatureRange[this.data.tempIndex]; // 获取当前选择的温度值
    const currentData = JSON.parse(JSON.stringify(this.data.experimentData)); // 深拷贝当前experimentData
    // console.log('currentData',currentData);
    // 将当前experimentData数组副本保存到temperatureDataCollections对象中
    // 使用当前温度值作为键
    const updatedCollections = { ...this.data.temperatureDataCollections, [tempValue]: currentData };
    // console.log('updatedCollections',updatedCollections);
    // 使用map方法提取value数组
    const valueArray = this.data.experimentData.map(item => item.value);
    // console.log('valueArray:',valueArray);
    // 将当前experimentData数组副本保存到temperatureDataCollections对象中
    // 使用当前温度值作为键
    const updatedValue = { ...this.data.ChartValue, [tempValue]: valueArray };
    // console.log('updatedValue:',updatedValue);
    this.setData({
      temperatureDataCollections: updatedCollections,
      ChartValue : updatedValue,
    });
    // 可在此处添加后续处理逻辑，如反馈保存成功信息等
    console.log('当前数据:', this.data.temperatureDataCollections,'\n当前value值：',this.data.ChartValue);
  },

  /*      实验结论部分      */
  // 获取实验结论的输入值
  updateConclusion: function(e) {
    this.setData({
      conclusion: e.detail.value
    });
  },

  /*      实验思考题部分      */
  //获取思考题的答案输入值
  updateAnswer: function(e) {
    const updatedAnswers = this.data.answers;
    updatedAnswers[e.currentTarget.dataset.questionid] = e.detail.value;
    this.setData({
      answers: updatedAnswers
    });
  },

  /*      上传数据      */
  submitExperiment: function() {
    // 提交实验结果、结论和思考题答案的处理
    //打印数据
    console.log('账号',this.data.AccountNumber,'\n实验名称：' ,this.data.ExperimentName ,'\n实验目的：' ,this.data.purpose ,'\n实验数据: ' ,this.data.temperatureDataCollections ,'\n实验数据（图片）：',this.data.images,'\n实验结论' ,this.data.conclusion ,'\n思考题题目: ' ,this.data.ThinkingQuestions, '\n思考题: ' ,this.data.answers);
    //接收数据
    //将内容同步到全局，用来模拟服务器功能
    app.globalData.AccountNumber = this.data.AccountNumber;//用户名
    app.globalData.ExperimentName = this.data.ExperimentName;//实验名称
    app.globalData.purpose = this.data.purpose;//实验目的
    app.globalData.temperatureDataCollections = this.data.temperatureDataCollections//实验数据
    app.globalData.images = this.data.images;//图象
    app.globalData.conclusion = this.data.conclusion;//实验结论
    app.globalData.ThinkingQuestions = this.data.ThinkingQuestions;//思考提问题
    app.globalData.answers = this.data.answers;//思考题答案
    wx.showToast({
      title: '提交成功',
      icon: 'success',
    })
    // 这里可以添加代码将数据提交到后端服务器

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