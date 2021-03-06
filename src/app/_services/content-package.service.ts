import { Injectable } from "@angular/core";
import { Response, RequestOptions, Headers } from "@angular/http"
import { Observable } from 'rxjs/Rx'
import { Paths } from "../app.paths"
import { AuthHttp } from 'angular2-jwt'
import { CohortMemberModel } from "app/_models/cohort-member.model"
import { FileContainer } from "app/_models/file-container.model"
import { ContainerService } from "app/_services/container.service.type"
import { CohortModel } from "app/_models/cohort.model"
import { UserModel } from "app/_models/user.model"
import { ContentFolderModel } from "app/_models/content-folder.model"
import { ContentPackageModel } from "app/_models/content-package.model"
import { ContentItemModel } from "app/_models/content-item.model"
import { AuthService } from "app/_services/auth.service"
import { QuestionModel } from "app/_models/question.model"
import { CommonLibsService } from "app/_services/common.libs.service"

@Injectable()
export class ContentPackageService {    
    private path = new Paths
    private packageGetPath = '/api/content/package/'
    private itemGetPath = '/api/content/item/'
    private itemGetAllPath = '/api/content/folders/owned'
    private questionGetPath = '/api/content/question/'
    private answerGetPath = '/api/content/answer/'
    private multipartHeader = new Headers({ 'Content-Type': 'multipart/mixed', 'What': 'testing' })

    constructor(private authHttp: AuthHttp, private auth: AuthService) {
    }

    /**
     * Get a specific content package by Id
     * 
     * @param {number} contentId 
     * @returns {Observable<any>} 
     * @memberof ContentPackageService
     */
    get(packageId: number): Observable<any> {
        return this.authHttp.get(this.path.getUrl(this.packageGetPath) + packageId)
                            .timeout(CommonLibsService.timeout)
                            .map(CommonLibsService.handlePackage)
                            .catch(CommonLibsService.handleError)
    }

    /**
     * Get all items for the current content package
     * 
     * @returns {Observable<any>} 
     * @memberof ContentPackageService
     */
    getItem(itemId: number): Observable<any> {
        return this.authHttp.get(this.path.getUrl(this.itemGetPath) + itemId)
                            .timeout(CommonLibsService.timeout)
                            .map(CommonLibsService.handleItem)
                            .catch(CommonLibsService.handleError)
    }

    /**
     * save a content package
     * 
     * @param {ContentItemModel} pkg 
     * @returns 
     * @memberof ContentItemModel
     */
    save(pkg: ContentItemModel) {
        return this.authHttp.post(this.path.getUrl(this.packageGetPath), pkg)
                            .timeout(CommonLibsService.timeout)
                            .map(CommonLibsService.handlePackage)
                            .catch(CommonLibsService.handleError)
    }

    /**
     * save a content package. Had to fallback to using XMLHttpRequest directly as Angular 4 
     * kept overriding the Content-Type header, preventing the multipart/mixed upload
     * 
     * @param {FormData} pkg 
     * @returns 
     * @memberof ContentPackageService
     */
    saveItem(item: FormData) {
        
        let xhr = new XMLHttpRequest()
        xhr.open("POST", this.path.getUrl(this.itemGetPath), true)
        xhr.setRequestHeader("X-Auth-Token", this.auth.getToken())
        xhr.send(item)

        return Observable.create( (observer) => {
            
            //code based on https://stackoverflow.com/questions/44085756/how-to-return-observable-from-xhr 
            // accessed 29/07/2017, author: users/310726/martin
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        observer.next(JSON.parse(xhr.response))
                        observer.complete()
                    } else {
                        observer.error(xhr.response);
                    }
                }

                return () => {
                    xhr.abort()
                }
            }
            
        })
        
    }

    saveQuestion(question: QuestionModel) {
        return this.authHttp.post(this.path.getUrl(this.questionGetPath), question)
                            .timeout(CommonLibsService.timeout)
                            .map(CommonLibsService.handleQuestion)
                            .catch(CommonLibsService.handleError)
    }

    /**
     * delete a content package by id
     * 
     * @param {number} cohortId 
     * @returns 
     * @memberof ContentPackageService
     */
    delete(packageId: number) {
        return this.authHttp.delete(this.path.getUrl(this.packageGetPath) + packageId)
                            .timeout(CommonLibsService.timeout)
                            .map(res => res.json())
                            .catch(CommonLibsService.handleError)
    }     


    deleteItem(itemId: number) {
        return this.authHttp.delete(this.path.getUrl(this.itemGetPath) + itemId)
                            .timeout(CommonLibsService.timeout)
                            .map(res => res.json())
                            .catch(CommonLibsService.handleError)
    }

    deleteQuestion(questionId: number){
        return this.authHttp.delete(this.path.getUrl(this.questionGetPath) + questionId)
                            .timeout(CommonLibsService.timeout)
                            .map(res => res.json())
                            .catch(CommonLibsService.handleError)
    }

    deleteAnswer(answerId: number){
        return this.authHttp.delete(this.path.getUrl(this.answerGetPath) + answerId)
                            .timeout(CommonLibsService.timeout)
                            .map(res => res.json())
                            .catch(CommonLibsService.handleError)
    }    

}