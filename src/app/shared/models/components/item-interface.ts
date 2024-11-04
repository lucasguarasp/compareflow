export interface ItemInterface {
    id: string;
    name: string;
    data: any;
    class: string;
    html: string;
    typenode: boolean;
    inputs: { [key: string]: any };
    outputs: { [key: string]: { connections: { node: string; input?: string; output?: string }[] } };
    pos_x: number;
    pos_y: number;
}
