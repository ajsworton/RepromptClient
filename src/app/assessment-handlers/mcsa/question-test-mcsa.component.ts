import { QuestionMarker } from "app/_models/question-marker.type"
import { Component, EventEmitter, Output, Input } from "@angular/core"
import { ContentItemModel } from "app/_models/content-item.model"
import { QuestionModel } from "app/_models/question.model"
import { QuestionAssessor } from "app/_models/question-assessor.type"

@Component({
    selector: 'question-test-mcsa',
    templateUrl: 'question-test-mcsa.component.html'
})
export class QuestionTestMCSA implements QuestionAssessor  {
    @Input() question: QuestionModel
    @Output() marked: EventEmitter<number> = new EventEmitter<number>()

    selectedAnswer: number

    mark(): number {
        let answer = this.question.answers.find(ans => ans.id == this.selectedAnswer)
        return answer.correct ? 1 : this.getNegScore()
    }

    getNegScore() {
        return -(1 / this.question.answers.length)
    }

    submit() {        
        let score = this.mark()
        this.marked.emit(score)
    }

}