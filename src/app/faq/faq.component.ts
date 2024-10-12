import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  faqData = [
    { question: 'What is Wave+?', answer: 'Wave+ is a digital platform that empowers users to take part in sustainable development by supporting environmental, social, and governance (ESG) projects. It connects people and organizations to sustainable initiatives, helping build a resilient and inclusive future.' },
    { question: 'How is Wave+ supporting the SDGs (Sustainable Development Goals)?', answer: 'Wave+ is committed to driving progress on the United Nations Sustainable Development Goals by supporting projects that focus on climate action, clean energy, clean water, sustainable cities, and community development. By participating in Wave+, users contribute directly to these impactful goals and help create a better future for all.' },
    { question: 'What is Media Credit?', answer: 'Media Credit is a form of digital credit used within the Wave+ platform, allowing users to purchase, share, or redeem media assets that promote sustainability, such as educational content, promotional media, and more. It’s a way to spread the message of sustainable development while supporting creative work in this field.' },
    { question: 'How can I use Media Credit?', answer: 'You can use Media Credit to: Access premium media content focused on sustainability and ESG-related projects.Share valuable media with your network to raise awareness and support sustainability.Earn rewards through participation in campaigns and promotions on the platform.' },
    { question: 'How does the referral program work?', answer: 'The Wave+ referral program allows you to invite others to join the platform. When someone you refer signs up and starts participating, both you and the person you referred earn Media Credits. This is a way to grow the community and amplify the impact of sustainable projects.' },
    { question: 'Who is associated with Wave+?', answer: 'Wave+ is supported by a network of sustainability-focused partners, including organizations, NGOs, and individuals dedicated to advancing the SDGs.' }
  ];

  activeFaq: number | null = null;

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }
}
