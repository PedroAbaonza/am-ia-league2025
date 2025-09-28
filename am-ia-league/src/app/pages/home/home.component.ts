import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { RoutesTimelineComponent } from '../../components/routes-timeline/routes-timeline.component';
import { PointsSystemComponent } from '../../components/points-system/points-system.component';
import { SquadsOverviewComponent } from '../../components/squads-overview/squads-overview.component';
import { ImportantDatesComponent } from '../../components/important-dates/important-dates.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroSectionComponent,
    RoutesTimelineComponent,
    PointsSystemComponent,
    SquadsOverviewComponent,
    ImportantDatesComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
