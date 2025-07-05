

export class BasParam {

    public  Name !: string;
    public DataType !: string;
    public IsNull !: boolean;
    public BoolVal !: boolean;
    public DateTimeVal !: Date | null | string;
    public FloatVal !: number;
    public IntVal !: number;
    public StrVal !: string;

    public static GetValue(basParam: BasParam): any {
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



    public static GetValueStr(basParam: BasParam): any {
        let valueResult: string;
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

    constructor(name: string, dataType: string, value: any) {
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
                    this.DateTimeVal = null
                break;
            case "basParamBool":
                this.BoolVal = value;
                break;
            default:
            //throw new Exception("Unsupported type: " . $dataType);
        }
    }

    public static CreateInt(name: string, value: any): any {
        return new BasParam(name, "basParamInt", value);
    }

    public static CreateString(name: string, value: any): any {
        return new BasParam(name, "basParamString", value);
    }

    public static CreateFloat(name: string, value: any): any {
        return new BasParam(name, "basParamFloat", value);
    }

    public static CreateDateTime(name: string, value: any): any {
        return new BasParam(name, "basParamDateTime", value);
    }

    public static CreateDateTimeFmt(name: string, format: string, value: any): any {
        /*      let d = new DatePipe();
        
              date = ::createFromFormat(format, value);
              if (!date)
                throw new Exception("Invalid date: " . value . ". Format: " . format);*/
        return new BasParam(name, "basParamDateTime", Date.now());
    }

    public static CreateBool(name: string, value: any): any {
        return new BasParam(name, "basParamBool", value);
    }

    public static StrToSoapVar(basParam: BasParam): string {

        return `<BoolVal xsi:nil="true"/><DateTimeVal xsi:nil="true"/><FloatVal xsi:nil="true"/><IntVal xsi:nil="true"/>
            <StrVal xsi:type="xsd:string">${basParam.StrVal}</StrVal>`;
    }

    public static BoolToSoapVar(basParam: BasParam): string {

        return `<BoolVal xsi:type="xsd:boolean">${basParam.BoolVal}</BoolVal><DateTimeVal xsi:nil="true"/><FloatVal xsi:nil="true"/><IntVal xsi:nil="true"/>
        <StrVal xsi:nil="true"/>`;
    }

    public static IntToSoapVar(basParam: BasParam): string {

        return `<BoolVal xsi:nil="true"/><DateTimeVal xsi:nil="true"/><FloatVal xsi:nil="true"/><IntVal xsi:type="xsd:long">${basParam.IntVal}</IntVal>
        <StrVal xsi:nil="true"/>`;
    }
    public static DateToSoapVar(basParam: BasParam): string {

        return `<BoolVal xsi:nil="true"/><DateTimeVal xsi:type="xsd:dateTime">${basParam.DateTimeVal}</DateTimeVal><FloatVal xsi:nil="true"/><IntVal xsi:nil="true"/>
        <StrVal xsi:nil="true"/>`;
    }
    public static ToSoapVar(basParam: BasParam): string {
        let attrs: string = `<item xsi:type="ns1:BasParam"><Name xsi:type="xsd:string">${basParam.Name}</Name>`;
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
        return attrs
    }
}