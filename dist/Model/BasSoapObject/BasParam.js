"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasParam = void 0;
class BasParam {
    static GetValue(basParam) {
        switch (basParam.DataType) {
            case "basParamInt":
                return basParam.IntVal;
            case "basParamString":
                return basParam.StrVal;
            case "basParamFloat":
                return basParam.FloatVal;
            case "basParamDateTime":
                return basParam.DateTimeVal;
            case "basParamBool":
                return basParam.BoolVal;
            default:
                return basParam.StrVal;
        }
    }
    static GetValueStr(basParam) {
        let valueResult;
        if (basParam == null)
            return "NULL";
        valueResult = String(BasParam.GetValue(basParam));
        if (basParam.IsNull)
            return "NULL";
        /*      if (valueResult instanceof Date)
                return valueResult.format(BAS_DATETIME_FMT);
              else if (Boolean.)
                return valueResult ? "true" : "false";*/
        return valueResult;
    }
    constructor(name, dataType, value) {
        this.Name = name;
        this.DataType = dataType;
        this.IsNull = false;
        switch (dataType) {
            case "basParamInt":
                this.IntVal = value;
                break;
            case "basParamString":
                this.StrVal = value;
                break;
            case "basParamFloat":
                this.FloatVal = value;
                break;
            case "basParamDateTime":
                if (value != null) {
                    this.DateTimeVal = value;
                }
                else
                    this.DateTimeVal = null;
                break;
            case "basParamBool":
                this.BoolVal = value;
                break;
            default:
            //throw new Exception("Unsupported type: " . $dataType);
        }
    }
    static CreateInt(name, value) {
        return new BasParam(name, "basParamInt", value);
    }
    static CreateString(name, value) {
        return new BasParam(name, "basParamString", value);
    }
    static CreateFloat(name, value) {
        return new BasParam(name, "basParamFloat", value);
    }
    static CreateDateTime(name, value) {
        return new BasParam(name, "basParamDateTime", value);
    }
    static CreateDateTimeFmt(name, format, value) {
        /*      let d = new DatePipe();
        
              date = ::createFromFormat(format, value);
              if (!date)
                throw new Exception("Invalid date: " . value . ". Format: " . format);*/
        return new BasParam(name, "basParamDateTime", Date.now());
    }
    static CreateBool(name, value) {
        return new BasParam(name, "basParamBool", value);
    }
    static StrToSoapVar(basParam) {
        return `<BoolVal xsi:nil="true"/><DateTimeVal xsi:nil="true"/><FloatVal xsi:nil="true"/><IntVal xsi:nil="true"/>
            <StrVal xsi:type="xsd:string">${basParam.StrVal}</StrVal>`;
    }
    static BoolToSoapVar(basParam) {
        return `<BoolVal xsi:type="xsd:boolean">${basParam.BoolVal}</BoolVal><DateTimeVal xsi:nil="true"/><FloatVal xsi:nil="true"/><IntVal xsi:nil="true"/>
        <StrVal xsi:nil="true"/>`;
    }
    static IntToSoapVar(basParam) {
        return `<BoolVal xsi:nil="true"/><DateTimeVal xsi:nil="true"/><FloatVal xsi:nil="true"/><IntVal xsi:type="xsd:long">${basParam.IntVal}</IntVal>
        <StrVal xsi:nil="true"/>`;
    }
    static DateToSoapVar(basParam) {
        return `<BoolVal xsi:nil="true"/><DateTimeVal xsi:type="xsd:dateTime">${basParam.DateTimeVal}</DateTimeVal><FloatVal xsi:nil="true"/><IntVal xsi:nil="true"/>
        <StrVal xsi:nil="true"/>`;
    }
    static ToSoapVar(basParam) {
        let attrs = `<item xsi:type="ns1:BasParam"><Name xsi:type="xsd:string">${basParam.Name}</Name>`;
        attrs += `<DataType xsi:type="ns1:BasParamDataType">${basParam.DataType}</DataType><IsNull xsi:type="xsd:boolean">${basParam.IsNull}</IsNull>`;
        switch (basParam.DataType) {
            case "basParamInt":
                attrs += BasParam.IntToSoapVar(basParam);
                break;
            case "basParamString":
                attrs += BasParam.StrToSoapVar(basParam);
                break;
            case "basParamFloat":
                attrs += BasParam.StrToSoapVar(basParam);
                break;
            case "basParamDateTime":
                attrs += BasParam.DateToSoapVar(basParam);
                break;
            case "basParamBool":
                attrs += BasParam.BoolToSoapVar(basParam);
                break;
            default:
                attrs += BasParam.StrToSoapVar(basParam);
                break;
        }
        attrs += `</item>`;
        return attrs;
    }
}
exports.BasParam = BasParam;
