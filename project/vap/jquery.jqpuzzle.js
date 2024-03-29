/*
 * jqPuzzle - Sliding Puzzles with jQuery
 * Version 1.02
 * 
 * Copyright (c) 2008 Ralf Stoltze, http://www.2meter3.de/jqPuzzle/
 * Dual-licensed under the MIT and GPL licenses.
 */
(function ($) {
    $.fn.jqPuzzle = function (settings, texts) {
        var defaults = {
            rows: 3
            , cols: 3
            , hole: 9
            , shuffle: false
            , numbers: true
            , language: 'en'
            , control: {
                shufflePieces: true
                , confirmShuffle: true
                , toggleOriginal: false
                , toggleNumbers: false
                , counter: false
                , timer: false
                , pauseTimer: false
            }
            , success: {
                fadeOriginal: true
                , callback: undefined
                , callbackTimeout: 100
            }
            , animation: {
                shuffleRounds: 1
                , shuffleSpeed: 800
                , slidingSpeed: 200
                , fadeOriginalSpeed: 600
            }
            , style: {
                gridSize: 2
                , overlap: true
                , backgroundOpacity: 0.1
            }
        };
        var i18n = {
            en: {
                shuffleLabel: 'Shuffle'
                , toggleOriginalLabel: 'Original'
                , toggleNumbersLabel: 'Numbers'
                //, confirmShuffleMessage: 'Do you really want to shuffle?'
                , movesLabel: 'moves'
                , secondsLabel: 'seconds'
            }
        };
        if (settings && !settings.hole && (settings.rows || settings.cols)) {
            settings.hole = (settings.rows || defaults.rows) * (settings.cols || defaults.cols)
        }
        settings = $.extend(true, {}, defaults, settings);
        texts = $.extend((i18n[settings.language] || i18n[defaults.language]), texts);
        var rows = settings.rows
            , cols = settings.cols
            , hole = settings.hole;
        var control = settings.control
            , success = settings.success
            , animation = settings.animation
            , style = settings.style;
        if (rows < 3 || rows > 9) rows = defaults.rows;
        if (cols < 3 || cols > 9) cols = defaults.rows;
        if ((hole > (rows * cols)) || (hole < 1)) hole = rows * cols;
        hole--;
        if (animation.slidingSpeed < 1) animation.slidingSpeed = 1;
        if (animation.shuffleSpeed < 1) animation.shuffleSpeed = 1;
        if (animation.fadeOriginalSpeed < 1) animation.fadeOriginalSpeed = 1;
        if (animation.shuffleRounds < 1) animation.shuffleRounds = 1;
        var checkSolution = function ($pieces) {
            for (var i = 0; i < $pieces.length; i++) {
                var pieceIndex = (i < hole) ? i : i + 1;
                if ($pieces.eq(i).attr('current') != pieceIndex) return false
            }
            return true
        };
        var checkOrder = function (numbersArray) {
            var product = 1;
            for (var i = 1; i <= (rows * cols - 1); i++) {
                for (var j = (i + 1); j <= (rows * cols); j++) {
                    product *= ((numbersArray[i - 1] - numbersArray[j - 1]) / (i - j))
                }
            }
            return Math.round(product) == 1
        };
        var getLinearPosition = function (row, col) {
            return parseInt(row) * cols + parseInt(col)
        };
        var getMatrixPosition = function (index) {
            return {
                row: (Math.floor(index / cols))
                , col: (index % cols)
            }
        };
        var getBorderWidth = function ($element) {
            var property = $element.css('border-left-width');
            if ($element.css('border-left-style') != 'none') {
                switch (property) {
                case 'thin':
                    return 2;
                case 'medium':
                    return 4;
                case 'thick':
                    return 6;
                default:
                    return parseInt(property) || 0
                }
            }
            return 0
        };
        var Timer = function (interval, callback) {
            var startTime;
            var startPauseTime;
            var totalPause = 0;
            var timeout;
            var run = function () {
                update(new Date().getTime());
                timeout = setTimeout(run, interval)
            };
            var update = function (now) {
                callback(now - totalPause - startTime)
            };
            this.start = function () {
                if (startTime) return false;
                startTime = new Date().getTime();
                run()
            };
            this.stop = function () {
                if (!startTime) return false;
                clearTimeout(timeout);
                var now = new Date().getTime();
                if (startPauseTime) totalPause += now - startPauseTime;
                update(now);
                startTime = startPauseTime = undefined;
                totalPause = 0
            };
            this.pause = function () {
                if (!startTime || startPauseTime) return false;
                clearTimeout(timeout);
                startPauseTime = new Date().getTime()
            };
            this.resume = function () {
                if (!startPauseTime) return false;
                totalPause += new Date().getTime() - startPauseTime;
                startPauseTime = undefined;
                run()
            }
        };
        return this.filter('img').each(function () {
            var $srcImg = $(this);
            var lock = false;
            var moves = 0;
            var seconds = 0;
            var solved;
            var shuffled = settings.shuffle;
            var timer;
            var currHole = hole;
            var $dummyPiece = $('<div/>').addClass('jqp-piece');
            var $dummyWrapper = $('<div/>').addClass('jqp-wrapper').append($dummyPiece);
            var $dummyGui = $('<div/>').attr('class', $srcImg.attr('class') || '').addClass('jqPuzzle').append($dummyWrapper);
            $srcImg.replaceWith($dummyGui);
            $dummyGui.attr('id', $srcImg.attr('id') || '');
            var computedStyles = {
                gui: {
                    border: getBorderWidth($dummyGui)
                    , padding: {
                        left: parseInt($dummyGui.css('padding-left')) || 0
                        , right: parseInt($dummyGui.css('padding-right')) || 0
                        , top: parseInt($dummyGui.css('padding-top')) || 0
                        , bottom: parseInt($dummyGui.css('padding-bottom')) || 0
                    }
                }
                , wrapper: {
                    border: getBorderWidth($dummyWrapper)
                    , padding: parseInt($dummyWrapper.css('padding-left')) || 0
                }
                , piece: {
                    border: getBorderWidth($dummyPiece)
                }
            };
            $dummyGui.removeAttr('id');
            $dummyGui.replaceWith($srcImg);
            $srcImg.one('load', function () {
                var overlap = (style.gridSize === 0 && style.overlap);
                var coveredWidth = cols * (2 * computedStyles.piece.border) + (cols - 1) * style.gridSize;
                var coveredHeight = rows * (2 * computedStyles.piece.border) + (rows - 1) * style.gridSize;
                if (overlap) {
                    coveredWidth -= (cols - 1) * computedStyles.piece.border;
                    coveredHeight -= (rows - 1) * computedStyles.piece.border
                }
                $srcImg.css({
                    width: 'auto'
                    , height: 'auto'
                    , visibility: 'visible'
                });
                var width = Math.floor(($srcImg.width() - coveredWidth) / cols);
                var height = Math.floor(($srcImg.height() - coveredHeight) / rows);
                if (width < 30 || height < 30) return false;
                var fullWidth = cols * width + coveredWidth;
                var fullHeight = rows * height + coveredHeight;
                var imgSrc = $srcImg.attr('src');
                var totalPieceWidth = width + 2 * computedStyles.piece.border + style.gridSize;
                var totalPieceHeight = height + 2 * computedStyles.piece.border + style.gridSize;
                var boxModelHack = {
                    piece: $.boxModel ? 0 : 2 * computedStyles.piece.border
                    , wrapper: $.boxModel ? 0 : 2 * (computedStyles.wrapper.border + computedStyles.wrapper.padding)
                    , gui: {
                        width: $.boxModel ? 0 : 2 * computedStyles.gui.border + computedStyles.gui.padding.left + computedStyles.gui.padding.right
                        , height: $.boxModel ? 0 : 2 * computedStyles.gui.border + computedStyles.gui.padding.top + computedStyles.gui.padding.bottom
                    }
                };
                var getOffset = function (row, col) {
                    var offset = {
                        left: computedStyles.wrapper.padding + col * totalPieceWidth
                        , top: computedStyles.wrapper.padding + row * totalPieceHeight
                    };
                    if (overlap) {
                        offset.left -= col * computedStyles.piece.border;
                        offset.top -= row * computedStyles.piece.border
                    }
                    return offset
                };
                var shuffle = function (rounds, speed) {
                    if (speed) {
                        if ($shuffleButton.is('.jqp-disabled')) return false;
                        if (lock) return false;
                       // if (control.confirmShuffle && (moves > 0) && //!window.confirm(texts.confirmShuffleMessage)) return false;
                        lock = true;
                        if (solved) {
                            $gui.removeClass('jqp-solved');
                            $background.fadeTo(animation.fadeOriginalSpeed, style.backgroundOpacity, function () {
                                $background.remove().prependTo($wrapper);
                                $buttons.removeClass('jqp-disabled')
                            })
                        }
                    }
                    if (timer) timer.stop();
                    solved = false;
                    shuffled = true;
                    moves = 0;
                    seconds = 0;
                    if ($display) $display.removeClass('jqp-disabled');
                    if ($counter) $counter.val(moves);
                    if ($timer) $timer.val(seconds);
                    var shuffles = [];
                    var i = 0;
                    while (i < rounds) {
                        var choices = [];
                        for (var j = 0; j < rows * cols; j++) {
                            choices[j] = j
                        }
                        choices.splice(hole, 1);
                        shuffles[i] = [];
                        for (var j = 0; j < rows * cols; j++) {
                            if (j == hole) {
                                shuffles[i][j] = hole;
                                continue
                            }
                            var randomIndex = Math.floor(Math.random() * choices.length);
                            shuffles[i][j] = choices[randomIndex];
                            choices.splice(randomIndex, 1)
                        }
                        if (((i + 1) < rounds) || checkOrder(shuffles[i])) i++
                    }
                    var animCounter = 0;
                    for (var i = 0; i < rounds; i++) {
                        var lastRound = ((i + 1) == rounds);
                        for (var j = 0; j < shuffles[i].length; j++) {
                            if (j == hole) {
                                if (lastRound) currHole = hole;
                                continue
                            }
                            var pieceIndex = shuffles[i][j];
                            if (pieceIndex > hole) pieceIndex -= 1;
                            var $piece = $pieces.eq(pieceIndex);
                            var target = getMatrixPosition(j);
                            var offset = getOffset(target.row, target.col);
                            if (lastRound) $piece.attr('current', j.toString());
                            if (speed === undefined) {
                                $piece.css({
                                    left: offset.left
                                    , top: offset.top
                                })
                            }
                            else {
                                $piece.animate({
                                    left: offset.left
                                    , top: offset.top
                                }, speed, null, function () {
                                    animCounter++;
                                    if (animCounter == animation.shuffleRounds * (rows * cols - 1)) {
                                        lock = false;
                                        animCounter = 0
                                    }
                                })
                            }
                        }
                    }
                };
                var $wrapper = $('<div/>').addClass('jqp-wrapper').css({
                    width: fullWidth + boxModelHack.wrapper
                    , height: fullHeight + boxModelHack.wrapper
                    , borderWidth: computedStyles.wrapper.border
                    , padding: computedStyles.wrapper.padding
                    , margin: 0
                    , position: 'relative'
                    , overflow: 'hidden'
                    , display: 'block'
                    , visibility: 'inherit'
                });
                /*  puzzle piece style */
                var $protoPiece = $('<div/>').addClass('jqp-piece').css({
                    width: width + boxModelHack.piece
                    , height: height + boxModelHack.piece
                    , backgroundImage: 'url(' + imgSrc + ')'
                    , borderWidth: computedStyles.piece.border
                    , margin: 0
                    , padding: 0
                    , position: 'absolute'
                    , overflow: 'hidden'
                    , display: 'block'
                    , visibility: 'inherit'
                    , cursor: 'pointer'
                }).append($('<span/>'));
                var $pieces = $([]);
                for (var i = 0; i < rows; i++) {
                    for (var j = 0; j < cols; j++) {
                        var index = getLinearPosition(i, j);
                        if (index == hole) continue;
                        var offset = getOffset(i, j);
                        var bgLeft = -1 * (j * totalPieceWidth + computedStyles.piece.border);
                        var bgTop = -1 * (i * totalPieceHeight + computedStyles.piece.border);
                        if (overlap) {
                            bgLeft += j * computedStyles.piece.border;
                            bgTop += i * computedStyles.piece.border
                        }
                        $pieces = $pieces.add($protoPiece.clone().css({
                            left: offset.left
                            , top: offset.top
                            , backgroundPosition: (bgLeft + 'px ' + bgTop + 'px')
                        }).attr('current', String(index)).appendTo($wrapper).children().text(index + 1).end())
                    }
                }
                /* piece background */
                if (settings.shuffle) shuffle(1);
                var $background = $('<div/>').css({
                    width: fullWidth
                    , height: fullHeight
                    , left: computedStyles.wrapper.padding
                    , top: computedStyles.wrapper.padding
                    , backgroundImage:  'url(' + imgSrc + '),url(images/vap_logo.jpg)'
                    , borderWidth: 0
                    , margin: 0
                    , padding: 0
                    , position: 'absolute'
                    , opacity: style.backgroundOpacity
                }).prependTo($wrapper);
                var $controls = $('<div/>').addClass('jqp-controls').css({
                    visibility: 'inherit'
                    , display: 'block'
                    , position: 'static'
                });
                var $shuffleButton, $originalButton, $numbersButton;
                var $protoButton = $('<a/>').css('cursor', 'default');
                if (control.shufflePieces) {
                    $shuffleButton = $protoButton.clone().text(texts.shuffleLabel).appendTo($controls)
                }
                if (control.toggleOriginal) {
                    $originalButton = $protoButton.clone().text(texts.toggleOriginalLabel).appendTo($controls)
                }
                if (control.toggleNumbers) {
                    $numbersButton = $protoButton.clone().text(texts.toggleNumbersLabel).appendTo($controls);
                    if (settings.numbers) $numbersButton.addClass('jqp-toggle')
                }
                var $buttons = $controls.children();
                var $display, $counter, $timer;
                if (control.counter || control.timer) {
                    $display = $('<span/>').css('cursor', 'default').appendTo($controls);
                    var $protoField = $('<input/>').val(0).css({
                        width: '5ex'
                        , cursor: 'default'
                    }).attr('readonly', 'readonly');
                    if (control.counter) $counter = $protoField.clone().appendTo($display).after(texts.movesLabel + ' ');
                    if (control.timer) $timer = $protoField.clone().appendTo($display).after(texts.secondsLabel);
                    if (!settings.shuffle) $display.addClass('jqp-disabled')
                }
                var $panel = $('<div/>').css({
                    width: fullWidth + 2 * (computedStyles.wrapper.padding + computedStyles.wrapper.border)
                    , position: 'absolute'
                    , display: 'block'
                    , visibility: 'inherit'
                    , margin: '0px'
                    , padding: '0px'
                    , backgroundColor: 'transparent'
                });
                var $gui = $('<div/>').attr('class', $srcImg.attr('class') || '').addClass('jqPuzzle').css({
                    width: fullWidth + 2 * (computedStyles.wrapper.padding + computedStyles.wrapper.border) + boxModelHack.gui.width
                    , height: fullHeight + 2 * (computedStyles.wrapper.padding + computedStyles.wrapper.border) + boxModelHack.gui.height
                    , textAlign: 'left'
                    , overflow: 'hidden'
                    , display: 'block'
                }).append($wrapper).append($panel);
                $srcImg.replaceWith($gui);
                var id = $srcImg.attr('id');
                if (id) $gui.attr('id', id);
                if (!settings.numbers) $pieces.children().hide();
                if ($display) $display.children('input').val(0);
                var guiHeight = $gui.height();
                var panelHeight = $panel.height();
                $gui.height($gui.height() + $panel.height());
                if ($.browser.msie) $gui[0].onselectstart = function () {
                    return false
                };
                else $gui.mousedown(function () {
                    return false
                });
                $buttons.mousedown(function () {
                    if (!$(this).is('.jqp-disabled')) $(this).addClass('jqp-down')
                });
                $buttons.mouseout(function () {
                    $(this).removeClass('jqp-down')
                });
                $buttons.mouseup(function () {
                    $(this).removeClass('jqp-down')
                });
                $pieces.click(function () {
                    if (lock) return false;
                    if (solved) return false;
                    lock = true;
                    var $piece = $(this);
                    var current = $piece.attr('current');
                    var source = getMatrixPosition(current);
                    var dest = getMatrixPosition(currHole);
                    if (Math.abs(source.row - dest.row) + Math.abs(source.col - dest.col) != 1) {
                        lock = false;
                        return false
                    }
                    var offset = getOffset(dest.row, dest.col);
                    $piece.attr('current', String(currHole));
                    currHole = current;
                    if (shuffled) moves++;
                    if ($counter) $counter.val(moves);
                    if (moves == 1) {
                        if (!timer) timer = new Timer(333, function (ms) {
                            seconds = Math.floor(ms / 1000);
                            if ($timer) $timer.val(seconds)
                        });
                        timer.start()
                    }
                    $piece.animate({
                        left: offset.left
                        , top: offset.top
                    }, animation.slidingSpeed, null, function () {
                        if (shuffled) {
                            solved = checkSolution($pieces);
                            if (solved) {
                                if (timer) timer.stop();
                                shuffled = false;
                                $gui.addClass('jqp-solved');
                                window.setTimeout(finishGame, 100);
                            }
                            else lock = false;
                        }
                        else lock = false;
                    })
                });
                if (control.shufflePieces) $shuffleButton.click(function () {
                    shuffle(animation.shuffleRounds, animation.shuffleSpeed);
                });
                $(".mix_btn").click(function(){
                    shuffle(animation.shuffleRounds, animation.shuffleSpeed);
                });
                if (control.toggleOriginal) $originalButton.click(function () {
                    if ($originalButton.is('.jqp-disabled')) return false;
                    if (lock) return false;
                    lock = true;
                    if ($originalButton.is('.jqp-toggle')) {
                        if (control.shufflePieces) $shuffleButton.removeClass('jqp-disabled');
                        if (control.toggleNumbers) $numbersButton.removeClass('jqp-disabled');
                        $originalButton.removeClass('jqp-toggle');
                        $background.fadeTo(animation.fadeOriginalSpeed, style.backgroundOpacity, function () {
                            $(this).prependTo($wrapper);
                            if (control.pauseTimer && timer) timer.resume();
                            lock = false
                        })
                    }
                    else {
                        if (control.shufflePieces) $shuffleButton.addClass('jqp-disabled');
                        if (control.toggleNumbers) $numbersButton.addClass('jqp-disabled');
                        $originalButton.addClass('jqp-toggle');
                        if (control.pauseTimer && timer) timer.pause();
                        $background.appendTo($wrapper).fadeTo(animation.fadeOriginalSpeed, 1, function () {
                            lock = false
                        })
                    }
                    return false
                });
                if (control.toggleNumbers) $numbersButton.click(function () {
                    if ($numbersButton.is('.jqp-disabled')) return false;
                    if ($numbersButton.is('.jqp-toggle')) {
                        $numbersButton.removeClass('jqp-toggle');
                        $pieces.children().hide()
                    }
                    else {
                        $numbersButton.addClass('jqp-toggle');
                        $pieces.children().show()
                    }
                });
                /* puzzle success */
                var finishGame = function () {
                    if (success.fadeOriginal) {
                        if (control.toggleOriginal) $originalButton.addClass('jqp-disabled');
                        if (control.toggleNumbers) $numbersButton.addClass('jqp-disabled');
                        $background.appendTo($wrapper).fadeTo(animation.fadeOriginalSpeed, 1.0, function () {
                            
                   //$(".popup_area").fadeIn(300);
                       $(".sns_pop").fadeIn(300);     
                    $(".layer_bg").css("display", "block");
                            lock = false;
                            solutionCallback();
                        })
                    }
                    else {
                        lock = false;
                        solutionCallback()
                    }
                };
                var solutionCallback = function () {
                    if ($.isFunction(success.callback)) {
                        setTimeout(function () {
                            success.callback({
                                moves: moves
                                , seconds: seconds
                            })
                        }, success.callbackTimeout)
                    }
                }
            });
            var interval = setInterval(function () {
                if ($srcImg[0].complete) {
                    clearInterval(interval);
                    $srcImg.trigger('load')
                }
            }, 333)
        }).end()
    };
    $(document).ready(function () {
        $('img.jqPuzzle').each(function () {
            var microFormat = /\bjqp(-[a-z]{2})?-r(\d)-c(\d)(-h(\d+))?(-s(\d+))?(-[A-Z]+)?\b/;
            var match = microFormat.exec(this.className);
            var settings;
            if (match) {
                settings = {
                    rows: parseInt(match[2])
                    , cols: parseInt(match[3])
                    , hole: parseInt(match[5]) || null
                    , shuffle: match[8] && match[8].indexOf('S') != -1
                    , numbers: match[8] ? match[8].indexOf('N') == -1 : true
                    , language: match[1] && match[1].substring(1)
                };
                if (match[7]) {
                    settings.animation = {};
                    settings.animation.shuffleRounds = parseInt(match[7])
                }
                if (match[8] && match[8].search(/[ABCDE]/) != -1) {
                    settings.control = {};
                    settings.control.shufflePieces = match[8].indexOf('A') == -1;
                    settings.control.toggleOriginal = match[8].indexOf('B') == -1;
                    settings.control.toggleNumbers = match[8].indexOf('C') == -1;
                    settings.control.counter = match[8].indexOf('D') == -1;
                    settings.control.timer = match[8].indexOf('E') == -1
                }
            }
            $(this).jqPuzzle(settings)
        })
    })
})(jQuery);