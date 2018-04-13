const DataKey = 'ng-dm-polyfill-display';

export function AddPolyfills() {
    // Add show/hide polyfills if jQuery isn't present
    if (typeof(angular.element.prototype.show) === 'undefined')
        angular.element.prototype.show = show;
    
    if (typeof(angular.element.prototype.hide) === 'undefined')
        angular.element.prototype.hide = hide;
}

function show() {
    const previous = this.data(DataKey) || 'block';
    this.css('display', previous);
}

function hide() {
    // Try store the original display (defaults to block)
    if (!this.data(DataKey)) {
        // TODO: look at perf on getComputedStyle
        const display = this.css('display') || getComputedStyle(this[0], null).display;
        this.data(DataKey, display && display !== 'none' ? display : 'block');
    }

    this.css('display', 'none');
}