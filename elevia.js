/**
 * @name Elevia
 * @namespace
 */
Namespace('Elevia').
Class('Learn', {
  /**
   * @param window
   * @param document
   * @alias Elevia.Learn
   */
  construct: function(window, document) {
    this.window = window;
    this.document = document;

    this.setupUI();
  },
  setupUI: function() {
    var startstopButton = this.document.querySelector('button.startstop')
      , learnButton     = this.document.createElement('button')
      ;

    learnButton.setAttribute('style', startstopButton.getAttribute('style'));
    learnButton.className = startstopButton
      .className
      .replace('startstop', '') + ' learn';
    learnButton.appendChild(this.document.createTextNode('Learn'));

    startstopButton.parentNode.insertBefore(learnButton, startstopButton);
  }
});