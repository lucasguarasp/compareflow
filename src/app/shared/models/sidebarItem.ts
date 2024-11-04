export class SidebarItem {
    public name: string;
    public iconClasses: string;
    public rota?: string | null;
    public badge?: Badge | null
    public children?: Array<SidebarItem> | null;
    public active?: boolean;
    public title?: string
    public queryParams?: any;


    constructor(name: string, iconClasses: string, rota?: string | null, badge?: Badge | null, children?: Array<SidebarItem> | null, title?: string, queryParams?: any) {
        this.name = name;
        this.iconClasses = iconClasses;
        this.rota = rota;
        this.badge = badge;
        this.children = children;
        this.title = title;
        this.queryParams = queryParams;
        this.active = false;
    }
}

export class Badge {
    public color: string;
    public text: string;

    constructor(color: string, text: string) {
        this.color = color;
        this.text = text;
    }
}