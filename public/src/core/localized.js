define( [ "json" ], function( json ) {
  var _strings,
      _readyCallback,
      _isReady = false,
      _requestedStrings = false;

  function ready( data ) {
     _readyCallback = _readyCallback || function(){};

    function domReady() {
      // If the DOM isn't ready yet, repeat when it is
      if ( document.readyState !== "complete" ) {
        document.onreadystatechange = domReady;
        return;
      }
      document.onreadystatechange = null;
      _strings = data;
      _isReady = true;
      _readyCallback();
    }

    domReady();
  }

  // Get the current lang from the document's HTML element, which the
  // server set when the page was first rendered. This saves us having
  // to pass extra locale info around on the URL.
  function getCurrentLang() {
    var html = document.querySelector( "html" );
    return html && html.lang ? html.lang : "en-US";
  }

  return {
    get: function( key ) {
      if ( !_strings ) {
        console.error( "[popcorn.webmaker.org] Error: string catalog not found." );
        return "";
      }
      return ( _strings[ key ] || "" );
    },

    getCurrentLang: getCurrentLang,

    // Localized strings are ready
    ready: function( cb ) {
      if ( !_requestedStrings ) {
        _requestedStrings = true;
        _readyCallback = cb;
        json.load( "/strings/" + getCurrentLang(),
          require,
          function callback( data ) { ready( data ); },
          {}
        );
      };
      if ( _isReady ) {
        _readyCallback();
      }
    },

    isReady: function() {
      return !!_isReady;
    }
  };
});
