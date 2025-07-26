import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-carousal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-carousal.component.html',
  styleUrls: ['./activity-carousal.component.scss']
})
export class ActivityCarousalComponent implements AfterViewInit {
  @ViewChild('carouselWrapper', { static: false }) carouselWrapper!: ElementRef<HTMLDivElement>;

  activities = [
    { name: 'Taj Mahal', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Taj-Mahal.jpg/640px-Taj-Mahal.jpg' },
    { name: 'Camel Safari', img: 'https://rajputanacabs.b-cdn.net/wp-content/uploads/2023/06/camel-safari-jaisalmer-rj.webp' },
    { name: 'Backwaters', img: 'https://www.indiantourmakers.com/wp-content/uploads/2023/07/Places-to-visit-in-Kerala-Top-Destinations-5.webp' },
    { name: 'Ganga Aarti', img: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/6f/12/a3.jpg' },
    { name: 'Holi Festival', img: 'https://media.istockphoto.com/id/1381030718/photo/barsana-holi-one-of-the-most-joyful-festival-of-india-this-is-birth-place-of-radha-lord.jpg?s=612x612&w=0&k=20&c=c0kcjHpSFJXg7F4D6s8Ez-7RWY3MjoIrwsiRQKScank=' },
    { name: 'Rajasthan Fort', img: 'https://cdn.kimkim.com/files/a/images/ff5478e8187d22713965a9294eb1df9fb7fcbc22/original-8575b02337523bb26c3593a62313bd75.jpg' },
    { name: 'Sundarbans Mangrove Forest', img: 'https://www.travelchhutichhuti.com/blog/wp-content/uploads/2020/11/Sundarban-National-Park.jpg' },
    { name: 'Ladakh Mountain Trek', img: 'https://lifeontheplanetladakh.com/wp-content/uploads/2024/08/IMG_6124.jpeg' },
    { name: 'Kerala Houseboat', img: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Kerala_Houseboat_%28191490747%29.jpeg' },
    { name: 'Rann of Kutch', img: 'https://www.rannutsav.net/wp-content/uploads/2024/12/White-rann-camel-ride.webp' },
    { name: 'Yoga Retreat', img: 'https://akm-img-a-in.tosshub.com/sites/gloss99/resources//embed/201806/ananda_061818032406.jpg' },
    { name: 'Elephant Festival', img: 'https://akm-img-a-in.tosshub.com/indiatoday/images/photogallery/201103/elephant-fest-2_032211094233.jpg?VersionId=Qw0afVF1jvFzG.plAY.lI.zMVbu6opai' }
  ];

  ngAfterViewInit() {
    const wrapper = this.carouselWrapper.nativeElement;

    // Scroll to start of original slides (skip duplicated ones)
    wrapper.scrollLeft = wrapper.scrollWidth / 2;

    wrapper.addEventListener('scroll', () => {
      // When scrollLeft reaches near the start or end of duplicated slides,
      // reset it to the middle (original slides start)
      const scrollLeft = wrapper.scrollLeft;
      const scrollWidth = wrapper.scrollWidth;
      const halfScroll = scrollWidth / 2;

      if (scrollLeft <= 0) {
        // Scrolled to (or past) start - reset to middle
        wrapper.scrollLeft = halfScroll;
      } else if (scrollLeft >= scrollWidth - wrapper.clientWidth) {
        // Scrolled to (or past) end - reset to middle
        wrapper.scrollLeft = halfScroll - wrapper.clientWidth;
      }
    });
  }
}
