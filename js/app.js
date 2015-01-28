$(function() {

  /*
   * Play videos on scroll
   */
  $(window).on('scroll', function() {
    var y = window.pageYOffset

    $('.js-work-video').each(function(video){
      var $elem = $(this)
      this.triggerPos = $elem.offset().top - (.3 * $(window).height())
      this.height = $elem.height() * 1.5

      if (y > this.triggerPos) {
        this.play()
      }
      if (y > this.triggerPos + this.height) {
        this.pause()
      }
      if (y < this.triggerPos + this.height) {
        console.log('play')
        return this.play()
      }
    })
  })

})