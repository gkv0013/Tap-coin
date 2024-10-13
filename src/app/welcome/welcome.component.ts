import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { SwiperContainer } from 'swiper/element/bundle';
import { Card } from '../../core/interface/user';
import { SwiperOptions } from 'swiper/types';
import { register } from 'swiper/element/bundle';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomeComponent implements AfterViewInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  contents: Card[] = [
    {
      title: 'Wave+',
      description: 'Wave+ is a digital platform that empowers users to take part in sustainable development by supporting environmental, social, and governance (ESG) projects. It connects people and organizations to sustainable initiatives, helping build a resilient and inclusive future.',
      url: 'https://picsum.photos/id/1/640/480',
    },
    {
      title: 'Sustainable Development Goals',
      description: 'Wave+ is committed to driving progress on the United Nations Sustainable Development Goals by supporting projects that focus on climate action, clean energy, clean water, sustainable cities, and community development. By participating in Wave+, users contribute directly to these impactful goals and help create a better future for all.',
      url: 'https://picsum.photos/id/101/640/480',
    },
    {
      title: 'Media Credit',
      description: 'Media Credit is a form of digital credit used within the Wave+ platform, allowing users to purchase, share, or redeem media assets that promote sustainability, such as educational content, promotional media, and more. It’s a way to spread the message of sustainable development while supporting creative work in this field.',
      url: 'https://picsum.photos/id/401/640/480',
    },
  ];

  index = 0;
  public commonService = inject(CommonService);
  swiperConfig: SwiperOptions = {
    spaceBetween: 10,
    navigation: true,
    effect: 'cards',  
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true, 
    },
  };
  
  ngAfterViewInit() {
    this.swiper.nativeElement.swiper.activeIndex = this.index;
  }

  slideChange(swiper: any) {
    this.index = swiper.detail[0].activeIndex;
  }
  onStartClick() {
    this.commonService.setIsWelcome(false); 
  }
}
register();
