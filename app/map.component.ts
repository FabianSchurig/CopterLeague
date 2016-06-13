import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { HTTP_PROVIDERS }		from '@angular/http';

import { EventService } from './event.service';
import { Event } from './event';
import 'rxjs/Rx';

@Component({
	selector: 'map',
	templateUrl: 'map.component.html',
	providers: [EventService]
})
export class MapComponent implements OnInit {
	events: Event[];
	myLatlng = {lat: 51.163 , lng: 10.447};
	map;
	locations:string[][];
	i: number = 0;

	
	constructor(private eventService: EventService, private router: Router) { 
		this.locations = [];
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
					
					this.locations[this.i][1] = '<div id="content">'+
						'<div id="siteNotice">'+
						'</div>'+
						'<h1 id="firstHeading" class="firstHeading">'+item.title+'</h1>'+
						'<div id="bodyContent">'+
						'Adresse, Datum <a href="">'+
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
					map: map
					title: this.locations[i][2],
					icon: pinImage
				});
				console.log(this.locations[i][1]);
				content = this.locations[i][1];
				
				google.maps.event.addListener(marker, 'click', (function(marker, i, content) {
					return function() {
						infowindow.setContent(content);
						infowindow.open(map, marker);
					}
				})(marker, i, content));
			}
		});
	}

	ngOnInit() {
		this.getEvents();
		
		
		var myLatLng = {lat: 51.163 , lng: 10.447}; 
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 51.163 , lng: 10.447},
			zoom: 7
		});		
		
	}

	onSelect(event: Event) { 
		this.selectedEvent = event;
	}
}
