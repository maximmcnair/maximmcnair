angular.module('maximmcnairApp')
  .factory('ProjectsFactory', function() {
    var factory = {}

    var projects = [
      { title: 'Crunchd Mobile App'
      , slug: 'crunchd'
      , tags: ['iOS', 'Backbone', 'Phonegap']
      , hero: '/images/work_crunchd.png'
      // , thumb: 'http://d13yacurqjgara.cloudfront.net/users/29099/screenshots/883553/crunchd-trade_1x.png'
      }
    , { title: 'Talllies'
      , slug: 'talllies'
      , tags: ['Node JS', 'Socket IO', 'Angular']
      , hero: '/images/work_crunchd.png'
      // , thumb: 'http://d13yacurqjgara.cloudfront.net/users/29099/screenshots/1231579/talllies-time-tracking-landing.jpg'
      }
    , { title: 'Frasier'
      , slug: 'fraiser'
      , tags: ['Angular']
      , hero: '/images/work_crunchd.png'
      // , thumb: 'http://d13yacurqjgara.cloudfront.net/users/29099/screenshots/908153/woven-films_1x.png'
      }
    , { title: 'Esis'
      , slug: 'esis'
      , tags: ['Backbone', 'Node JS']
      , hero: '/images/work_crunchd.png'
      // , thumb: 'http://d13yacurqjgara.cloudfront.net/users/29099/screenshots/908153/woven-films_1x.png'
      }
    , { title: 'Loungers'
      , slug: 'loungers'
      , tags: ['Wordpress', 'Angular']
      , hero: '/images/work_crunchd.png'
      // , thumb: 'http://d13yacurqjgara.cloudfront.net/users/29099/screenshots/908153/woven-films_1x.png'
      }
    ]

    factory.get = function () {
      return projects
    }

    factory.getTask = function (title) {
      for (var i = projects.length - 1; i >= 0; i--) {
        if (projects[i].id == id) {
          return projects[i]
        }
      }
    }

    return factory
  })