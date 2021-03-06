import React,{Component} from'react'
// import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css';
import GC from '@grapecity/spread-sheets';
import {SpreadSheets, Worksheet, Column} from '@grapecity/spread-sheets-react';
import { Button, Modal } from "antd"
import * as spreadExcel from '@grapecity/spread-excelio';
import saveAs from 'file-saver';

GC.Spread.Common.CultureManager.culture("zh-cn");
class SpreadIoHome extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.hostStyle =
            {
                width: '1100px',
                height: '800px'
            };
    }

    workbookInitialized = (spread) => {
        this.spread = spread
        var mynamespace = {};
        (function () {
            function _SGS_() {
                this.name = "_SGS_";
                this.maxArgs = 4;
                this.minArgs = 1;
                this.description = () => {
                    return {
                        description:'自定义公式描述',
                        parameters:[
                            {name:"firstName",repetable:null},
                            {name:"Name",repetable:null},
                        ]
                    }
                }
                this.typeName = "mynamespace._SGS_";
            }
            _SGS_.prototype = new GC.Spread.CalcEngine.Functions.Function();
            _SGS_.prototype.evaluate = function (context,args1,args2) {
                var context = context
                var sheet = context.source.getSheet()
                console.log("this.str====",this.str)
                console.log("args1==="+args1+"===args2==="+args2)
                var jsonStr = sheet.getTag(0,0)
                return jsonStr[args1]+","+jsonStr[args2]
            };
            _SGS_.prototype.isContextSensitive = function(){ //添加此方法后，_SGS_.prototype.evaluate第一个参数就是context，通过context.source.getSheet()可以获取到当前公式所在的sheet
                return true
            }
            mynamespace._SGS_ = _SGS_;
        })();
        GC.Spread.CalcEngine.Functions.defineGlobalCustomFunction('_SGS_', new mynamespace._SGS_());
    }
    // Import Excel
    importFile = () => {
        var excelFile = document.getElementById("fileDemo").files[0];

        // Get an instance of IO class
        let excelIO = new spreadExcel.IO();
        excelIO.open(excelFile, (json) => {
            console.log(json)
            this.spread.fromJSON(json);
            let sheet = this.spread.getActiveSheet();
            let obj = {firstName:'raymond',name:'tony'}
            sheet.setTag(0,0,obj)
            sheet.recalcAll(true)//重新执行所有公式
        }, (e) => {
            console.log(e);
        });
    }

// Export Excel

    exportFile = () => {

        // Get an instance of IO class
        let excelIO = new spreadExcel.IO();
        let fileName = document.getElementById("exportFileName").value;
        if (fileName.substr(-5, 5) !== '.ssjson') {
            fileName += '.ssjson';
        }
        var toJson = this.spread.toJSON()
        var json = JSON.stringify(this.spread.toJSON());
        excelIO.save(json, (blob) => {
            saveAs(blob, fileName);
        }, (e) => {
            console.log(e);
        });

    }
    tagInfo = () => {
        let sheet = this.spread.getActiveSheet();
        let info = sheet.getTag(0,0)
        console.log("tagInfo===",info)
    }


    render(){
        return (
            <div>
                <input type="file" name="files[]" id="fileDemo" accept=".ssjson" />
                <input type="button" id="loadExcel" value="Import" onClick={this.importFile} />
                <input type="button" id="saveExcel" value="Export" onClick={this.exportFile} />
                <input type="text" id="exportFileName" placeholder="Export file name"  />
                <input type="button" id="inputInfo" value="打印Tag" onClick={this.tagInfo} />
                <SpreadSheets hostStyle={this.hostStyle} workbookInitialized={this.workbookInitialized}>
                    <Worksheet>
                    </Worksheet>
                </SpreadSheets>
            </div>
        )
    }
}

export default SpreadIoHome;
