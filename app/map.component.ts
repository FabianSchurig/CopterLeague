import { Component, OnInit } from '@angular/core';
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }		from '@angular/http';

import { MapService } from './map.service';
import 'rxjs/Rx';

import { Iso8601ToDatePipe } from './iso8601.pipe';

@Component({
	selector: 'map',
	templateUrl: 'map.component.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [MapService, Iso8601ToDatePipe]
})
export class MapComponent implements OnInit {
	marker: Marker[];
	myLatlng = {lat: 51.163 , lng: 10.447};
	map: string = "";
	locations:string[][];
	i: number = 0;
	markers = [];
	

	
	constructor(private mapService: MapService, private router: Router) { 
		this.locations = [];
		this.marker = [];
		this.map = "";
	}
	
	gotoDetail(type: string, id:number) {
		if(type == 'pilot'){
			this.router.navigate(['PilotDetail', { id: id }]);
		}
		if(type == 'event'){
			this.router.navigate(['EventDetail', { id: id }]);
		}
		
	}

	getMarkers() {
		this.i = 0;
		this.mapService.getMarker().subscribe(marker => {
			this.marker = marker.data;	
		
			for(var item of this.marker){
				if(item.location != null) {
					console.log(item.location);
					this.locations[this.i] = [];
					this.locations[this.i][0] = new google.maps.LatLng(parseFloat(item.lat),parseFloat(item.lng));
					console.log(this.myLatLng);
					
					var string = '';
					if(item.type == 'pilot'){
						string = '<i class="fa fa-user" aria-hidden="true"></i>';
					}else if(item.type == 'event'){
						string = '<i class="fa fa-trophy" aria-hidden="true"></i>';
					}
					
					this.locations[this.i][1] = '<div id="content">'+
						'<div id="siteNotice">'+
						'</div>'+
						'<h2 id="firstHeading" class="firstHeading">'+string+' '+item.name+'</h1>'+
						'<div id="bodyContent">'+
						'<a class="pull-right" href="/'+item.type+'/detail/'+item.id+'">'+
						'mehr Details</a> '+
						'<button class="pull-right btn btn-primary" (click)="gotoDetail('+item.type+','+item.id+')">'+
						'mehr Details</button> '+
						'</div>'+
						'</div>';
						
					this.locations[this.i][2] = item.name;
					this.locations[this.i][3] = item.id;
					this.locations[this.i][4] = item.type;
					this.i++;
				}
			}
			
			var pinColorPilot = "0066FF";
			var pinImagePilot = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColorPilot,
				new google.maps.Size(21, 34),
				new google.maps.Point(0,0),
				new google.maps.Point(10, 34));
			
			var pinColorEvent = "66ffff";
			var pinImageEvent = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColorEvent,
				new google.maps.Size(21, 34),
				new google.maps.Point(0,0),
				new google.maps.Point(10, 34));
				
			var pinColorCustom = "00ff00";
			var pinImageCustom = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColorCustom,
				new google.maps.Size(21, 34),
				new google.maps.Point(0,0),
				new google.maps.Point(10, 34));
			
			var infowindow = new google.maps.InfoWindow();

			var marker, i, content; 

			for (i in this.locations) {	
				var pinImage;
				if(this.locations[i][4] == 'pilot'){
					pinImage = pinImagePilot;
				}else if(this.locations[i][4] == 'event'){
					pinImage = pinImageEvent;
				}else{
					pinImage = pinImageCustom;
				}
				marker = new google.maps.Marker({
					position: this.locations[i][0],
					map: this.map
					title: this.locations[i][2],
					icon: pinImage
				});
				this.markers.push(marker);
				console.log(this.locations[i][1]);
				content = this.locations[i][1];
				
				google.maps.event.addListener(marker, 'click', (function(marker, i, content) {
					return function() {
						infowindow.setContent(content);
						infowindow.open(this.map, marker);
					}
				})(marker, i, content));
			}
			var options = {
				imagePath: 'js-marker-clusterer/images/m'
			};

			var markerCluster = new MarkerClusterer(this.map, this.markers, options);
		});
		
		
	}

	ngOnInit() {
		this.getMarkers();
		var myOptions = {
				zoom: 7,
				center: {lat: 51.163 , lng: 10.447},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
		this.map = new google.maps.Map(document.getElementById('map'), myOptions);
	}
}
