// app/draw/palette/view/page.js
import palette from '../palette.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentColor:'',
        r:255,
        g:255,
        b:255,
        a:1,
        f:'#FFFFFF'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       setTimeout(function(){
           palette.load({
               scanvas: 'scanvas',
               mcanvas: 'mcanvas',
               that: this
           });

       },1000);
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

    },
    smove: function (res) {
        palette.smove({
            touch: res.changedTouches[0],
            success: (res) => {
                this.setData({
                    currentColor:'rgb('+res.r+','+res.g+','+res.b+')',
                    r:res.r,
                    g:res.g,
                    b: res.b,
                    f: '#' + this.to16(res.r) + this.to16(res.g) + this.to16(res.b)
                });
            }
        });
    },
    mmove:function(res){
        palette.mmove({
            touch: res.changedTouches[0],
            success: (res) => {
                this.setData({
                    currentColor: 'rgb(' + res.r + ',' + res.g + ',' + res.b + ')',
                    r: res.r,
                    g: res.g,
                    b: res.b,
                    f: '#'+this.to16(res.r)+this.to16(res.g)+this.to16(res.b)
                });
            }
        });
    },
    to16(v){
        return parseInt(v).toString(16);
    }
})