import { BasParam } from "./BasParam";

export class BasParams {

    private Items !: Array<BasParam>;

    constructor ()
    {
        this.Items = new Array<BasParam>;
    }

    
    public AddInt(name: string, value: number): void
    {
        this.Items.push(BasParam.CreateInt(name, value));
    }
    
    public AddStr(name: string, value: string): void
    {
        this.AddString(name, value);
    }

    public AddString(name: string, value: string): void
    {
        this.Items.push(BasParam.CreateString(name, value));
    }

    public AddFloat(name: string, value: number): void
    {
        this.Items.push(BasParam.CreateFloat(name, value));
    }
    
    public AddDateTime(name: string, value: Date): void
    {
        this.Items.push(BasParam.CreateDateTime(name, value));
    }

    public AddDateTimeFmt(name: string, format: string, value: Date): void
    {
        this.Items.push(BasParam.CreateDateTimeFmt(name, format, value));
    }

    public AddStrDate(name: string, value: string): void
    {
        this.Items.push(BasParam.CreateDateTime(name, value));
    }

    public AddBool(name: string, value: boolean): void 
    {
        this.Items.push(BasParam.CreateBool(name, value));
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
    
    public ToSoapVar(): string
    {
      let basItems: string;"ns1:BasParam[1]"
      basItems = `<params xsi:type="ns1:BasParams"><Items SOAP-ENC:arrayType="ns1:BasParam[${this.Items.length}]"  xsi:type="SOAP-ENC:Array">`;
      for (let i = 0; i < this.Items.length; i++)
      {
        basItems += BasParam.ToSoapVar(this.Items[i]);
      }
      basItems += '</Items></params>'
      return basItems;
    }
}