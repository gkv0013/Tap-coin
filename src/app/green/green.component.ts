import { Component } from '@angular/core';

@Component({
  selector: 'app-green',
  standalone: true,
  imports: [],
  templateUrl: './green.component.html',
  styleUrl: './green.component.css',
})
export class GreenComponent {
  cards = [
    {
      image:
        'https://storage.googleapis.com/cms-sgg-file-store-prd/ASSET_fashion_revolution.webp',
      title: 'Fashion revolution',
      description:
        'EWe love clothes. Increasingly, we love ‘fast fashion’. Not built to last, fast fashion doesn’t. Except in landfills. Take the quiz to check what our obsession with clothes is costing the Earth?',
      linkText: 'More',
      link: 'https://feature.undp.org/fashion-revolution/',
    },
    // Add more cards as needed
  ];
  locationImg = [
    { path: 'image/sdg-icons/E-WEB-Goal-01.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-02.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-03.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-04.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-05.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-06.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-07.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-08.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-09.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-10.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-11.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-12.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-13.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-14.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-15.png' },
    { path: 'image/sdg-icons/E-WEB-Goal-16.png' },
  ];
}
