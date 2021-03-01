// copoments/UpImg/UpImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src:{
      type:String,
      value:""
    },
    index:{
      type:Number,
      value:-1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleRemoveImg(){
      // 触发父组件的事件  父组件要出发的事件
      this.triggerEvent("removeImg",this.properties.index);
    }
  }
})
