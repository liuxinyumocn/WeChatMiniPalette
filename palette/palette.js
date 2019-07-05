import format from 'format.js';

class Palette{

    constructor(){

        this._that = null;

        this._swidth = 0;
        this._sheight = 0;
        this._sctx = null;

        this._cr = 255;
        this._cg = 0;
        this._cb = 0;

        //s
        this._le = 0;
        this._sr = 255;
        this._sg = 0;
        this._sb = 0;
        this.sdata = [];

        //m
        this.li = 0;
        this.ha = 0;
        this.ch = 0;
    }

    /*
        提供两个 Canvas
        opt={
            mcanvas:
            scanvas:
            that
        }
    */
    load(opt){
        opt = opt || {};
        format.callback(opt);
        this._that = opt.that;
        this._mcanvas(opt.mcanvas);
        this._scanvas(opt.scanvas);
    }

    _mcanvas(id){
        wx.createSelectorQuery().select('#' + id).fields({
            size: true
        }, function (res) {
            this._mwidth = res.width;
            this._mheight = res.height;
            //获取画布句柄
            this._mctx = wx.createCanvasContext(id, this);
            this._mid = id;
            //绘制颜色
            //100 100
            this.loadM();
        }.bind(this)).exec();
    }

    loadM(){
        let single = parseInt(this._mwidth / 100);
        let step = 1;
        if (single <= 0) {
            single = 1;
            step = parseInt(100 / this._mwidth);
        }
        this.ch = this.rgb2hsv([this._cr, this._cg, this._cb])[0];
        let arr = []; this.li = 0;
        let c = 0, cf = 0;
        this.ha = this._mheight;
        for (c = 0; c <= this._mheight; c++) {
            this.li = 0;
            for (let i = 0; i < 100; i++) { //一行
                for (let j = 0; j < single; j++) {
                    let rgb = this._mlev(this.ch, i, 100 - parseInt(c / this._mheight * 100));
                    if (i % step == 0) {
                        this.li++;
                        arr.push(...rgb);
                        arr.push(255);
                    }
                }
            }
            if (arr.length > 50000) {
                arr = new Uint8ClampedArray(arr);
                wx.canvasPutImageData({
                    canvasId: this._mid,
                    data: arr,
                    x: 0,
                    y: cf,
                    width: this.li,
                    height: arr.length / 4 / this.li
                })
                cf = c;
                arr = [];
            }
        }
        arr = new Uint8ClampedArray(arr);
        wx.canvasPutImageData({
            canvasId: this._mid,
            data: arr,
            x: 0,
            y: cf,
            width: this.li,
            height: arr.length / 4 / this.li
        })
        arr = [];
    }

    _mlev(h,s,b){
        return this.hsv2rgb([h,s,b]);
    }

    mmove(opt){
        opt = opt || {};
        format.callback(opt);
        //计算M板颜色
        let s = 100*opt.touch.x/this.li;
        let b = 100-100*opt.touch.y/this.ha;
        if(s > 100)
            s = 100;
        else if(s < 0)
            s = 0;
        if(b > 100)
            b = 100;
        else if(b<0){
            b =0;
        }
        let rgb = this.hsv2rgb([this.ch,s,b]);
        opt._success({
            r:rgb[0],
            g:rgb[1],
            b:rgb[2]
        });
    }

    smove(opt) {
        opt = opt || {};
        format.callback(opt);
        let rate = opt.touch.x/this._swidth;
        let a = parseInt(this.sdata.length/4 * rate)*4;
        this._cr = this.sdata[a];
        this._cg = this.sdata[a+1];
        this._cb = this.sdata[a+2];
        this.loadM();
        opt._success({
            r:this._cr,
            g:this._cg,
            b:this._cb
        });
    }

