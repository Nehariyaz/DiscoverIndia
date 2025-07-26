import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-hcarousel',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './hcarousel.component.html',
  styleUrl: './hcarousel.component.scss'
})
export class HcarouselComponent {
  states = [
    { id: 1, name: 'ANDHRA PRADESH', img: 'https://s7ap1.scene7.com/is/image/incredibleindia/1-veerabhadra-swamy-temple-telangana-andhra-pradesh-state-hero?qlt=82&ts=1726744221624' },
    { id: 2, name: 'ARUNACHAL PRADESH', img: 'https://s7ap1.scene7.com/is/image/incredibleindia/giant-budhha-statue-tawang-arunachal-pradesh-2-attr-hero?qlt=82&ts=1726743111236' },
    { id: 3, name: 'ASSAM', img: 'https://s7ap1.scene7.com/is/image/incredibleindia/green-tea-plantation-dibrugarh-assam-city-1-hero?qlt=82&ts=1726741524002' },
    { id: 4, name: 'BIHAR', img: 'https://s7ap1.scene7.com/is/image/incredibleindia/80-feet-buddha-gaya-1-attr-hero?qlt=82&ts=1726740773690' },
    { id: 5, name: 'CHATTISGARH', img: 'https://s7ap1.scene7.com/is/image/incredibleindia/2-chitrakote-jagdalpur-city-hero?qlt=82&ts=1726738436494' },
    { id: 6, name: 'GOA', img: 'https://s7ap1.scene7.com/is/image/incredibleindia/1-palolem-beach-goa-goa-city-hero?qlt=82&ts=1726735654599' },
    
  ];

}
