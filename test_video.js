    (function() {
      var baseUrl = 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/video/720_2400000/dash/';
      var initUrl = baseUrl + 'assets/video/hero_one_web.mp4';
      var templateUrl = baseUrl + 'segment_$Number$.m4s';
      var sourceBuffer;
      var index = 0;
      var numberOfChunks = 52;
      var video = document.querySelector('video');

      if (!window.MediaSource) {
        console.error('No Media Source API available');
        return;
      }

      var ms = new MediaSource();
      video.src = window.URL.createObjectURL(ms);
      ms.addEventListener('sourceopen', onMediaSourceOpen);

      function onMediaSourceOpen() {
        sourceBuffer = ms.addSourceBuffer('video/mp4; codecs="avc1.4d401f"');
        sourceBuffer.addEventListener('updateend', nextSegment);

        GET(initUrl, appendToBuffer);

        video.play();
      }

      function nextSegment() {
        var url = templateUrl.replace('$Number$', index);
        GET(url, appendToBuffer);
        index++;
        if (index > numberOfChunks) {
          sourceBuffer.removeEventListener('updateend', nextSegment);
        }
      }

      function appendToBuffer(videoChunk) {
        if (videoChunk) {
          sourceBuffer.appendBuffer(new Uint8Array(videoChunk));
        }
      }

      function GET(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function(e) {
          if (xhr.status != 200) {
            console.warn('Unexpected status code ' + xhr.status + ' for ' + url);
            return false;
          }
          callback(xhr.response);
        };

        xhr.send();
      }
    })();
