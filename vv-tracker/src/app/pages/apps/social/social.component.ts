import { Component, OnInit } from '@angular/core';
import { Link } from '../../../../@vex/interfaces/link.interface';
import { scaleIn400ms } from '../../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../../@vex/animations/fade-in-right.animation';
import { AuthService } from '../../shared/services/auth.service';

export interface FriendSuggestion {
  name: string;
  imageSrc: string;
  friends: number;
  added: boolean;
}

@Component({
  selector: 'vex-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class SocialComponent implements OnInit {
  userName: any;
  links: Link[] = [
    {
      label: 'ABOUT',
      route: './',
      routerLinkActiveOptions: { exact: true }
    },
    // {
    //   label: 'TIMELINE',
    //   route: './timeline'
    // },
    // {
    //   label: 'FRIENDS',
    //   route: '',
    //   disabled: true
    // },
    // {
    //   label: 'PHOTOS',
    //   route: '',
    //   disabled: true
    // }
  ];

  constructor
  (
    private _authSer: AuthService
  ) { }

  ngOnInit() {
    this.getAdminDetails();
  }

  getAdminDetails() {
    this._authSer.tokenDecoder(null);
    this.userName = this._authSer.firstName;
  }
}
