/**
 * Created by jingwenzheng on 2018/3/20.
 */

var fs = require('fs');
var images = require("images");

/*
* 处理 文件夹 中的文件
* 删除 数字 效果图 - —— _ 等字段
* */
function HANDPATH(path) {

    const files = fs.readdirSync(path);

    files.forEach(function (itm, index) {

        const npath = path + itm;

        const stat = fs.statSync(npath);

        if (stat.isFile()){

            var handPath = itm.replace(/[0-9]+/ig,"").replace("效果图","").replace("黄历天气","").replace(/－/g,"-")

            if (handPath.indexOf("-") == 0){
                handPath = handPath.replace("-","")
            }
            if (handPath.indexOf("_") == 0){
                handPath = handPath.replace("_","")
            }

            fs.rename(path + itm,path + handPath);
        }
    })
}

var content = []

function READFILE(path) {

    const files = fs.readdirSync(path);
    files.forEach(function (itm, index) {

        const npath = path + itm;

        const stat = fs.statSync(npath);


        if (stat.isDirectory()){

            READFILE(npath + "/");
            return
        }

        if (itm.indexOf(".png") != -1){

            const image = images(npath)

            var obj = {}
            obj.width = image.width()
            obj.height = image.height()
            obj.url =  npath;
            obj.description = ""
            obj.title = itm.replace(".png","")

            content.push(obj)
        }

    })
}

function WriteToJson() {

    READFILE("images/")

    var obj1 = {
        title:"奇点资讯",
        description: "奇点资讯是一份深度新闻资讯报告，汇集精选内容资讯，关联事件，洞悉事实本质，让信息不再是孤岛，新闻不再是一言堂。 ",
        results: []
    }

    var obj2 = {
        title:"打卡7",
        description: "打卡7，一个优化生活的工具。帮你记录每天坚持的点滴。 ",
        results: []
    }

    var obj3 = {
        title:"白猫贷",
        description: "白猫贷是依托于大数据等技术手段,实现借贷服务全流程线上完成的金融平台,主要服务于有较大额资金需求的人群。该产品，主要用于早期的贷款超市",
        results: []
    }

    content.forEach(function (value) {

        if (value.url.indexOf(obj1.title) != -1){

            obj1.results.push(value)
        }

        if (value.url.indexOf(obj2.title) != -1){

            obj2.results.push(value)
        }

        if (value.url.indexOf(obj3.title) != -1){

            obj3.results.push(value)
        }
    })

    const res = JSON.stringify([obj1,obj3,obj2])

    var w_data = new Buffer(res);

    fs.writeFile("json/results.json", w_data, {flag: 'w'}, function (err) {
        if(err) {
            console.error(err);
        } else {
            console.log('写入成功');
        }
    });
}

HANDPATH("images/");
WriteToJson();
