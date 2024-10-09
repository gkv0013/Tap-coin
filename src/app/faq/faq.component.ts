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
    { question: 'What is your refund policy?', answer: 'Our refund policy allows refunds within 30 days of purchase.' },
    { question: 'How can I track my order?', answer: 'You can track your order using the tracking link sent to your email.' },
    { question: 'What payment methods do you accept?', answer: 'We accept credit cards, PayPal, and other popular payment methods.' },
    { question: 'How do I change my account details?', answer: 'You can change your account details in your account settings.' }
  ];

  activeFaq: number | null = null;

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }
}
