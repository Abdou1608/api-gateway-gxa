"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasParams = void 0;
const BasParam_1 = require("./BasParam");
class BasParams {
    constructor() {
        this.Items = new Array;
    }
    AddInt(name, value) {
        this.Items.push(BasParam_1.BasParam.CreateInt(name, value));
    }
    AddStr(name, value) {
        this.AddString(name, value);
    }
    AddString(name, value) {
        this.Items.push(BasParam_1.BasParam.CreateString(name, value));
    }
    AddFloat(name, value) {
        this.Items.push(BasParam_1.BasParam.CreateFloat(name, value));
    }
    AddDateTime(name, value) {
        this.Items.push(BasParam_1.BasParam.CreateDateTime(name, value));
    }
    AddDateTimeFmt(name, format, value) {
        this.Items.push(BasParam_1.BasParam.CreateDateTimeFmt(name, format, value));
    }
    AddStrDate(name, value) {
        this.Items.push(BasParam_1.BasParam.CreateDateTime(name, value));
    }
    AddBool(name, value) {
        this.Items.push(BasParam_1.BasParam.CreateBool(name, value));
    }
    /*    public function GetByName($name)
        {
          foreach ($this->Items as $item)
          {
            if (strcasecmp($item->Name, $name) == 0)
              return $item;
          }
          throw new Exception("Value not found. Name: " . $name);
        }
        */
    ToSoapVar() {
        let basItems;
        "ns1:BasParam[1]";
        basItems = `<params xsi:type="ns1:BasParams"><Items SOAP-ENC:arrayType="ns1:BasParam[${this.Items.length}]"  xsi:type="SOAP-ENC:Array">`;
        for (let i = 0; i < this.Items.length; i++) {
            basItems += BasParam_1.BasParam.ToSoapVar(this.Items[i]);
        }
        basItems += '</Items></params>';
        return basItems;
    }
}
exports.BasParams = BasParams;
