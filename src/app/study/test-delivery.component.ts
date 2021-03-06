import { Component, ViewContainerRef, ViewChild, Input, ComponentFactoryResolver, Output, EventEmitter } from "@angular/core"
import { QuestionModel } from "app/_models/question.model"
import { QuestionTypeService } from "app/_services/question-type.service"
import { QuestionAssessor } from "app/_models/question-assessor.type"
import { AnswerModel } from "app/_models/answer.model"

@Component({
    selector: 'test-question',
    templateUrl: 'test-delivery.component.html',
})
export class TestDeliveryComponent {

    questionTypes: any[]
    questionType: string
    @ViewChild("host", {read: ViewContainerRef}) host: ViewContainerRef
    @Input() currentQuestion = new QuestionModel({})
    @Output() marked = new EventEmitter<number>()
    currentTestModule: QuestionAssessor
    subscribed

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private service: QuestionTypeService){}

    ngOnInit() {
        this.questionTypes = this.service.getQuestionAssessors()
        if(this.questionTypes.length > 0 && this.questionType) {
            this.loadComponent()
        }
    }

    loadComponent() {        
        let selected = this.questionTypes.find(qc => qc.code == this.questionType)
        let factory = this.componentFactoryResolver.resolveComponentFactory(selected.component)        
        this.host.clear()
        let componentRef = this.host.createComponent(factory)

        this.currentTestModule = <QuestionAssessor>componentRef.instance
        
        this.currentTestModule.question = this.currentQuestion
        this.subscribed = this.currentTestModule.marked.subscribe(event => {
            this.marked.emit(event)
        })
    }

    ngOnChanges() {
        if(this.currentTestModule != null) {
            if(this.questionType != this.currentQuestion.format) {
                this.questionType = this.currentQuestion.format
                this.loadComponent()
            } else {
                this.currentTestModule.question = this.currentQuestion
            }   
        } else {
            this.questionType = this.currentQuestion.format
        }
    }
}