angular.module('maximmcnairApp')
  .factory('ProjectsFactory', function() {
    var factory = {}

    var projects = [
      { title: 'Crunchd Mobile App'
      , slug: 'crunchd'
      , tags: ['iOS', 'Backbone', 'Phonegap']
      , hero: '/images/work_crunchd.jpg'
      , desc: '<p>Crunchd is a cross-platform utility providing a network for fruit and veg enthusiasts to swap tips and trade produce with other locally-based, green-fingered folk. </p><p> I worked with Synth Media to created a PhoneGap &amp;Backbone powered App for use on Andriod &amp;IOS. </p>'
      , href: 'http://itunes.com/apps/crunchd'
      // , thumb: 'http://d13yacurqjgara.cloudfront.net/users/29099/screenshots/883553/crunchd-trade_1x.png'
      }
    , { title: 'Talllies'
      , slug: 'talllies'
      , tags: ['Node JS', 'Socket IO', 'Angular']
      , hero: '/images/work_crunchd.jpg'
      , desc: '<p>Time tracking for developers. Focusing on product features as it\'s main time metric, Talllies shows you exactly how long each feature took and enables you to give more accurate quote next time around. </p><p> Built with a mix of Backbone &amp;Marionette on the front end with a REST API built with Node &amp;Express. </p>'
      , href: 'http://www.tallli.es/'
      , video: {
          'mp4' : '/images/background-video.mp4'
        , 'ogg' : '/images/background-video.theora.ogv'
        , 'webm' : '/images/background-video.webm'
        }
      // , thumb: 'http://d13yacurqjgara.cloudfront.net/users/29099/screenshots/1231579/talllies-time-tracking-landing.jpg'
      }
    // , { title: 'Frasier'
    //   , slug: 'fraiser'
    //   , tags: ['Angular']
    //   , hero: '/images/work_crunchd.jpg'
    //   , desc: 'Crunchd is a cross-platform utility providing a network for fruit and veg enthusiasts to swap tips and trade produce with other locally-based, green-fingered folk.'
    //   // , thumb: 'http://d13yacurqjgara.cloudfront.net/users/29099/screenshots/908153/woven-films_1x.png'
    //   }
    , { title: 'Esis'
      , slug: 'esis'
      , tags: ['Backbone', 'Node JS']
      , hero: '/images/work_crunchd.jpg'
      , desc: '<p>Synth Media\'s internal CMS built in Nodejs and Backbonejs. The interface features drag and drop modules for clients to build their own pages from pre designed widgets.</p>'
      // , thumb: 'http://d13yacurqjgara.cloudfront.net/users/29099/screenshots/908153/woven-films_1x.png'
      }
    // , { title: 'Loungers'
    //   , slug: 'loungers'
    //   , tags: ['Wordpress', 'Angular']
    //   , hero: '/images/work_crunchd.jpg'
    //   , desc: 'Crunchd is a cross-platform utility providing a network for fruit and veg enthusiasts to swap tips and trade produce with other locally-based, green-fingered folk.'
    //   // , thumb: 'http://d13yacurqjgara.cloudfront.net/users/29099/screenshots/908153/woven-films_1x.png'
    //   }
    , { title: 'Appinionated'
      , slug: 'appinionated'
      , tags: ['Angular', 'Node js']
      , hero: ''
      , desc: '<p>A app review site featuring "only the best designed apps for the iPhone". Appinionated consists of two Angular apps and an Nodejs API. A simple infinite scroll based fronted for the everyday viewer and a custom made CMS mirroring the fronted app design for the admins.</p>'
      }
    , { title: 'Comentorise'
      , slug: 'appinionated'
      , tags: ['Angular', 'Node js']
      , hero: ''
      , desc: ''
      }
    ]

    factory.get = function () {
      return projects
    }

    factory.getTask = function (slug) {
      for (var i = projects.length - 1; i >= 0; i--) {
        if (projects[i].slug == slug) {
          return projects[i]
        }
      }
    }

    return factory
  })