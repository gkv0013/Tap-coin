import { CommonService } from '../common.service';
import { CollectService } from '../../core/services/collect.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; // Import ActivatedRoute
import { TelegramWebappService } from '@zakarliuka/ng-telegram-webapp';
declare var Telegram: any;
@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
})
export class GoalComponent implements OnInit {
  public commonService = inject(CommonService);
  public router = inject(Router);
  private route = inject(ActivatedRoute); // Inject ActivatedRoute
  private telegramServices = inject(TelegramWebappService);
  public currentGoalNo: string | null = null; // Store the user ID
  public goalData: any; // Variable to hold a single object
  public goalsData = [
    {
      title: 'No Poverty',
      goalNo: 1,
      description:
        'Eradicating poverty is not a task of charity, it’s an act of justice and the key to unlocking an enormous human potential. Still, nearly half of the world’s population lives in poverty, and lack of food and clean water is killing thousands every single day of the year. Together, we can feed the hungry, wipe out disease and give everyone in the world a chance to prosper and live a productive and rich life.',
      imagePath: 'image/sdg-banners/SDG1.png',
      moreInfo: 'https://www.globalgoals.org/goals/1-no-poverty/',
    },
    {
      title: 'Zero Hunger',
      goalNo: 2,
      description:
        'Hunger and malnutrition are the biggest risks to health worldwide – greater than AIDS, malaria, and tuberculosis combined. Ensuring people everywhere have access to sufficient and nutritious food all year round is essential.',
      imagePath: 'image/sdg-banners/SDG2.png',
      moreInfo: 'https://www.globalgoals.org/goals/2-zero-hunger/',
    },
    {
      title: 'Good Health and Well-Being',
      goalNo: 3,
      description:
        'Ensuring healthy lives and promoting the well-being of people of all ages is essential to sustainable development. Significant strides have been made in increasing life expectancy and reducing common killers associated with child and maternal mortality.',
      imagePath: 'image/sdg-banners/SDG3.png',
      moreInfo:
        'https://www.globalgoals.org/goals/3-good-health-and-well-being/',
    },
    {
      title: 'Quality Education',
      goalNo: 4,
      description:
        'Education enables upward socioeconomic mobility and is key to escaping poverty. Significant progress has been made in recent decades to increase access to education at all levels, particularly for girls and young women.',
      imagePath: 'image/sdg-banners/SDG4.png',
      moreInfo: 'https://www.globalgoals.org/goals/4-quality-education/',
    },
    {
      title: 'Gender Equality',
      goalNo: 5,
      description:
        'Gender equality is not only a fundamental human right, but a necessary foundation for a peaceful, prosperous, and sustainable world. Despite gains, gender inequality persists worldwide, depriving women and girls of their basic rights and opportunities.',
      imagePath: 'image/sdg-banners/SDG5.png',
      moreInfo: 'https://www.globalgoals.org/goals/5-gender-equality/',
    },
    {
      title: 'Clean Water and Sanitation',
      goalNo: 6,
      description:
        'Access to clean water and sanitation is essential for human health and survival. Water scarcity affects more than 40% of the global population and is projected to increase.',
      imagePath: 'image/sdg-banners/SDG6.png',
      moreInfo:
        'https://www.globalgoals.org/goals/6-clean-water-and-sanitation/',
    },
    {
      title: 'Affordable and Clean Energy',
      goalNo: 7,
      description:
        'Energy is at the heart of many of the world’s most critical economic, environmental, and developmental challenges. Sustainable energy is needed to combat climate change, create new job opportunities, and enhance the quality of life worldwide.',
      imagePath: 'image/sdg-banners/SDG7.png',
      moreInfo:
        'https://www.globalgoals.org/goals/7-affordable-and-clean-energy/',
    },
    {
      title: 'Decent Work and Economic Growth',
      goalNo: 8,
      description:
        'Sustainable economic growth requires the promotion of policies that encourage entrepreneurship, innovation, and job creation, ensuring that everyone benefits from economic progress.',
      imagePath: 'image/sdg-banners/SDG8.png',
      moreInfo:
        'https://www.globalgoals.org/goals/8-decent-work-and-economic-growth/',
    },
    {
      title: 'Industry, Innovation, and Infrastructure',
      goalNo: 9,
      description:
        'Inclusive and sustainable industrialization, along with innovation and resilient infrastructure, can unleash dynamic and competitive economic forces that generate employment and income.',
      imagePath: 'image/sdg-banners/SDG9.png',
      moreInfo:
        'https://www.globalgoals.org/goals/9-industry-innovation-and-infrastructure/',
    },
    {
      title: 'Reduced Inequalities',
      goalNo: 10,
      description:
        'To reduce inequalities, policies should be universal in principle, paying attention to the needs of disadvantaged and marginalized populations.',
      imagePath: 'image/sdg-banners/SDG10.png',
      moreInfo: 'https://www.globalgoals.org/goals/10-reduced-inequalities/',
    },
    {
      title: 'Sustainable Cities and Communities',
      goalNo: 11,
      description:
        'Making cities sustainable means creating career and business opportunities, safe and affordable housing, and building resilient societies and economies.',
      imagePath: 'image/sdg-banners/SDG11.png',
      moreInfo:
        'https://www.globalgoals.org/goals/11-sustainable-cities-and-communities/',
    },
    {
      title: 'Responsible Consumption and Production',
      goalNo: 12,
      description:
        'Sustainable consumption and production promote resource and energy efficiency, sustainable infrastructure, and provide access to basic services, green and decent jobs, and a better quality of life.',
      imagePath: 'image/sdg-banners/SDG12.png',
      moreInfo:
        'https://www.globalgoals.org/goals/12-responsible-consumption-and-production/',
    },
    {
      title: 'Climate Action',
      goalNo: 13,
      description:
        'Climate change is a global challenge that affects everyone, everywhere. Urgent and ambitious actions are needed to combat its impacts, build resilience, and reduce vulnerability to climate-related hazards and disasters.',
      imagePath: 'image/sdg-banners/SDG13.png',
      moreInfo: 'https://www.globalgoals.org/goals/13-climate-action/',
    },
    {
      title: 'Life Below Water',
      goalNo: 14,
      description:
        'Oceans and seas are the foundation of much of the world’s food production, with over 3 billion people relying on them for their livelihoods. Protecting them is vital for maintaining biodiversity and human life.',
      imagePath: 'image/sdg-banners/SDG14.png',
      moreInfo: 'https://www.globalgoals.org/goals/14-life-below-water/',
    },
    {
      title: 'Life on Land',
      goalNo: 15,
      description:
        'Forests, wetlands, drylands, and mountains are vital for the livelihoods of hundreds of millions of people worldwide. Protecting them is critical for sustainable development and biodiversity.',
      imagePath: 'image/sdg-banners/SDG15.png',
      moreInfo: 'https://www.globalgoals.org/goals/15-life-on-land/',
    },
    {
      title: 'Peace, Justice, and Strong Institutions',
      goalNo: 16,
      description:
        'Promoting peaceful, just, and inclusive societies, along with the provision of access to justice for all and building effective and accountable institutions, is essential for sustainable development.',
      imagePath: 'image/sdg-banners/SDG16.png',
      moreInfo:
        'https://www.globalgoals.org/goals/16-peace-justice-and-strong-institutions/',
    },
    {
      title: 'Partnerships for the Goals',
      goalNo: 17,
      description:
        'The SDGs can only be realized with a strong commitment to global partnership and cooperation. Partnerships must operate in ways that respect each country’s leadership and policies while providing a means to support their sustainable development efforts.',
      imagePath: 'image/sdg-banners/SDG17.png',
      moreInfo:
        'https://www.globalgoals.org/goals/17-partnerships-for-the-goals/',
    },
  ];
  isOverviewSelected: boolean = true;

  selectTab(tab: string) {
    if (tab === 'overview') {
      this.isOverviewSelected = true;
    } else {
      this.isOverviewSelected = false;
    }
  }

  ngOnInit(): void {
    this.currentGoalNo = this.route.snapshot.paramMap.get('id');
    this.goalData = this.goalsData.find(
      (goal) => goal.goalNo === Number(this.currentGoalNo)
    );
    this.enableBackButton();
  }
  enableBackButton() {
    this.telegramServices.backButton.show();
    if (Telegram.WebApp && Telegram.WebApp.BackButton) {
      Telegram.WebApp.BackButton.onClick(() => {
        console.log('Back button clicked');
        this.handleBackNavigation();
      });
    }
  }
  handleBackNavigation() {
    this.router.navigate(['/green']);
    this.commonService.setActiveTab('green');
    this.hideBackButton();
  }
  hideBackButton() {
    this.telegramServices.backButton.hide();
  }
  showMoreInfo(goalData: any) {
    this.router.navigate(['/more-info'], {
      queryParams: { id: goalData.goalNo, url: this.goalData.moreInfo },
    });
  }
}
