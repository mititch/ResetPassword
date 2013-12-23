
angular.module("myApp.components.other", [])

    .factory('trace', ['$log', function ($log) {

        var Stopwatch = function () {
            var startTime = new Date();
            this.elapsed = function  ()
            {
                var endTime = new Date();
                $log.log('Elapsed, ms = ' + (endTime.getTime() - startTime.getTime()));
            };
        };

        return {
            stopwatch : function () {
                return new Stopwatch();
            },
            log : function (message) {
                $log.log(message);
            }

        };

    }])

    .factory('lzw', function () {
        return {

            encode : function (s) {
                var dict = {};
                var data = (s + "").split("");
                var out = [];
                var currChar;
                var phrase = data[0];
                var code = 256;
                for (var i=1; i<data.length; i++) {
                    currChar=data[i];
                    if (dict[phrase + currChar] != null) {
                        phrase += currChar;
                    }
                    else {
                        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                        dict[phrase + currChar] = code;
                        code++;
                        phrase=currChar;
                    }
                }
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                for (var i=0; i<out.length; i++) {
                    out[i] = String.fromCharCode(out[i]);
                }
                return out.join("");
            },

            decode : function(s) {
                var dict = {};
                var data = (s + "").split("");
                var currChar = data[0];
                var oldPhrase = currChar;
                var out = [currChar];
                var code = 256;
                var phrase;
                for (var i=1; i<data.length; i++) {
                    var currCode = data[i].charCodeAt(0);
                    if (currCode < 256) {
                        phrase = data[i];
                    }
                    else {
                        phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
                    }
                    out.push(phrase);
                    currChar = phrase.charAt(0);
                    dict[code] = oldPhrase + currChar;
                    code++;
                    oldPhrase = phrase;
                }
                return out.join("");
            }
        };
    });
