import {Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarModule} from 'angular-calendar';
import { MonthViewDay } from 'calendar-utils';
@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CalendarModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.scss']
})
export class BookingCalendarComponent implements OnInit  {

    ngOnInit(): void {
    }

  viewDate = new Date();
  activeDayIsOpen = false;

  events: CalendarEvent[] = [
    // Popola qui con Booking reali dalla tua API!
    // {
    //   start: new Date('2025-09-01'),
    //   title: 'Gabriele - Fun Dive',
    //   color: { primary: '#067aa8', secondary: '#ffffff' },
    //   meta: { bookingId: 123, activity: 'Fun Dive' }
    // }
  ];

  dayClicked(day: MonthViewDay) {
    // Eventuale logica su click giorno
  }

  eventClicked(event: CalendarEvent) {
    // Apri dettaglio modale, quick action, ecc.
  }

};
