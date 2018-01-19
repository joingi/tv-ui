// GLOBAL --------------------------------------------/
var Example = {

    // Rename object from data.js
    data: prototypeRow,

    // Get the container for the interface
    container: document.getElementById('prototype'),

    // Get the container for the horizontal row
    row: document.getElementById('prototype-row'),

    dpadTimeout: undefined,
    dpadInterval: undefined,

    // Loads the content into the page.
    load: function() {
        window.addEventListener('gc.button.release', Example.dpadDirectionHold, false);
        window.addEventListener('keyup', Example.dpadDirectionHold, false);

        window.addEventListener('gc.button.press', Example.navigationHandler, false);
        window.addEventListener('keydown', Example.keysNavHandler, false);

        Example.constructUI();
    },

    // Handles functions for gamepad controller events.
    navigationHandler: function(event) {
        var button = event.detail.name;

        console.log(button);

        switch(button) {
            case 'FACE_1':
                Example.dpadHandler(button);
                break;
            case 'DPAD_LEFT':
                Example.dpadHandler(button);
                break;
            case 'DPAD_RIGHT':
                Example.dpadHandler(button);
                break;
            case 'LEFT_SHOULDER_BOTTOM':
                Example.changeCursor('prev', 0);
                break;
            case 'RIGHT_SHOULDER_BOTTOM':
                Example.changeCursor('next', Example.data.content.length - 1);
                break;
        }
    },

    // Handles functions for keyboard press events.
    keysNavHandler: function(event) {
        var key = event.which;

        switch(key) {
            case 13:
                Example.keysDpadHandler(key);
                break;
            case 39:
                Example.keysDpadHandler(key);
                break;
            case 37:
                Example.keysDpadHandler(key);
                break;
            case 188:
                Example.changeCursor('prev', 0);
                break;
            case 190:
                Example.changeCursor('next', Example.data.content.length - 1);
                break;
        }
    },

    // Functions for gamepad controller.
    // These functions are called by the handlers.
    dpadHandler: function(button) {
        var index = Example.row.getAttribute('data-selection');
        var selection = document.querySelector('.selected');

        if (button === 'FACE_1') {
            if (!selection.hasAttribute('data-transition')) {
                selection.setAttribute('data-transition', 'selection-transition-in');
                selection.addEventListener('animationend', function() {
                    selection.removeAttribute('data-transition');
                }, false);
            }
        } else if (button === 'DPAD_RIGHT') {
            if (index < Example.data.content.length - 1) {
                index++;
                Example.scroll('next');
                Example.changeCursor('next', index);
            } else {
                Example.scrollOverflow(Example.container, 'post');
            }
        } else if (button === 'DPAD_LEFT') {
            if (index > 0) {
                index--;
                Example.scroll('prev');
                Example.changeCursor('prev', index);
            } else {
                Example.scrollOverflow(Example.container, 'pre');
            }
        }

    },

    // Functions for keyboard press.
    // These functions are called by the handlers.
    keysDpadHandler: function(key) {
        var index = Example.row.getAttribute('data-selection');
        var selection = document.querySelector('.selected');

        if (key === 13) {
            if (!selection.hasAttribute('data-transition')) {
                selection.setAttribute('data-transition', 'selection-transition-in');
                selection.addEventListener('animationend', function() {
                    selection.removeAttribute('data-transition');
                }, false);
            }
        } else if (key === 39) {
            if (index < Example.data.content.length - 1) {
                index++;
                Example.changeCursor('next', index);
            } else {
                Example.scrollOverflow(Example.container, 'post');
            }
        } else if (key === 37) {
            if (index > 0) {
                index--;
                Example.changeCursor('prev', index);
            } else {
                Example.scrollOverflow(Example.container, 'pre');
            }
        }

    },

    // Need to clear the timeout & interval set by the scroll function.
    dpadDirectionHold: function() {
        window.clearTimeout(Example.dpadTimeout);
        window.clearInterval(Example.dpadInterval);
    },

    // Shows description.
    showDescription: function(index) {
        var index = Example.row.getAttribute('data-selection');
        var item = Example.data.content[index];

        var titleContainer = document.getElementById('title-container');
        titleContainer.remove();

        var sectionContainer = document.getElementById('description');

        var titleContainer = document.createElement('div');
        titleContainer.id = 'title-container';
        sectionContainer.appendChild(titleContainer);

        var eyebrow = document.createElement('h3');
        eyebrow.id = 'description-eyebrow';
        eyebrow.innerHTML = item.eyebrow;
        titleContainer.appendChild(eyebrow);

        var title = document.createElement('h1');
        title.id = 'description-title';
        title.innerHTML = item.title;
        titleContainer.appendChild(title);

        var summary = document.createElement('h2');
        summary.id = 'description-summary';
        summary.innerHTML = item.summary;
        titleContainer.appendChild(summary);
    },

    // Adds class to cursor.
    changeCursor: function(direction, index) {
        var direction = (direction === 'next') ? 0 : 2;

        var cursor = Example.row.querySelector('ol li:nth-child(' + (index + 1) + ') div.ui-cursor');
        var cursorPrev = Example.row.querySelector('ol li.selected div.ui-cursor');

        var selection = Example.row.querySelector('ol li:nth-child(' + (index + 1) + ')');
        var selectionPrev = Example.row.querySelector('ol li.selected');

        if (cursor) {

            if (index === 0) {
                if (cursorPrev) {
                    selectionPrev.removeClass('selected');
                }
                selection.addClass('selected');
            } else {
                selectionPrev.removeClass('selected');

                selection.addClass('selected');
            }

            Example.goToIndex(index);
            Example.showDescription(index);

        } else {
            Example.dpadDirectionHold();
        }
    },

    scroll: function(direction) {
        var direction = direction;
        var indexModifier = (direction === 'next') ? 1 : -1;
        Example.dpadTimeout = window.setTimeout(function() {
            Example.dpadInterval = window.setInterval(function() {
                var itemID = Example.row.getAttribute('data-selection');
                Example.changeCursor(direction, parseInt(itemID) + indexModifier);
            }, 100);
        }, 400);
    },

    scrollOverflow: function(container, direction) {
        if (!container.hasAttribute('data-overflow')) {
            container.setAttribute('data-overflow', direction);
            container.addEventListener('transitionend', function() {
                container.removeAttribute('data-overflow');
            }, false);
        }
    },

    // Builds the UI using the content from data.js
    constructUI: function() {

        Example.row.addClass('loading');

        window.setTimeout(function() {
            Example.row.innerHTML = '';

            if (Example.data.content) {
                var content = document.createElement('ol');

                for (var index = 0; index < Example.data.content.length; index++) {
                    var item = document.createElement('li');
                    var itemdata = Example.data.content[index];

                    var background = document.createElement('div');
                    background.addClass('bg-container');
                    item.appendChild(background);

                    var uiPlaceholder = document.createElement('div');
                    uiPlaceholder.addClass('ui-cursor');
                    background.appendChild(uiPlaceholder);

                    content.appendChild(item);
                }

                Example.row.appendChild(content);
                Example.row.setAttribute('data-selection', 0);
            }
            Example.row.removeClass('loading');
            Example.changeCursor('next', 0);
            Example.showDescription(0);
        }, 100);

        window.setTimeout(function() {

            var element = document.getElementById('prototype-row').querySelector('ol');

            if (element) {
                var singleItem = Example.row.querySelector('ol li');
                var width = singleItem.offsetWidth;
                var marginRight = parseInt(window.getComputedStyle(singleItem).marginRight);

                // combined width of all items, minus margin-right of last item, plus 90px padding-right
                minWidth = ((width + marginRight) * Example.data.content.length) - marginRight + 90;

                element.style.minWidth = minWidth + 'px';
            }

        }, 100);
    },

    // Controls distance and easing between elements in the carousel.
    goToIndex: function(index) {

        if (index >= 0 && index < Example.data.content.length) {

            var position = undefined;
            var columnWidth = Example.row.offsetWidth;
            var currentTime = 0;

            var increment = 32;

            if (index === 0) {
                position = 0;
            } else if (index === Example.data.content.length - 1) {
                position = Example.row.querySelector('ol').offsetWidth - columnWidth + 90;
            } else {
                var element = Example.row.querySelector('ol li:nth-child(' + (index + 1) + ')');
                var fromLeft = element.offsetLeft;
                var width = element.offsetWidth;
                var scroll = Example.row.scrollLeft;

                if ((fromLeft + width - scroll) > (columnWidth)) {
                    position = (fromLeft + width + (50 - ((480 * 0.0625))) + 90 + 90 + 30 - columnWidth);
                } else if ((fromLeft - scroll) <= 0) {
                    position = fromLeft - 40;
                }
            }

            if (position !== undefined) {
                currentTime += increment;
                var start = Example.row.scrollLeft;

                var step = (position - start) / (currentTime / 3.5);

                var interval = setInterval(function() {

                    if ((start < position && Example.row.scrollLeft < position) || (start > position && Example.row.scrollLeft > position)) {
                        Example.row.scrollLeft += step;
                    } else {
                        clearInterval(interval);
                    }

                }, 15);
            }

            Example.row.setAttribute('data-selection', index);

        } else {
            window.clearInterval(Example.dpadInterval);
        }
    }

}