    _scanvas(id){
        wx.createSelectorQuery().select('#' + id).fields({
            size: true
        }, function (res) {
            this._swidth = res.width;
            this._sheight = res.height;
            //获取画布句柄
            this._sctx = wx.createCanvasContext(id, this);

            //绘制颜色
            //1530
            let single = parseInt(this._swidth/1530); 
            let step = 1;
            if(single <= 0){
                single = 1;
                step = parseInt(1530/this._swidth);
            }
            let arr = [];
            this._slevInit();
            for(let i = 0 ;i<1530;i++){
                for(let j =0;j<single;j++){
                    let rgb = this._slev();
                    if(i%step == 0){
                        arr.push(...rgb);
                        arr.push(255);
                    }
                }
            }
            //copy
            for(let i in arr){
                this.sdata.push(arr[i]);
            }

            let w = arr.length/4;
            for(let i = 0;i<5;i++){
                arr.push(...arr);
            }

            arr = new Uint8ClampedArray(arr);
            console.log(arr);
            wx.canvasPutImageData({
                canvasId: id,
                data: arr,
                x: 0,
                y: 0,
                width: w,
                success:(res)=>{
                    console.log(res);
                },
                fail:(res)=>{
                    console.log(res);
                }
            });

        }.bind(this)).exec();
    }

    _slevInit(){
        this._le = 0;
        this._sr = 255;
        this._sg = 0;
        this._sb = 0;
    }

    /*
        0 255,0,0
        1 255,0,255
        2 0,0,255
        3 0,255,255
        4 0,255,0
        5 255,255,0
        0 255,0,0
    */
    _slev() {
        let re = [this._sr, this._sg, this._sb];
        switch (this._le) {
            case 0:
                this._sb++;
                if (this._sb == 256) {
                    this._le = 1;
                    this._sb = 255;
                }
                break;
            case 1:
                this._sr--;
                if (this._sr == -1) {
                    this._le = 2;
                    this._sr = 0;
                }
                break;
            case 2:
                this._sg++;
                if (this._sg == 256) {
                    this._le = 3;
                    this._sg = 255;
                }
                break;
            case 3:
                this._sb--;
                if (this._sb == -1) {
                    this._le = 4;
                    this._sb = 0;
                }
                break;
            case 4:
                this._sr++;
                if (this._sr == 256) {
                    this._le = 5;
                    this._sr = 255;
                }
                break;
            case 5:
                this._sg--;
                if (this._sg == -1) {
                    this._le = 0;
                    this._sg = 0;
                }
                break;
        }
        return re;
    }



    hsv2rgb(arr){
        var h = arr[0], s = arr[1], v = arr[2];
        s = s / 100;
        v = v / 100;
        var r = 0, g = 0, b = 0;
        var i = parseInt((h / 60) % 6);
        var f = h / 60 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        switch (i) {
            case 0:
                r = v; g = t; b = p;
                break;
            case 1:
                r = q; g = v; b = p;
                break;
            case 2:
                r = p; g = v; b = t;
                break;
            case 3:
                r = p; g = q; b = v;
                break;
            case 4:
                r = t; g = p; b = v;
                break;
            case 5:
                r = v; g = p; b = q;
                break;
            default:
                break;
        }
        r = parseInt(r * 255.0)
        g = parseInt(g * 255.0)
        b = parseInt(b * 255.0)
        return [r, g, b];
    }

    rgb2hsv(arr){
        var h = 0, s = 0, v = 0;
        var r = arr[0], g = arr[1], b = arr[2];
        arr.sort(function (a, b) {
            return a - b;
        })
        var max = arr[2]
        var min = arr[0];
        v = max / 255;
        if (max === 0) {
            s = 0;
        } else {
            s = 1 - (min / max);
        }
        if (max === min) {
            h = 0;//事实上，max===min的时候，h无论为多少都无所谓
        } else if (max === r && g >= b) {
            h = 60 * ((g - b) / (max - min)) + 0;
        } else if (max === r && g < b) {
            h = 60 * ((g - b) / (max - min)) + 360
        } else if (max === g) {
            h = 60 * ((b - r) / (max - min)) + 120
        } else if (max === b) {
            h = 60 * ((r - g) / (max - min)) + 240
        }
        h = parseInt(h);
        s = parseInt(s * 100);
        v = parseInt(v * 100);
        return [h, s, v]
    }

}

export default new Palette();