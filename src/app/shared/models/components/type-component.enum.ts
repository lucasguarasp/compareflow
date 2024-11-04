export enum TypeComponent {
    StartFlow = "startFlow",
    SubFlow = "subFlow",
    EndFlow = "endFlow",
    GoToFlow = "goToFlow",
    GoToStep = "goToStep",
    Request = "request",
    Response = "response",
    Mapper = "mapper",
    Filter = "filter",
    CallApi = "callApi",
    File = "file",
    Decision = "decision",
    BackToParent = "backToParent",
    Anotation = "anotation",
    SendMessage = "sendMessage",
    Wait = "wait"
}

export const icon = new Map<TypeComponent, string>([
    [TypeComponent.StartFlow, 'fa fa-play-circle'],
    [TypeComponent.SubFlow, 'fa fa-sitemap'],
    [TypeComponent.EndFlow, 'fa fa-stop-circle'],
    [TypeComponent.GoToFlow, 'fa fa-share'],
    [TypeComponent.GoToStep, 'fa fa-step-forward'],
    [TypeComponent.Request, 'fa fa-question'],
    [TypeComponent.Response, 'fa fa-arrow-circle-left'],
    [TypeComponent.Mapper, 'fa fa-exchange-alt'],
    [TypeComponent.Filter, 'fa fa-filter'],
    [TypeComponent.CallApi, 'fa fa-cloud'],
    [TypeComponent.File, 'fa fa-file-text'],
    [TypeComponent.Decision, 'fa fa-random'],
    [TypeComponent.BackToParent, 'fa fa-level-up-alt'],
    [TypeComponent.Anotation, 'fa fa-sticky-note'],
    [TypeComponent.SendMessage, 'fa fa-comment'],
    [TypeComponent.Wait, 'fa fa-hourglass-half']    
   
]);