const ExpressionPattern = /^\s*((?:[a-z_$][a-z0-9_$]*)(?:\.[a-z_$][a-z0-9_$]*)*)\s*$/i
const RemovedFlag = '$$removed';

function findBlockIndexByValue(blocks, value) {
    for(let i = 0, j = blocks.length; i < j; ++i) {
        if (blocks[i].value === value)
            return i;
    }

    return -1;
}

FieldDynamicModelForEachDirective.$inject = [ '$q', '$animate', 'ModelBuilder' ];

export function FieldDynamicModelForEachDirective(q, animate, modelBuilder) {
    return {
        restrict: 'A',
        transclude: 'element',
        priority: 1000,
        terminal: true,
        dependencies: [ '$animate', '$compile', 'ModelBuilder' ],
        require: '^^dynamicModel',
    
        compile: function($element, attrs) {
            if (!attrs['fieldDynamicModelForEach'])
                throw new TypeError('field-dynamic-model-for-each: missing required attribute "field-dynamic-model-for-each"');

            return function(scope, $element, attrs, ctrl, transclude) {
                const expression = attrs['fieldDynamicModelForEach'];
                const match = expression.match(ExpressionPattern);

                if (match === null)
                    throw new TypeError(`field-dynamic-model-for=each: "${expression}" is not a valid field name`);

                const field = ctrl.model.field(match[1]);
                
                let lastBlocks = [];
    
                field.addAsyncValidator((f, addError) => {
                    return q.all(lastBlocks.map(b => b.model.validate()))
                        .then(results => results.every(r => r));
                });

                field.watch(onFieldUpdated);
                onFieldUpdated(field.value());
    
                function onFieldUpdated(newValue) {
                    let nextBlocks = [];
    
                    if (Array.isArray(newValue)) {
                        for(let i = 0, j = newValue.length; i < j; ++i) {
                            const value = newValue[i];
                            const idx = findBlockIndexByValue(lastBlocks, value);
    
                            if (idx >= 0) {
                                // Existing value
                                nextBlocks.push(lastBlocks[idx]);
                                lastBlocks.splice(idx, 1);
                            }
                            else {
                                // Never before seen value
                                const block = { value: value, scope: undefined, clone: undefined, model: createModel(field, value) };
                                nextBlocks.push(block);
                            }
                        }
                    }
    
                    // Remove blocks that weren't transferred
                    for(let i = 0, j = lastBlocks.length; i < j; ++i) {
                        const block = lastBlocks[i];
                        animate.leave(block.clone);
    
                        if (block.clone[0].parentNode)
                            block.clone[0][RemovedFlag] = true;
    
                        block.scope.$destroy();
                    }

                    let previousNode = $element[0];
    
                    for(let i = 0, j = nextBlocks.length; i < j; ++i) {
                        const block = nextBlocks[i];
    
                        if (!block.scope) {
                            // Brand new block
                            transclude((clone, scope) => {
                                block.scope = scope;
                                animate.enter(clone, null, previousNode);
                                previousNode = clone[0];
                                block.clone = clone;
                                updateBlock(block, i, nextBlocks.length);
                            });
                        }
                        else {
                            // Re-use the element
                            let nextNode = previousNode;
    
                            do {
                                nextNode = previousNode.nextSibling;
                            } while(nextNode && nextNode[RemovedFlag]);
    
                            if (block.clone[0] !== nextNode) {
                                // Order for this node doesn't match
                                animate.move(block.clone[0], null, previousNode);
                            }
    
                            previousNode = block.clone[0];
                            updateBlock(block, i, nextBlocks.length);
                        }
                    }
    
                    lastBlocks = nextBlocks;
                }
            };
    
            function updateBlock(block, index, totalBlocks) {
                block.scope.$model = block.model;
                block.scope.$index = index;
                block.scope.$count = totalBlocks;
            }

            function createModel(parentField, state) {
                const model = modelBuilder.build(state);
                model.subscribe(() => parentField.setDirty(true));
                return model;
            }
        }
    }; 
}

export function PreFieldDynamicModelForEachDirective() {
    return {
        restrict: 'A',
        priority: 1001,
        compile: function($element, attrs) {
            const wrapper = angular.element('<div dynamic-model="$model"></div>');
            const wrapperNode = wrapper[0];
            const parentNode = $element[0];
    
            while(parentNode.childNodes.length)
                wrapperNode.appendChild(parentNode.childNodes[0]);
    
            $element.append(wrapper);
        }
    };
}