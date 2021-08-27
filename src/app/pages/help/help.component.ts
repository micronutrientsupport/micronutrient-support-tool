import { Component, OnInit } from '@angular/core';
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
declare const KLStoryMap: any;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function triggerStory() {
  const storymap_options = {
    width: 600, // required for embed tool; width of StoryMap
    height: 600, // required for embed tool; height of StoryMap
    font_css: 'Calibri', // optional; font set
    calculate_zoom: true, // optional; defaults to true.
    storymap: {
      language: 'en', // required; two-letter ISO language code
      map_type: 'osm:standard', // required
      map_as_image: true, // required
      // map_subdomains: string,    // optional
      slides: [
        {
          type: 'overview', // optional; if present must be set to "overview"
          // location: {            // required for all slides except "overview" slide
          //   lat: decimal,      // latitude of point on map
          //   lon: decimal       // longitude of point on map
          // },
          text: {
            // optional if media present
            headline: 'TEST',
            text: 'TEST', // may contain HTML markup
          },
          media: {
            // optional if text present
            url: 'https://miro.medium.com/max/10368/1*1XPSskRR5Mbe3X01BmV3zw.jpeg', // url for featured media
            // caption: string,   // optional; brief explanation of media content
            // credit: string     // optional; creator of media content
          },
        },
        {
          // type: "overview",      // optional; if present must be set to "overview"
          location: {
            // required for all slides except "overview" slide
            lat: 55.9486, // latitude of point on map
            lon: -3.1999, // longitude of point on map
          },
          text: {
            // optional if media present
            headline: 'TEST',
            text: 'TEST', // may contain HTML markup
          },
          media: {
            // optional if text present
            url: 'https://miro.medium.com/max/10368/1*1XPSskRR5Mbe3X01BmV3zw.jpeg', // url for featured media
            // caption: string,   // optional; brief explanation of media content
            // credit: string     // optional; creator of media content
          },
        },
      ], // required; array of slide objects (see below)
    },
  };

  // const storymap_options = {
  //   width: 5000, // required for embed tool; width of StoryMap
  //   height: 4532, // required for embed tool; height of StoryMap
  //   font_css: 'Calibri', // optional; font set
  //   calculate_zoom: false, // optional; defaults to true.
  //   // zoomControl: true,
  //   storymap: {
  //     language: 'en', // required; two-letter ISO language code
  //     map_type: 'zoomify', // required
  //     map_as_image: false, // required; omit connecting lines between slide locations
  //     map_background_color: '#808080', // optional; hexadecimal color value for map background
  //     zoomify: {
  //       path: 'https://sveouu.github.io/MAPS_story', // required; URL path to zoomable image folder
  //       //    path: './assets/images/',
  //       width: 5000, // required; maximum width of image
  //       height: 2266, // required; maximum height of image
  //       tolerance: 0.9, // required; display tolerance
  //     },
  //     slides: [
  //       {
  //         type: 'overview', // optional; if present must be set to "overview"
  //         location: {
  //           // required for all slides except "overview" slide
  //           //   lat: decimal,      // latitude of point on map
  //           //   lon: decimal       // longitude of point on map
  //           // zoom: 10,
  //         },
  //         text: {
  //           // optional if media present
  //           headline: 'Some Castles',
  //           text: 'TEXT' + '<br>' + '<button id="test-button" >test</button>', // may contain HTML markup
  //         },
  //         media: {
  //           // optional if text present
  //           url: '', // url for featured media
  //           // caption: string,   // optional; brief explanation of media content
  //           // credit: string     // optional; creator of media content
  //         },
  //       },
  //       {
  //         location: {
  //           // required for all slides except "overview" slide
  //           lat: 80.9486, // latitude of point on map
  //           lon: -125.1999, // longitude of point on map
  //           zoom: 8,
  //         },
  //         text: {
  //           // optional if media present
  //           headline: 'Edinburgh Castle',
  //           text: 'Edinburgh' + '<br>' + '<button id="test-button" >test</button>', // may contain HTML markup
  //         },
  //         media: {
  //           // optional if text present
  //           url: 'https://miro.medium.com/max/10368/1*1XPSskRR5Mbe3X01BmV3zw.jpeg', // url for featured media
  //           // caption: string,   // optional; brief explanation of media content
  //           // credit: string     // optional; creator of media content
  //         },
  //       },
  //       {
  //         location: {
  //           // required for all slides except "overview" slide
  //           lat: 65.9486, // latitude of point on map
  //           lon: -125.1999, // longitude of point on map
  //           zoom: 6,
  //         },
  //         text: {
  //           // optional if media present
  //           headline: 'Old Kincardine Castle',
  //           text: 'Kincardine Estate, Auchterarder', // may contain HTML markup
  //         },
  //         media: {
  //           // optional if text present
  //           url: 'https://i.pinimg.com/736x/d7/00/9d/d7009de6041addff3c9bf88c7c1bc147.jpg', // url for featured media
  //           // caption: string,   // optional; brief explanation of media content
  //           // credit: string     // optional; creator of media content
  //         },
  //       },
  //       {
  //         location: {
  //           // required for all slides except "overview" slide
  //           lat: 65.9486, // latitude of point on map
  //           lon: -3.1999, // longitude of point on map
  //           zoom: 16,
  //         },
  //         text: {
  //           // optional if media present
  //           headline: 'Drumlanrig Castle',
  //           text: 'South of Glasgow', // may contain HTML markup
  //         },
  //         media: {
  //           // optional if text present
  //           url: 'https://www.undiscoveredscotland.co.uk/thornhill/drumlanrigcastle/images/drumlanrig-450.jpg', // url for featured media
  //           // caption: string,   // optional; brief explanation of media content
  //           // credit: string     // optional; creator of media content
  //         },
  //       },
  //     ], // required; array of slide objects (see below)
  //   },
  // };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const storymap = new KLStoryMap.StoryMap('mapdiv', storymap_options);
  window.onresize = () => {
    storymap.updateDisplay(); // this isn't automatic
  };
}

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {
  ngOnInit(): void {
    triggerStory();
  }
}
