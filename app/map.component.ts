import { Component, OnInit } from '@angular/core';
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }		from '@angular/http';

import { EventService } from './event.service';
import { Event } from './event';
import 'rxjs/Rx';

import { Iso8601ToDatePipe } from './iso8601.pipe';

@Component({
	selector: 'map',
	templateUrl: 'map.component.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [EventService, Iso8601ToDatePipe]
})
export class MapComponent implements OnInit {
	events: Event[];
	myLatlng = {lat: 51.163 , lng: 10.447};
	map: string = "";
	locations:string[][];
	i: number = 0;

	
	constructor(private eventService: EventService, private router: Router) { 
		this.locations = [];
		this.map = "";
	}

	getEvents() {
		this.i = 0;
		this.eventService.getEvents().subscribe(events => {
			this.events = events;	
		
			for(var item of this.events.data){
				if(item.location != null) {
					var string = item.location.split(",",2);
					console.log(item.location);
					console.log(string);
					this.locations[this.i] = [];
					this.locations[this.i][0] = new google.maps.LatLng(parseFloat(string[0]),parseFloat(string[1]));
					console.log(this.myLatLng);
					let date = new Iso8601ToDatePipe().transform(item.date);
					let deadline = new Iso8601ToDatePipe().transform(item.deadline);
					
					this.locations[this.i][1] = '<div id="content">'+
						'<div id="siteNotice">'+
						'</div>'+
						'<h1 id="firstHeading" class="firstHeading">'+item.title+'</h1>'+
						'<div id="bodyContent">'+
						'<table style="width: 300px"><tr><td><p><b>Datum: </b></p></td><td><p class="pull-right">'+ date + '</p></td></tr>' +
						'<tr><td><p><b>Anmeldefrist: </b></p></td><td><p class="pull-right">'+ deadline + '</p></td></tr></table>' +
						'<a class="pull-right" href="/event/detail/'+item.id+'">'+
						'mehr Details</a> '+
						'</div>'+
						'</div>';
						
					this.locations[this.i][2] = item.title;
					this.locations[this.i][3] = item.id;
					this.i++;
				}
			}
			
			var pinColor = "0066FF";
			var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
				new google.maps.Size(21, 34),
				new google.maps.Point(0,0),
				new google.maps.Point(10, 34));
			
			var infowindow = new google.maps.InfoWindow();

			var marker, i, content;

			for (i in this.locations) {	
				marker = new google.maps.Marker({
					position: this.locations[i][0],
					map: this.map
					title: this.locations[i][2],
					icon: pinImage
				});
				console.log(this.locations[i][1]);
				content = this.locations[i][1];
				
				google.maps.event.addListener(marker, 'click', (function(marker, i, content) {
					return function() {
						infowindow.setContent(content);
						infowindow.open(this.map, marker);
					}
				})(marker, i, content));
			}
		});
		
		
	}

	ngOnInit() {
		this.getEvents();
		var myOptions = {
				zoom: 7,
				center: {lat: 51.163 , lng: 10.447},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
		this.map = new google.maps.Map(document.getElementById('map'), myOptions);
	}

	onSelect(event: Event) { 
		this.selectedEvent = event;
	}
}
