import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MultiCarousalComponent } from "../../ui/multi-carousal/multi-carousal.component";
import { StateService } from '../../services/state.service';
import { DestinationService } from '../../services/destination.service';

@Component({
  selector: 'app-single',
  standalone: true,
  imports: [CommonModule, MultiCarousalComponent],
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingleComponent implements OnInit {
  data: any;
  selectedAttraction: any = null;
  mapUrl: SafeResourceUrl | null = null;
  attractions: any;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private stateService: StateService,
    private destinationService: DestinationService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug'); // e.g. "varkala-beach"
    const routeState = history.state;
    const routeStateId = routeState?.stateId;
    const routePlaceData = routeState?.placeData;
    const routeStateIdFromParam = Number(this.route.snapshot.paramMap.get('id'));

    if (slug) {
      // Route: /destination/:slug
      this.destinationService.getAllDestinations().subscribe((destinations) => {
        const matched = destinations.find(d =>
          d.name?.toLowerCase().replace(/\s+/g, '-') === slug
        );

        if (matched) {
          this.selectedAttraction = matched;
          const derivedStateId = matched.stateId || routeStateId;
          if (derivedStateId) {
            this.loadState(derivedStateId);
          } else {
            console.warn('Destination found but no stateId');
          }
        } else {
          console.warn('No destination found for slug:', slug);
        }
      });
    } else if (routeStateIdFromParam) {
      // Route: /state/:id
      this.loadState(routeStateIdFromParam);

      if (routePlaceData) {
        this.selectedAttraction = routePlaceData;
      }
    } else {
      console.warn('No slug or stateId provided in route.');
    }
  }

  loadState(stateId: number): void {
    this.stateService.getStateById(stateId).subscribe((state) => {
      if (state) {
        this.data = state;
        if (state.coords) {
          this.mapUrl = this.getMapUrl(state.coords);
        }
      } else {
        console.warn('No data found for stateId:', stateId);
      }
    });
  }

  getMapUrl(coords: string): SafeResourceUrl {
    const url = `https://www.google.com/maps/embed?pb=${coords}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

states=[  {
    "id": 1,
    "name": "Andhra Pradesh",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/varaha-lakshmi-narasimha-temple-buddhist-complex-visakhapatnam-andhra-pradesh-1-attr-hero?qlt=82&ts=1726744344834",
    "text": "Andhra Pradesh is a treasure trove of cultural heritage and natural beauty, offering travelers a rich tapestry of experiences. Known for its fertile river basins of Krishna and Godavari, the state is a major hub of agriculture and ancient civilization. Visit Amaravati to witness magnificent Buddhist stupas and archaeological sites, explore the architectural marvel of Lepakshi's Veerabhadra Temple with its iconic hanging pillar, and enjoy pristine beaches along the Bay of Bengal. Andhra Pradesh also boasts vibrant festivals, delicious cuisine, and warm hospitality that make every journey unforgettable.",
    "coords": "1m18!1m12!1m3!1d3806.724272187695!2d83.218481!3d17.686816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3943e2c3e3e3e3%3A0x3e3e3e3e3e3e3e3e!2sVisakhapatnam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1712345678901!5m2!1sen!2sin"
  },
  {
    "id": 2,
    "name": "Arunachal Pradesh",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/dzogchen-samtan-choeling-monastery-mechuka-arunachal-pradesh-city-3-hero?qlt=82&ts=1726742864732",
    "text": "Nestled in the pristine Himalayas, Arunachal Pradesh captivates with its untouched landscapes and rich tribal culture. The state is a haven for eco-tourists and adventure seekers, offering dense forests, snow-capped peaks, and sacred rivers. Explore the living cultures of its diverse tribes, visit the iconic Tawang Monastery, and trek through its lush valleys. Arunachal Pradesh’s wildlife sanctuaries, crystal-clear rivers, and ancient traditions provide an immersive experience into the heart of nature and spirituality.",
    "coords": "1m18!1m12!1m3!1d3580.123456789!2d93.615685!3d27.084368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3740a1a1a1a1a1a1%3A0xa1a1a1a1a1a1a1a1!2sItanagar%2C%20Arunachal%20Pradesh!5e0!3m2!1sen!2sin!4v1712345678902!5m2!1sen!2sin"
  },
  {
    "id": 3,
    "name": "Assam",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/jagannath-temple-dibrugarh-assam-3-attr-hero?qlt=82&ts=1726741595995",
    "text": "Assam, the land of the mighty Brahmaputra River, offers a blend of rich biodiversity and vibrant cultural heritage. Famous for its sprawling tea gardens and wildlife sanctuaries such as Kaziranga National Park — a UNESCO World Heritage Site — Assam invites travelers to witness the rare one-horned rhinoceros and exotic birdlife. Dive into traditional festivals like Bihu, explore ancient temples and caves, and experience the warm hospitality and flavors of Assamese cuisine in this enchanting northeastern state.",
    "coords": "1m18!1m12!1m3!1d3562.123456789!2d91.789803!3d26.1433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5a5a5a5a5a5a%3A0xa5a5a5a5a5a5a5a5!2sDispur%2C%20Assam!5e0!3m2!1sen!2sin!4v1712345678903!5m2!1sen!2sin"
  },
  {
    "id": 4,
    "name": "Bihar",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/ruins-of-nalanda-state-hero1?qlt=82&ts=1726739922628",
    "text": "Bihar, the land of ancient wisdom and spiritual awakening, invites travelers to explore its remarkable historical and religious heritage. From the ruins of Nalanda University — one of the oldest universities in the world — to the sacred sites of Bodh Gaya where Buddha attained enlightenment, Bihar is steeped in profound history. Experience the cultural vibrancy of festivals like Chhath Puja, take a serene boat ride on the Ganges, and discover a landscape where spirituality and history blend seamlessly.",
    "coords": "1m18!1m12!1m3!1d3651.123456789!2d85.158875!3d25.612677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3a3a3a3a3a3a3a%3A0xa3a3a3a3a3a3a3a3!2sPatna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1712345678904!5m2!1sen!2sin"
  },
  {
    "id": 5,
    "name": "Chhattisgarh",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/2-chitrakote-jagdalpur-city-hero?qlt=82&ts=1726738436494",
    "text": "Chhattisgarh, with its lush forests and tribal heritage, offers an immersive experience for nature lovers and cultural enthusiasts. Discover breathtaking waterfalls like Chitrakote, often called the 'Niagara of India,' ancient temples steeped in history, and vibrant tribal festivals that showcase age-old traditions. The state’s wildlife sanctuaries and rich biodiversity make it a paradise for eco-tourism, inviting visitors to explore the heart of central India’s natural and cultural landscapes.",
    "coords": "1m18!1m12!1m3!1d3683.123456789!2d81.629997!3d21.250000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3a3a3a3a3a3a3a%3A0xa3a3a3a3a3a3a3a3!2sRaipur%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1712345678905!5m2!1sen!2sin"
  },
  {
    "id": 6,
    "name": "Goa",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/baga-beach-goa?qlt=82&ts=1726735656599",
    "text": "Goa, India’s premier beach destination, is synonymous with sun, sand, and sea. Known for its golden beaches like Baga and Anjuna, vibrant nightlife, and Portuguese heritage, Goa offers a delightful blend of relaxation and excitement. Explore historic churches such as Basilica of Bom Jesus, indulge in fresh seafood, or partake in water sports along the Arabian Sea. With lush hinterlands and spice plantations, Goa also appeals to those seeking tranquility and nature’s bounty beyond the coast.",
    "coords": "1m18!1m12!1m3!1d120438.70350715862!2d73.7504525!3d15.335005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb7d8a7db2fcb%3A0x9b148f178ca69de!2sGoa!5e0!3m2!1sen!2sin!4v1712345678901!5m2!1sen!2sin"
  },
  {
    "id": 7,
    "name": "Gujarat",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/rukmini-devi-temple-city-hero?qlt=82&ts=1726734858314",
    "text": "Gujarat offers an incredible journey through India's rich history, vibrant culture, and stunning landscapes. Home to the Rann of Kutch’s vast salt desert, the Gir National Park’s Asiatic lions, and architectural marvels like the Sun Temple at Modhera, Gujarat is a land of contrasts. Explore the UNESCO World Heritage site of Lothal from the Indus Valley Civilization, the Sabarmati Ashram of Mahatma Gandhi, and the colorful festivals that bring the state’s traditions alive throughout the year.",
    "coords": "1m18!1m12!1m3!1d12253.333!2d72.136230!3d22.309425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb7e7e7e7e7e7%3A0x7e7e7e7e7e7e7e7e!2sGujarat!5e0!3m2!1sen!2sin!4v1712345678902!5m2!1sen!2sin"
  },
  {
    "id": 8,
    "name": "Haryana",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/baoli-ghaus-ali-shah-gurugram-haryana-city-3-hero?qlt=82&ts=1726732785315",
    "text": "Haryana, known as the land of God, blends rich agricultural traditions with rapid industrial growth. Visitors can explore ancient archaeological sites, serene lakes, and vibrant rural fairs. Haryana is famous for its folk dances, historic forts, and spiritual centers like Kurukshetra, a sacred pilgrimage site connected to the Mahabharata epic. The state’s proximity to Delhi also makes it an accessible gateway to India’s heartland and cultural treasures.",
    "coords": "1m18!1m12!1m3!1d12253.333!2d76.040497!3d29.065773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb7e7e7e7e7e7%3A0x7e7e7e7e7e7e7e7e!2sHaryana!5e0!3m2!1sen!2sin!4v1712345678903!5m2!1sen!2sin"
  },
  {
    "id": 9,
    "name": "Himachal Pradesh",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/manali-himachal-pradesh-hero1?qlt=82&ts=1726731587454",
    "text": "Himachal Pradesh, nestled in the majestic Himalayas, is a paradise for adventure seekers and nature lovers. Known for its snow-capped peaks, verdant valleys, and tranquil hill stations like Shimla and Manali, it offers hiking, skiing, and spiritual retreats. Explore ancient temples, apple orchards, and vibrant tribal cultures. The state’s serene landscapes and crisp mountain air provide a rejuvenating escape from urban life.",
    "coords": "1m18!1m12!1m3!1d3550.123456789!2d77.166401!3d31.104815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3905b5b5b5b5b5b5%3A0xb5b5b5b5b5b5b5b5!2sShimla%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1712345678904!5m2!1sen!2sin"
  },
  {
    "id": 10,
    "name": "Jharkhand",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/baidyanath-temple-deoghar-jharkhand-city-hero?qlt=82&ts=1726731234123",
    "text": "Jharkhand is a land of dense forests, waterfalls, and tribal traditions. Known for the sacred Baidyanath Dham temple in Deoghar, one of the twelve Jyotirlingas, the state attracts pilgrims and nature lovers alike. Explore waterfalls like Hundru and Dassam, tribal art and crafts, and vibrant festivals. Jharkhand’s rich mineral wealth and cultural diversity make it an intriguing destination for travelers seeking both spirituality and adventure.",
    "coords": "1m18!1m12!1m3!1d3655.123456789!2d85.3294!3d23.3441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3985a5a5a5a5a5a5%3A0xa5a5a5a5a5a5a5a5!2sRanchi%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1712345678905!5m2!1sen!2sin"
  },
  {
    "id": 11,
    "name": "Karnataka",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/spirituality-murudeshwar-temple-gokarna1?qlt=82&ts=1726720935970",
    "text": "Karnataka, located in the southwestern region of India, is a state rich in cultural heritage and natural beauty. From the bustling tech hub of Bengaluru to the serene beaches of Gokarna, Karnataka offers a diverse array of experiences. The state is renowned for its historical sites like Hampi and Mysore Palace, as well as its lush landscapes in Coorg and the Western Ghats.",
    "coords": "1m18!1m12!1m3!1d12253.333!2d75.713890!3d15.317277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfb7e7e7e7e7e7%3A0x7e7e7e7e7e7e7e7e!2sKarnataka!5e0!3m2!1sen!2sin!4v1712345678906!5m2!1sen!2sin"
  },
{
    "id": 12,
    "name": "Kerala",
    "image": "https://www.incredibleindia.gov.in/content/dam/incredible-india/images/kerala/kumarakom/city/kumarakom-backwaters-kumarakom-kerala-1-city-search-thumb.jpeg",
    "text": "Known as 'God's Own Country', Kerala is famous for its serene backwaters, lush greenery, and rich cultural heritage.",
    "coords": "!1m18!1m12!1m3!1d191932.0440235671!2d76.1206523!3d10.8505154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0c7e71f21b7f7f%3A0xa7e7e7e7e7e7e7e7!2sKerala!5e0!3m2!1sen!2sin!4v1712345678906!5m2!1sen!2sin"
  },
  {
    "id": 13,
    "name": "Madhya Pradesh",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/gwalior-fort-gwalior-madhya-pradesh-city-1-hero?qlt=82&ts=1726675024634",
    "text": "Central India's Madhya Pradesh is known for its ancient forts, wildlife sanctuaries, and rich historical sites like Khajuraho temples.",
    "coords": "!1m18!1m12!1m3!1d263967.7848869434!2d77.7305157!3d23.4733249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981d3a482b1fbbb%3A0xb7e7e7e7e7e7e7e7!2sMadhya%20Pradesh!5e0!3m2!1sen!2sin!4v1712345678907!5m2!1sen!2sin"
  },
  {
    "id": 14,
    "name": "Maharashtra",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/kopeshwar-temple-kolhapur-maharashtra-hero?qlt=82&ts=1726668992343",
    "text": "Maharashtra is home to Mumbai, India's financial capital, and offers diverse attractions from beaches to ancient caves.",
    "coords": "!1m18!1m12!1m3!1d336875.8575823673!2d73.3181744!3d19.7514799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf7a3e9e7e7e%3A0xc7e7e7e7e7e7e7e7!2sMaharashtra!5e0!3m2!1sen!2sin!4v1712345678908!5m2!1sen!2sin"
  },
  {
    "id": 15,
    "name": "Manipur",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/2-manipur-state-museum-state-hero?qlt=82&ts=1726666507852",
    "text": "Manipur, in Northeast India, is famed for its classical dance, scenic Loktak Lake, and rich tribal culture.",
    "coords": "!1m18!1m12!1m3!1d28696.7679699924!2d93.8286498!3d24.663639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3740b8c06b6b6b6b%3A0xd7e7e7e7e7e7e7e7!2sManipur!5e0!3m2!1sen!2sin!4v1712345678909!5m2!1sen!2sin"
  },
  {
    "id": 16,
    "name": "Meghalaya",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/double-decker-living-root-bridge-cherrapunjee-meghalaya-1-attr-hero?qlt=82&ts=1727354895991",
    "text": "Meghalaya is known as the 'Abode of Clouds' and is famous for its living root bridges and heavy rainfall.",
    "coords": "!1m18!1m12!1m3!1d71220.67152236679!2d91.4821803!3d25.5788132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3745c578f1f1f1f1%3A0xe7e7e7e7e7e7e7e7!2sMeghalaya!5e0!3m2!1sen!2sin!4v1712345678910!5m2!1sen!2sin"
  },
  {
    "id": 17,
    "name": "Mizoram",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/champhai-churches-champhai-mizoram-2-attr-hero?qlt=82&ts=1726674796123",
    "text": "Mizoram is a hilly state known for its scenic beauty, vibrant festivals, and hospitable tribal communities.",
    "coords": "!1m18!1m12!1m3!1d61513.937058380875!2d92.5037932!3d23.1643262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374109d1d1d1d1d1%3A0xf7e7e7e7e7e7e7e7!2sMizoram!5e0!3m2!1sen!2sin!4v1712345678911!5m2!1sen!2sin"
  },
  {
    "id": 18,
    "name": "Nagaland",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/khonoma-village-kohima-nagaland-1-attr-hero?qlt=82&ts=1727012456749",
    "text": "Nagaland is famous for its diverse tribes, traditional festivals, and beautiful hilly landscapes.",
    "coords": "!1m18!1m12!1m3!1d87815.59784726208!2d94.1089636!3d26.1583675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37420e30e30e30e3%3A0x87e7e7e7e7e7e7e7!2sNagaland!5e0!3m2!1sen!2sin!4v1712345678912!5m2!1sen!2sin"
  },
 {
    "id": 19,
    "name": "Odisha",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/1-lingaraj-temple-bhubaneshwar-odisha-city-hero?qlt=82&ts=1726663559461",
    "text": "Odisha is famous for its ancient temples, vibrant tribal culture, and beautiful beaches along the Bay of Bengal.",
    "coords": "!1m18!1m12!1m3!1d181875.52309598335!2d84.7893887!3d20.9517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1c77c9c5c5c5c5%3A0xa7e7e7e7e7e7e7e7!2sOdisha!5e0!3m2!1sen!2sin!4v1712345678913!5m2!1sen!2sin"
  },
  {
    "id": 20,
    "name": "Punjab",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/golden-temple-punjab-hero?qlt=82&ts=1726662363452",
    "text": "Punjab, the land of five rivers, is known for its rich agricultural heritage, energetic folk culture, and the Golden Temple.",
    "coords": "!1m18!1m12!1m3!1d187535.66486561238!2d74.7800665!3d31.1471!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919597bb9bb9bb9%3A0xb7e7e7e7e7e7e7e7!2sPunjab!5e0!3m2!1sen!2sin!4v1712345678914!5m2!1sen!2sin"
  },
  {
    "id": 21,
    "name": "Rajasthan",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/1-umaid-bhavan-jodhpur-rajasthan-city-hero?qlt=82&ts=1726661010066",
    "text": "Rajasthan, known as the land of kings, is famous for its majestic forts, palaces, desert landscapes, and vibrant culture.",
    "coords": "!1m18!1m12!1m3!1d546521.6396326298!2d72.8381!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c5b5d5d5d5d5d%3A0xc7e7e7e7e7e7e7e7!2sRajasthan!5e0!3m2!1sen!2sin!4v1712345678915!5m2!1sen!2sin"
  },
  {
    "id": 22,
    "name": "Sikkim",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/gurudongmar-lake-mangan-sikkim-hero-hs?qlt=82&ts=1726655864214",
    "text": "Sikkim is a Himalayan state known for its stunning landscapes, Buddhist monasteries, and rich biodiversity.",
    "coords": "!1m18!1m12!1m3!1d104061.83256413764!2d88.4000!3d27.5330!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e06f7e7e7e7e7e%3A0xf7e7e7e7e7e7e7e7!2sSikkim!5e0!3m2!1sen!2sin!4v1712345678916!5m2!1sen!2sin"
  },
  {
    "id": 23,
    "name": "Tamil Nadu",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/1-meenakshi-amman-temple-madurai-tamil-nadu-attr-hero?qlt=82&ts=1726654442664",
    "text": "Tamil Nadu boasts a rich Dravidian heritage, famous temples, classical dance, and beautiful coastal areas.",
    "coords": "!1m18!1m12!1m3!1d247083.01434505217!2d78.0071!3d11.1271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba962c9c9c9c9c9%3A0xd7e7e7e7e7e7e7e7!2sTamil%20Nadu!5e0!3m2!1sen!2sin!4v1712345678917!5m2!1sen!2sin"
  },
  {
    "id": 24,
    "name": "Telangana",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/2-charminar_hyderabad_telangana-1-city-hero?qlt=82&ts=1726653248112",
    "text": "Telangana is known for its historic sites like Charminar, rich culture, and thriving IT hubs.",
    "coords": "!1m18!1m12!1m3!1d230877.9859681973!2d78.4867!3d17.1232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcbcbcbcbcbcbcb%3A0xc7e7e7e7e7e7e7e7!2sTelangana!5e0!3m2!1sen!2sin!4v1712345678918!5m2!1sen!2sin"
  },
  {
    "id": 25,
    "name": "Tripura",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/rudrasagar-lake-melaghar-2-attr-hero?qlt=82&ts=1726651019295",
    "text": "Tripura is a small northeastern state known for its lush greenery, palaces, and diverse tribal cultures.",
    "coords": "1m18!1m12!1m3!1d36241.491216888636!2d91.2775!3d23.9408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374d4bd27b7f5e2d%3A0x9e0acbd38be3a9a8!2sTripura!5e0!3m2!1sen!2sin!4v1712345678904!5m2!1sen!2sin"
  },
  {
    "id": 26,
    "name": "Uttar Pradesh",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/ram-janmaboomi-ayodhya-uttar%20pradesh-1?qlt=82&ts=1726649833165",
    "text": "Uttar Pradesh is India's most populous state, known for historic sites like the Taj Mahal, religious diversity, and rich cultural heritage.",
    "coords": "1m18!1m12!1m3!1d560084.5738855942!2d78.9219!3d26.8467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0e0c0b1f7b3b%3A0x5c89e9e1c72f5b88!2sUttar%20Pradesh!5e0!3m2!1sen!2sin!4v1712345678904!5m2!1sen!2sin"
  },
  {
    "id": 27,
    "name": "Uttarakhand",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/badrinath-temple-uttarakhand-state-hero?qlt=82&ts=1726647031134",
    "text": "Uttarakhand is famed for its Himalayan mountains, spiritual pilgrimage sites, and adventure tourism.",
    "coords": "1m18!1m12!1m3!1d191381.89628882728!2d78.3173!3d30.0668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390a0c302c3a8a9d%3A0x2bbd8e71e997bbfa!2sUttarakhand!5e0!3m2!1sen!2sin!4v1712345678904!5m2!1sen!2sin"
  },
  {
    "id": 28,
    "name": "West Bengal",
    "image": "https://s7ap1.scene7.com/is/image/incredibleindia/lord-buddha-statue-2-kalimpong-wb-city-hero?qlt=82&ts=1726645084728",
    "text": "West Bengal is known for its cultural richness, historical landmarks, the Sundarbans mangrove forest, and the bustling city of Kolkata.",
    "coords": "1m18!1m12!1m3!1d350095.7348894384!2d87.9603!3d22.9868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89f98f23a2a29%3A0x3cdd33a5b7f0df7e!2sWest%20Bengal!5e0!3m2!1sen!2sin!4v1712345678904!5m2!1sen!2sin"
  }
]
  

  
}