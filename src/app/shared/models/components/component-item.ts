
export class ComponentItem {
    [key: string]: any;
    id: string;
    name: string;
    activity: any;
    override: boolean;
    activityInputs: Array<any>;
    class: string;
    data: any;
    html: string;
    // inputs: {};
    inputs: { 'input_1': { 'connections': [] } };
    outputs: {
        'output_1': {
            'connections': [{
                "node": string,
                "output": string
            }]
        }
    };
    typenode: boolean;
    pos_x: number;
    pos_y: number;
    result: any;
    attempt: number;

    constructor(obj?: {
        name?: string,
        override?: boolean,
        activityInputs?: Array<any>,
        class?: string,
        data?: any,
        html?: string,
        id?: string,
        inputs?: { 'input_1': { 'connections': [] } },
        outputs?: {
            'output_1': {
                'connections': [{
                    "node": string,
                    "output": string
                }]
            }
        },
        typenode?: boolean,
        pos_x?: number;
        pos_y?: number;
    }) {

        const {
            name,
            override,
            activityInputs,
            class: objClass,
            data,
            html,
            id,
            inputs,
            outputs,
            typenode,
            pos_x,
            pos_y
        } = obj || {};

        this.class = objClass || '';
        this.data = data || {};
        this.html = html || '';
        this.id = id || '';
        this.inputs = inputs || { 'input_1': { 'connections': [] } };
        this.outputs = outputs || { 'output_1': { 'connections': [{ "node": "string", "output": "string" }] } };
        this.name = name || '';
        this.override = override || false;
        this.activityInputs = activityInputs || new Array<any>;
        this.typenode = typenode || false;
        this.pos_x = pos_x || 0;
        this.pos_y = pos_y || 0;
    }
}
