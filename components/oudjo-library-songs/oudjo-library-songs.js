Polymer({
  is: 'oudjo-library-songs',

  properties: {
    librarySource: {
      type: Array
    }
  },

  ready: function() {

    this.librarySource = [
      { title: 'title1', artist: 'artist1' },
      { title: 'title2', artist: 'artist2' },
      { title: 'title3', artist: 'artist3' },
      { title: 'title4', artist: 'artist4' }
    ];

    // window.setTimeout(function() {
    //   this.librarySource = window.document.querySelector('oudjo-library').library;
    // }, 1000);
  }
});
