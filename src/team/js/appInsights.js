
/*********************************   CONFIGURATION PARAMETERS  **********************/
var INSTRUMENTATION_KEY = "12c3694b-0d9f-4809-aa76-1ef6768bfdb5";    //Make sure to relace INSTRUMENTATION KEY by yours from Azure portal
var timerInterval = 10000;                                           //this impacts frequency and amount of data collected: the interval at which "interval" event fires and details are collected
/*********************************   DO NOT CHANGE CODE BELOW  **********************/










var playbackTime = 0;   
var setIntervalId = 0;  
var aiPlayer;
var previousBitrate, currentBitrate;
var previousTime, currentTime;

function AppInsightsUtils() { }

AppInsightsUtils.initialize = function () {

    if (INSTRUMENTATION_KEY === "a408b7ca-a749-4b29-aab8-e5321e2f513b" && window.location.host !== "openidconnectweb.azurewebsites.net") { return; }

    var appInsights = window.appInsights || function (config) {
        function r(config) {
            t[config] = function () {
                var i = arguments; t.queue.push(function () { t[config].apply(t, i); });
            };
        }
        var t = { config: config }, u = document, e = window, o = "script", s = u.createElement(o), i, f; for (s.src = config.url || "//az416426.vo.msecnd.net/scripts/a/ai.0.js", u.getElementsByTagName(o)[0].parentNode.appendChild(s), t.cookie = u.cookie, t.queue = [], i = ["Event", "Exception", "Metric", "PageView", "Trace"]; i.length;) r("track" + i.pop()); return r("setAuthenticatedUserContext"), r("clearAuthenticatedUserContext"), config.disableExceptionTracking || (i = "onerror", r("_" + i), f = e[i], e[i] = function (config, r, u, e, o) { var s = f && f(config, r, u, e, o); return s !== !0 && t["_" + i](config, r, u, e, o), s }), t
    }({ instrumentationKey: INSTRUMENTATION_KEY });

    window.appInsights = appInsights;
    appInsights.trackPageView();
};

AppInsightsUtils.ampEventHandler4AppInsights = function (evt, amPlayer, videoTitle) {

    switch (evt.type) {
        case amp.eventName.loadstart:
            break;
        case amp.eventName.durationchange:
            break;
        case amp.eventName.loadeddata:
            break;
        case amp.eventName.loadedmetadata:
            break;
        case amp.eventName.canplaythrough:
            break;
        case amp.eventName.waiting:
            break;
        case amp.eventName.play:
            aiPlayer = amPlayer;
            setIntervalId = setInterval(AppInsightsUtils.trackPlaybackTime, timerInterval);
            break;
        case amp.eventName.playing:
            appInsights.trackEvent(evt.type, {
                srcUrl: amPlayer.currentSrc(),
                tech: amPlayer.currentTechName(),
                title: videoTitle,
            }, {
                    duration: amPlayer.duration()
                });
            break;
        case amp.eventName.ended:
            clearInterval(setIntervalId);
            appInsights.trackEvent(evt.type, {title: videoTitle,});
            break;
        case amp.eventName.seeking:
            //filter out all seeking events except the first one
            currentTime = amPlayer.currentAbsoluteTime();
            if (currentTime - previousTime > 1.0) {
                appInsights.trackEvent(evt.type, {title: videoTitle,}, {
                    currentAbsoluteTime: currentTime
                });
            }
            previousTime = currentTime;
            break;
        case amp.eventName.seeked:
            appInsights.trackEvent(evt.type, {title: videoTitle,}, {
                currentAbsoluteTime: amPlayer.currentAbsoluteTime()
            });
            break;
        case amp.eventName.pause:
            clearInterval(setIntervalId);
            appInsights.trackEvent(evt.type, {title: videoTitle,}, {
                currentAbsoluteTime: amPlayer.currentAbsoluteTime()
            });
            break;
        case amp.eventName.fullscreenchange:
            appInsights.trackEvent(evt.type);
            break;
        case amp.eventName.volumechange:
            appInsights.trackEvent(evt.type, {title: videoTitle,}, { volume: amPlayer.volume() });
            break;
        case amp.eventName.error:
            clearInterval(setIntervalId);
            break;
        case amp.eventName.timeupdate:
            break;
        case amp.eventName.playbackbitratechanged:
            currentBitrate = amPlayer.currentPlaybackBitrate();
            var measuredBandwidth = 0;
            if (!!amPlayer.videoBufferData() && !!amPlayer.videoBufferData().downloadCompleted) {
                measuredBandwidth = amPlayer.videoBufferData().downloadCompleted.measuredBandwidth.toFixed(0);
            }
            appInsights.trackEvent(evt.type, {title: videoTitle,}, {
                currentPlaybackBitrate: currentBitrate,
                previousPlaybackBitrate: previousBitrate,
                measuredBandwidth: measuredBandwidth
            });
            previousBitrate = currentBitrate;
            break;
        case amp.eventName.downloadbitratechanged:
            break;
        case amp.eventName.ratechange:
            appInsights.trackEvent(evt.type, {title: videoTitle,}, {
                playbackRate: amPlayer.playbackRate()
            });
            break;
        case amp.eventName.mute:
        case amp.eventName.unmute:
        case amp.eventName.resume:
        case amp.eventName.rewind:
        case amp.eventName.skip:
        case amp.eventName.exitfullscreen:
            appInsights.trackEvent(evt.type);
            break;
        default:
            appInsights.trackEvent(evt.type);
            break;
    }
};

