
export class Flow {
    id: string;
    flowName: string;
    description: string;
    version: number;
    flowId: string;
    draw: string;
    tenants: Array<string>;
    createdAt: string;
    updatedAt: string;

    constructor(flowName?: string, flowId?: string, draw?: string, id?: string, version?: number, tenants?: Array<string>, description?: string, createdAt?: string, updatedAt?: string) {

        // this.id = id || crypto.randomUUID();
        this.id = flowId ? flowId : id || '';
        this.flowName = flowName || '';
        this.description = description || '';
        this.version = version || 0;
        this.draw = draw || ''
        this.tenants = tenants || [];
        this.createdAt = createdAt || '';
        this.updatedAt = updatedAt || '';
    }

    toJSON() {
        const flowData = {
            id: this.id,
            flowName: this.flowName,
            description: this.description,
            version: this.version,
            tenants: this.tenants,
            draw: this.draw
        };
        return JSON.stringify(flowData, null, 4);
    }
}
