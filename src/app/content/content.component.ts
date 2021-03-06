import { Component } from '@angular/core'
import { ContentService } from 'app/_services/content.service';
import { ContentPackageModel } from 'app/_models/content-package.model';
import { ContentFolderModel } from 'app/_models/content-folder.model';
import { FileElement } from 'app/_models/file-element.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'content',
    templateUrl: './content.component.html',
    providers: [ContentService]
})
export class ContentComponent {
    title = 'Content Management';
    elementType = ContentPackageModel;
    containerType = ContentFolderModel;
    itemIcon = 'note';
    populateMode = 'create';
    itemName = 'Package';
    navigationId: number = null;
    alive = true;


    constructor(public service: ContentService, private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.params
        .takeWhile(() => this.alive)
        .subscribe((params: ParamMap) => {
            this.navigationId = params['id']
        })
    }

    ngOnDestroy() {
        this.alive = false
    }

    elementSelected(element: FileElement) {
        this.router.navigate(['content/package/' + element.id])
    }

}
