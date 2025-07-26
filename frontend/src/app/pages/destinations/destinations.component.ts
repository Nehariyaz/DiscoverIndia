import { Component } from '@angular/core';
import { CardsComponent } from "../../ui/cards/cards.component";

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CardsComponent],
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.scss'
})
export class DestinationsComponent {
  
  states=[
    {
      "id": 1,
      "name": "Andhra Pradesh",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/varaha-lakshmi-narasimha-temple-buddhist-complex-visakhapatnam-andhra-pradesh-1-attr-hero?qlt=82&ts=1726744344834"
    },
    {
      "id": 2,
      "name": "Arunachal Pradesh",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/dzogchen-samtan-choeling-monastery-mechuka-arunachal-pradesh-city-3-hero?qlt=82&ts=1726742864732"
    },

    {
      "id": 3,
      "name": "Assam",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/jagannath-temple-dibrugarh-assam-3-attr-hero?qlt=82&ts=1726741595995"
    },
    {
      "id": 4,
      "name": "Bihar",
      "image":"https://s7ap1.scene7.com/is/image/incredibleindia/ruins-of-nalanda-state-hero1?qlt=82&ts=1726739922628"
    },
    {
      "id": 5,
      "name": "Chhattisgarh",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/2-chitrakote-jagdalpur-city-hero?qlt=82&ts=1726738436494"
    },
    {
      "id": 6,
      "name": "Goa",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/baga-beach-goa?qlt=82&ts=1726735656599"
    },
    {
      "id": 7,
      "name": "Gujarat",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/rukmini-devi-temple-city-hero?qlt=82&ts=1726734858314"
    },
    {
      "id": 8,
      "name": "Haryana",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/baoli-ghaus-ali-shah-gurugram-haryana-city-3-hero?qlt=82&ts=1726732785315"
    },
    {
      "id": 9,
      "name": "Himachal Pradesh",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/hidimba-temple-manali-himachal-pradesh-1-attr-hero?qlt=82&ts=1726730676784"
    },
    {
      "id": 10,
      "name": "Jharkhand",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/2-deori-temple-ranchi-jharkhand-deori-mandir-city-hero?qlt=82&ts=1726723880071"
    },
    {
      "id": 11,
      "name": "Karnataka",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/spirituality-murudeshwar-temple-gokarna1?qlt=82&ts=1726720935970jpg"
    },
    {
      "id": 12,
      "name": "Kerala",
      "image": "https://www.incredibleindia.gov.in/content/dam/incredible-india/images/kerala/kumarakom/city/kumarakom-backwaters-kumarakom-kerala-1-city-search-thumb.jpeg"
    },
    {
      "id": 13,
      "name": "Madhya Pradesh",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/gwalior-fort-gwalior-madhya-pradesh-city-1-hero?qlt=82&ts=1726675024634"
    },
    {
      "id": 14,
      "name": "Maharashtra",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/kopeshwar-temple-kolhapur-maharashtra-hero?qlt=82&ts=1726668992343"
    },
    {
      "id": 15,
      "name": "Manipur",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/2-manipur-state-museum-state-hero?qlt=82&ts=1726666507852"
    },
    {
      "id": 16,
      "name": "Meghalaya",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/double-decker-living-root-bridge-cherrapunjee-meghalaya-1-attr-hero?qlt=82&ts=1727354895991"
    },
    {
      "id": 17,
      "name": "Mizoram",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/champhai-churches-champhai-mizoram-2-attr-hero?qlt=82&ts=1726674796123"
    },
    {
      "id": 18,
      "name": "Nagaland",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/khonoma-village-kohima-nagaland-1-attr-hero?qlt=82&ts=1727012456749"
    },
    {
      "id": 19,
      "name": "Odisha",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/1-lingaraj-temple-bhubaneshwar-odisha-city-hero?qlt=82&ts=1726663559461"
    },
    {
      "id": 20,
      "name": "Punjab",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/golden-temple-punjab-hero?qlt=82&ts=1726662363452"
    },
    {
      "id": 21,
      "name": "Rajasthan",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/1-umaid-bhavan-jodhpur-rajasthan-city-hero?qlt=82&ts=1726661010066"
    },
    {
      "id": 22,
      "name": "Sikkim",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/gurudongmar-lake-mangan-sikkim-hero-hs?qlt=82&ts=1726655864214"
    },
    {
      "id": 23,
      "name": "Tamil Nadu",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/1-meenakshi-amman-temple-madurai-tamil-nadu-attr-hero?qlt=82&ts=1726654442664"
    },
    {
      "id": 24,
      "name": "Telangana",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/2-charminar_hyderabad_telangana-1-city-hero?qlt=82&ts=1726653248112"
    },
    {
      "id": 25,
      "name": "Tripura",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/rudrasagar-lake-melaghar-2-attr-hero?qlt=82&ts=1726651019295"
    },
    {
      "id": 26,
      "name": "Uttar Pradesh",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/ram-janmaboomi-ayodhya-uttar%20pradesh-1?qlt=82&ts=1726649833165"
    },
    {
      "id": 27,
      "name": "Uttarakhand",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/badrinath-temple-uttarakhand-state-hero?qlt=82&ts=1726647031134"
    },
    {
      "id": 28,
      "name": "West Bengal",
      "image": "https://s7ap1.scene7.com/is/image/incredibleindia/lord-buddha-statue-2-kalimpong-wb-city-hero?qlt=82&ts=1726645084728"
    }
  ]

  constructor() { }

getStates(){
  return this.states;
}

getStateByID(id:any){
  return this.states.find(states => states.id == id);
}


}