// Adds hasClass, addClass and removeClass methods to Elements
Element.prototype.hasClass = function(className) {
    return this.className && new RegExp('(^|\\s)' + className + '(\\s|$)').test(this.className);
};

Element.prototype.addClass = function(className) {
    if (this.hasClass(className)) {
        return;
    }
    this.className += ' ' + className;
    return true;
};

Element.prototype.removeClass = function(className) {
    var re = new RegExp('(^|\\s)' + className + '(\\s|$)');
    this.className = this.className.replace(re, ' ');
    return true;
};


// Loads prototype data.
Example.load();
Controller.search();
Controller.globalSettings.update({
    useAnalogAsDpad: "both"
});


// Toggle Safe Area
function toggleSafeArea(event) {
    var safearea = document.getElementById("safe-area")
    if (event.detail.name === 'FACE_4' || event.key === 'y') {
        if (safearea.getAttribute('class') === 'hide') {
            safearea.setAttribute('class', 'show');
        } else if (safearea.getAttribute('class') === 'show') {
            safearea.setAttribute('class', 'hide');
        }
    }
};

window.addEventListener('gc.button.press', toggleSafeArea, false);
window.addEventListener('keydown', toggleSafeArea, false);


// Add overlay div if your controller is not connected.
function setup() {
    if (!navigator.getGamepads()[0]) {
        var overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.innerHTML = 'Press A to wake your controller.'
        document.body.appendChild(overlay);
    }
}

window.addEventListener('gc.controller.found', function() {
    var overlay = document.getElementById('overlay');
    if (overlay) {
        document.body.removeChild(overlay);
    }
}, false);

// If user doesn't have a controller, this function removes overlay by pressing 'A' key.
window.addEventListener('keydown', function(event) {
    if (event.key === 'a') {
        var overlay = document.getElementById('overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }
}, false);

window.addEventListener('gc.controller.lost', setup, false);

// setup();


