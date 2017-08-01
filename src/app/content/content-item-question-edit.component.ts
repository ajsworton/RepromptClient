import { Component, ComponentFactoryResolver, ViewChild, Type, ViewContainerRef, Output, EventEmitter, Input } from "@angular/core"
import { QuestionHandler } from "app/_models/question-handler.type";
import { QuestionEditSort } from "app/content/question-handlers/question-edit-sort.component";
import { QuestionEditMCSA } from "app/content/question-handlers/question-edit-mcsa.component";
import { QuestionEditService } from "app/_services/question-edit.service";
import { ContentItemModel } from "app/_models/content-item.model";
import { QuestionModel } from "app/_models/question.model";

@Component({
    selector: 'content-item-question-edit',
    templateUrl: 'content-item-question-edit.component.html',
    providers: [QuestionEditService]
})
export class ContentItemQuestionEditComponent {
    questionTypes: any[]
    questionType: string  
    @ViewChild("host", {read: ViewContainerRef}) host: ViewContainerRef
    @Input() contentItem: ContentItemModel = new ContentItemModel({})
    @Input() question: QuestionModel = new QuestionModel({})
    mode = 'Create'
    subscribed
    @Output() saved = new EventEmitter<QuestionModel>()


    constructor(private componentFactoryResolver: ComponentFactoryResolver, private service: QuestionEditService){}

    ngOnInit() {
        this.questionTypes = this.service.getQuestionHandlers()
        if(this.questionTypes.length > 0) {
            this.questionType = this.questionTypes[0].code
            this.loadComponent()
        }

        this.mode = (this.question.id && this.question.id > 0) ? 'Edit' : 'Create'
    }

    ngOnDestroy() {
        this.subscribed.unsubscribe()
    }

    loadComponent() {        
        let selected = this.questionTypes.find(qc => qc.code == this.questionType)
        let factory = this.componentFactoryResolver.resolveComponentFactory(selected.component)        
        this.host.clear()
        let componentRef = this.host.createComponent(factory);
        
        (<QuestionHandler>componentRef.instance).contentItem = this.contentItem;
        (<QuestionHandler>componentRef.instance).question = this.question;
        this.subscribed = (<QuestionHandler>componentRef.instance).saved.subscribe(event => {
            this.saved.emit(event)
        })
    }

    onSelectChange() {
        this.loadComponent()
    }
}