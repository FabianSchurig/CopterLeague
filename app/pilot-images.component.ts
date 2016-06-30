import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }		from '@angular/http';

import { Pilot } from './pilot';
import { PilotService } from './pilot.service';

import { isLoggedin, pilotId } from './is-loggedin';
import 'rxjs/Rx';

import { FILE_UPLOAD_DIRECTIVES, FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

@Component({
	selector: 'my-pilot-images',
	templateUrl: 'pilot-images.component.pug',
	directives: [FILE_UPLOAD_DIRECTIVES]
})
export class PilotImagesComponent implements OnInit {
	@Input() pilot: Pilot;
	@Output() onGoBack = new EventEmitter<boolean>();
	error = false;
	submitted = false;
	@Input()    ;
	id: number = pilotId();
	errorMessage = '';
	public uploader:FileUploader = new FileUploader({url: '/api/pilot/'+this.routeParams.get('id')+'/image'});
	personalImages = false;
	public hasBaseDropZoneOver:boolean = false;
	images = [];
	//selectedImages = [];
	selectedImage: string = '';
	
	public address: Object;
	
	token: string;

	constructor(
		private pilotService: PilotService,
		private routeParams: RouteParams
	) {
		//this.pilot = [];
		this.token = localStorage.getItem('token');
		var options:FileUploaderOptions = {};
		options.allowedFileType = 'image';
		options.authToken = 'Bearer '+this.token;
		//options.autoUpload = true;
		this.uploader.setOptions(options);
	}
	
	select(image: Object){
		for(var item of this.images){
			item.selected = false;
		}
		if(!image.selected){
			image.selected = true;
			//this.selectedImages.push(image.id);
			this.selectedImage = image.id;
			this.onGoBack.emit(this.selectedImage);
		}
		/*
		Multi image selection for later use
		else{
			image.selected = false;
			var index = this.selectedImages.indexOf(image.id, 0);
			if (index > -1) {
				this.selectedImages.splice(index, 1);
			}
		}
		console.log(this.selectedImages);
		*/
	}
	
	cancel(){
		this.onGoBack.emit('');
	}
	
	upload(){
		this.uploader.uploadAll();
		this.uploader.onCompleteAll = () => {
			console.log('finishedUpload');
			this.getImages();
		};
	}
	
	getImages(){
		this.images = [];
		let id = +this.routeParams.get('id');
		console.log(id);
		this.pilotService.getImages(id).subscribe(images => {
			if(images.data){
				this.images = images.data;
				console.log(this.images);
			}
			
		}, error =>	this.errorMessage = <any>error);
	}

	ngOnInit() {	
		this.id = pilotId();
		this.getImages();
	}
	
	public fileOverBase(e:any):void {
		this.hasBaseDropZoneOver = e;
	}

	goBack() {
		window.history.back();
	}
}