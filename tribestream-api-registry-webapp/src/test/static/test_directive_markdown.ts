describe('it tests our custom markdown component', () => {
    let expect = chai.expect;

    var compile;
    var rootScope;
    var timeout;
    var document;

    beforeEach(() => angular.module('website-components-text'));
    beforeEach((done) => {
        angular.injector(['ng', 'website-components-markdown']).invoke([
            '$compile', '$rootScope', '$timeout', '$document',
            function ($compile, $rootScope, $timeout, $document) {
                compile = $compile;
                rootScope = $rootScope;
                timeout = $timeout;
                document = $document;
            }]);
        done();
    });

    // it will destroy the scope, which will destroy all its elements.
    afterEach(() => rootScope.$destroy());

    let timeoutTryCatch = (ms, done, callback) => timeout(() => {
        try {
            callback();
        } catch (e) {
            done(e);
        }
    }, ms);

    let triggerKeyDown = function (element, keyCode) {
        var e = angular.element.Event("keyup");
        e.keyCode = keyCode;
        element.trigger(e);
    };

    it('should load markdown', (done) => {
        let scope = rootScope.$new();
        scope.myvalue = `
# title

body content here
        `;
        let element = angular.element('<div data-tribe-markdown data-value="myvalue"></div>');
        compile(element)(scope);
        // append to body so we can click on it.
        element.appendTo(document.find('body'));
        timeoutTryCatch(100, done, () => {
            expect(element.find('div.preview').html()).to.contain('<p>body content here</p>');
            done();
        });
    });

    it('should show markdown preview', (done) => {
        let scope = rootScope.$new();
        scope.myvalue = `
# title

*body* content here
`;
        let element = angular.element('<div data-tribe-markdown data-value="myvalue"></div>');
        compile(element)(scope);
        // append to body so we can click on it.
        element.appendTo(document.find('body'));
        timeoutTryCatch(100, done, () => {
            let toggleBtn = element.find('div.editor-toolbar > a.fa-eye');
            toggleBtn.click();
            timeoutTryCatch(100, done, () => {
                expect(element.find('div.editor-preview').html()).to.contain('<em>body</em>');
                done();
            });
        });
    });

});