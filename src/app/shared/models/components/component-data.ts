export class ComponentData {
    data: {
        name: string;
        output: any;
    }

    public constructor(name: string, output: any) {
        this.data.name = name;
        this.data.output = output;
    }

}
