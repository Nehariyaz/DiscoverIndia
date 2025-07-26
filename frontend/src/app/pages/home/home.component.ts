import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HcarouselComponent } from "../../ui/hcarousel/hcarousel.component";
import { ActivityCarousalComponent } from "../../ui/activity-carousal/activity-carousal.component";


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],  // <-- fix here, plural 'styleUrls'
  imports: [HcarouselComponent, ActivityCarousalComponent]
})
export class HomeComponent {
  
  toggleMute(video: HTMLVideoElement): void {
    video.muted = !video.muted;
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: { items: 1 },
      400: { items: 1 },
      740: { items: 1 },
      940: { items: 1 }
    },
    nav: true
  }
  
  caros = [
    {
      id: 1,
      name: "New Delhi",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/humayuns-tomb-delhi-1-attr-hero?qlt=82&ts=1727352156717",
    },
    {
      id: 2,
      name: "assam",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/jagannath-temple-dibrugarh-assam-3-attr-hero?qlt=82&ts=1726741595995",
    },
    {
      id: 3,
      name: "gujarat",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/2-pavagadh-temple-gujarat-state-hero2?qlt=82&ts=1726733709050",
    },
    {
      id: 4,
      name: "himachal pradesh",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/sangla-valley-shimla-himachal-pradesh-5-attr-hero?qlt=82&ts=1727352616679",
    },
    {
      id: 5,
      name: "rajasthan",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/hawa-mahal-jaipur-rajasthan-city-1-hero?qlt=82&ts=1726660605161",
    },
    {
      id: 6,
      name: "kerala",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/1-jatayu-rock-kumarakom-kerala-2-city-hero?qlt=82&ts=1726672494503",
    },
    {
      id: 7,
      name: "Goa",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/1-palolem-beach-goa-goa-city-hero?qlt=82&ts=1726735654599",
    }
  ];

  data: any;
}
