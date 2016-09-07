describe('it tests our custom multiselect component', function () {
    this.timeout(0);

    let expect = chai.expect;

    var compile;
    var rootScope;
    var timeout;
    var document;

    beforeEach(() => angular.module('website-components-multiselect'));
    beforeEach((done) => {
        angular.injector(['ng', 'website-components-multiselect']).invoke([
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

    it('should load selected options', (done) => {
        let scope = rootScope.$new();
        scope.selected = ['aaa', 'bbb'];
        scope.options = ['aaa', 'bbb', 'ccc', 'ddd', 'eee'];
        let element = angular.element('<div data-tribe-multiselect data-selected-options="selected" data-available-options="options"></div>');
        compile(element)(scope);
        // append to body so we can click on it.
        element.appendTo(document.find('body'));
        timeoutTryCatch(100, done, () => {
            let selectedItems = angular.element(element.find('div[data-tribe-multiselect-selected] .items'));
            timeoutTryCatch(100, done, () => {
                let values = _.map(selectedItems, (item) => {
                    return angular.element(item).scope().opt;
                });
                expect(values).to.deep.equal(['aaa', 'bbb']);
                done();
            });
        });
    });

    let triggerKeyDown = function (element, keyCode) {
        var e = $.Event("keyup");
        e.keyCode = keyCode;
        element.trigger(e);
    };

    it('should show available options', (done) => {
        timeoutTryCatch(100, done, () => {
            let scope = rootScope.$new();
            scope.selected = ['aaa', 'bbb'];
            scope.options = ['aaa', 'bbb', 'ccc', 'ddd', 'eee'];
            let element = angular.element('<div data-tribe-multiselect data-selected-options="selected" data-available-options="options"></div>');
            // append to body so we can click on it.
            element.appendTo(document.find('body'));
            compile(element)(scope);
            timeoutTryCatch(100, done, () => {
                let input = angular.element(element.find('input'));
                timeoutTryCatch(100, done, () => {
                    input.focus();
                    expect(element.hasClass('active')).to.equal(true);
                    triggerKeyDown(input, 40);
                    timeoutTryCatch(100, done, () => {
                        let available = element.find('div[data-tribe-multiselect-available]');
                        // the list of items is visible
                        expect(available.hasClass('active')).to.equal(true);
                        done();
                    });
                });
            });
        });
    });

    it('should select selected items with the left-right keys', (done) => {
        timeoutTryCatch(100, done, () => {
            let scope = rootScope.$new();
            scope.selected = ['aaa', 'bbb', 'ccc'];
            scope.options = ['aaa', 'bbb', 'ccc', 'ddd', 'eee'];
            let element = angular.element('<div data-tribe-multiselect data-selected-options="selected" data-available-options="options"></div>');
            // append to body so we can click on it.
            element.appendTo(document.find('body'));
            compile(element)(scope);
            timeoutTryCatch(100, done, () => {
                let input = angular.element(element.find('input'));
                timeoutTryCatch(100, done, () => {
                    input.focus();
                    triggerKeyDown(input, 37); // left
                    timeoutTryCatch(100, done, () => {
                        let selected = element.find('div[data-tribe-multiselect-selected]');
                        expect(angular.element(selected.find('.selected')).scope().opt).to.equal('ccc');
                        triggerKeyDown(input, 39); // right
                        timeoutTryCatch(100, done, () => {
                            let selected = element.find('div[data-tribe-multiselect-selected]');
                            expect(angular.element(selected.find('.selected')).scope().opt).to.equal('aaa');
                            triggerKeyDown(input, 39); // right
                            timeoutTryCatch(100, done, () => {
                                let selected = element.find('div[data-tribe-multiselect-selected]');
                                expect(angular.element(selected.find('.selected')).scope().opt).to.equal('bbb');
                                triggerKeyDown(input, 8); // delete
                                timeoutTryCatch(100, done, () => {
                                    let selected = element.find('div[data-tribe-multiselect-selected]');
                                    expect(angular.element(selected.find('.selected')).scope().opt).to.equal('ccc');
                                    triggerKeyDown(input, 8); // delete
                                    timeoutTryCatch(100, done, () => {
                                        let selected = element.find('div[data-tribe-multiselect-selected]');
                                        expect(angular.element(selected.find('.selected')).scope().opt).to.equal('aaa');
                                        done();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('should enter new items', (done) => {
        timeoutTryCatch(100, done, () => {
            let scope = rootScope.$new();
            scope.selected = ['aaa', 'bbb', 'ccc'];
            scope.options = ['aaa', 'bbb', 'ccc', 'ddd', 'eee'];
            let element = angular.element('<div data-tribe-multiselect data-selected-options="selected" data-available-options="options"></div>');
            // append to body so we can click on it.
            element.appendTo(document.find('body'));
            compile(element)(scope);
            timeoutTryCatch(100, done, () => {
                let selected = angular.element(element.find('div[data-tribe-multiselect-selected]'));
                let input = angular.element(selected.find('input'));
                timeoutTryCatch(100, done, () => {
                    input.focus();
                    let selectedScope = selected.scope();
                    selectedScope.$apply(() => selectedScope.inputText = 'fff');
                    timeoutTryCatch(100, done, () => {
                        triggerKeyDown(input, 13); // enter
                        timeoutTryCatch(100, done, () => {
                            let lastSelected = selected.find('.items').last();
                            expect(angular.element(lastSelected).scope().opt).to.equal('fff');
                            selectedScope.$apply(() => selectedScope.inputText = 'eee');
                            timeoutTryCatch(100, done, () => {
                                triggerKeyDown(input, 13); // enter
                                timeoutTryCatch(100, done, () => {
                                    let lastSelected = selected.find('.items').last();
                                    expect(angular.element(lastSelected).scope().opt).to.equal('eee');
                                    triggerKeyDown(input, 40); // arrowdown
                                    timeoutTryCatch(100, done, () => {
                                        let available = element.find('div[data-tribe-multiselect-available]');
                                        // the list of items is visible
                                        expect(available.hasClass('active')).to.equal(true);
                                        let availableOptions = document.find('div.tribe-data-tribe-multiselect-available-body div.option');
                                        expect(availableOptions.length).to.equal(1);
                                        expect(angular.element(availableOptions.last()).scope().opt).to.equal('ddd');
                                        triggerKeyDown(input, 40); // arrowdown
                                        timeoutTryCatch(100, done, () => {
                                            triggerKeyDown(input, 13); // enter
                                            timeoutTryCatch(100, done, () => {
                                                expect(angular.element(selected.find('.items').last()).scope().opt).to.equal('ddd');
                                                done();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});