//user force-select a video bitrate
AppInsightsUtils.trackEventHandler4AppInsights = function (evt, amPlayer) {
    var bitrate = amPlayer.currentPlaybackBitrate();
    appInsights.trackEvent("trackSelected",
        {},
        { selectedBitrate: bitrate });
};

//called in view: AppInsightsUtils.setAuthNUserContext(@System.Web.HttpContext.Current.Request.IsAuthenticated.ToString().ToLower(), "@System.Web.HttpContext.Current.User.Identity.Name");
AppInsightsUtils.setAuthNUserContext = function (authenticated, userid) {
    if (authenticated) {
        window.appInsights.setAuthenticatedUserContext(userid, userid);
    }
};

AppInsightsUtils.trackPlaybackTime = function () {
    playbackTime += timerInterval / 1000;

    //trackMetric
    //window.appInsights.trackMetric("playTime", playbackTime, {
    //    //bitrate: aiPlayer.currentPlaybackBitrate(),
    //    srcUrl:  aiPlayer.currentSrc(),
    //    tech:    aiPlayer.currentTechName()
    //});
    var audioStream = AppInsightsUtils.getEnabledAudioStream(aiPlayer);
    var audioName = "";
    if (audioStream) {
        audioName = audioStream.name;
    }
    var textTrack = AppInsightsUtils.getEnabledTextTrack(aiPlayer);
    var caption = "";
    if (textTrack) {
        caption = textTrack.language;
    }
    window.appInsights.trackEvent("interval", {
        srcUrl: aiPlayer.currentSrc(),
        tech: aiPlayer.currentTechName(),
        audio: audioName,
        cc: caption
    }, {
            bitrate: aiPlayer.currentPlaybackBitrate(),
            playTime: playbackTime,
            measuredBandwidth: (!!aiPlayer.videoBufferData() && !!aiPlayer.videoBufferData().downloadCompleted && !!aiPlayer.videoBufferData().downloadCompleted.measuredBandwidth) ? aiPlayer.videoBufferData().downloadCompleted.measuredBandwidth.toFixed(0) : 0
        });

    //optional: display only for my test player
    //if (INSTRUMENTATION_KEY == "a408b7ca-a749-4b29-aab8-e5321e2f513b") {
    //    var playbackTimeSpan = document.getElementById("playbackTime");
    //    playbackTimeSpan.innerHTML = playbackTime;
    //}
};

AppInsightsUtils.getEnabledAudioStream = function (amPlayer) {
    var audioStreamList = amPlayer.currentAudioStreamList();
    var audioStream = null;
    if (audioStreamList) {
        for (var i = 0; i < audioStreamList.streams.length; i++) {
            if (audioStreamList.streams[i].enabled) {
                audioStream = audioStreamList.streams[i];
                break;
            }
        }
    }

    return audioStream;
};

AppInsightsUtils.getEnabledTextTrack = function (amPlayer) {
    var textTracks = amPlayer.textTracks_;
    var textTrack = null;
    if (textTracks.length > 0) {
        for (var i = 0; i < textTracks.length; i++) {
            if (textTracks.tracks_[i].mode === "showing") {
                textTrack = textTracks.tracks_[i];
                break;
            }
        }
    }
    return textTrack;
};

//GPS coordinates
AppInsightsUtils.getGPS = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onLocated);
    }
};

function onLocated(position) {
    appInsights.trackEvent("cinema",
                           {
                               cookieEnabled:    navigator.cookieEnabled,
                               browserLanguage:  navigator.language
                           },
                           {
                               latitude:         position.coords.latitude,
                               longitude:        position.coords.longitude,
                               accuracy:         position.coords.accuracy,
                               screenWidth:      window.screen.width,
                               screenHeight:     window.screen.height,
                               devicePixelRatio: window.devicePixelRatio,
                               colorDepth:       window.screen.colorDepth,
                               pixelDepth:       window.screen.pixelDepth
                           });
}

AppInsightsUtils.initialize();
